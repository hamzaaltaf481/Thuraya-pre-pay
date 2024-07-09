import time
import json
from database.models.models import User, FailedTransactions
import requests
from flask_jwt_extended import decode_token
from flask import jsonify
from selenium import webdriver
from dotenv import load_dotenv
from selenium.webdriver.common.by import By
from utils.utils import check_valid
from database.database import get_card
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import staleness_of
from selenium.webdriver.support import expected_conditions as EC
from bot.bot import fill_refill_captcha_code, fill_scratch_data
from bot.captcha import write_correct_statistic
import os
from twocaptcha import TwoCaptcha
from handlers.transaction import create_transaction
from handlers.transaction import create_transaction_detail
from utils.check_balance import find_details
from utils.utils import email_codes_password
from datetime import datetime
from PIL import Image
import csv

load_dotenv()

QUICK_REFILL_QUEUE = []

def quick_refill_handler(request, session, logger, driver, mail):
    log_string = ""
    try:
        start_time = time.time()
        logger.info("refill request received")
        print("refill request received")
        log_string = log_string + "refill request received" + "\n"

        data = request.get_json()
        phone = data.get("phone")
        price = data.get("price")
        # remove $ from price
        price = price.replace("$", "")
        token = request.headers.get('Authorization')

        if not token:
            email=data.get('email')
            new_user = User(email=email, country_region=data.get('country_region'), role='guest')
            session.add(new_user)
            session.commit()
            user_id = new_user.id
            print("guest user")
            log_string = log_string + "guest user" + "\n"
            logger.info("guest user")

        else:
            try:
                payload = decode_token(token)
                user_id = payload['user_id']
                user = session.query(User).filter(User.id == user_id).first()
                if user:
                    email = user.email
                    print("logged in user")
                    log_string = log_string + "logged in user" + "\n"
                    logger.info("logged in user")
            except Exception as e:
                print(str(e))
                return jsonify({"message": "Invalid token"}), 401
            
        valid = check_valid(phone, price)

        if not valid:
            print("phone or price invalid " + "phone: "  + str(phone) + "price: " + str(price))
            log_string = log_string + "phone or price invalid " + "phone: "  + str(phone) + "price: " + str(price) + "\n"
            logger.info("phone or price invalid " + "phone: "  + str(phone) + "price: " + str(price))
            return jsonify({"message": "Phone or Price invalid!"}), 400
            
        card_number, card_id, selling_price, error = get_card(price, session)
        if error:
            return jsonify({"message": error}), 400
        log_string = log_string + "scratch_card: " + card_number[-4:] + "\n"

        logger.info("phone: "+phone)
        print("phone: "+phone)
        logger.info("price: "+price)
        print("price: "+price)
        logger.info("email: "+email)
        print("email: "+email)
        log_string = log_string + "phone: "+phone + "\n"
        log_string = log_string + "price: "+price + "\n"
        log_string = log_string + "email: "+email + "\n"

        ip_address = request.remote_addr
        print("ip_address: "+ip_address)
        log_string = log_string + "ip_address: "+ip_address + "\n"
        logger.info("ip_address: "+ip_address)
        ip_info = requests.get(f"https://ipinfo.io/{ip_address}/json")
        user_agent = request.user_agent
        print("user_agent: "+str(user_agent))
        log_string = log_string + "user_agent: "+str(user_agent) + "\n"
        logger.info("user_agent: "+str(user_agent))
        
        codes = []
        codes.append({"number": card_number, "price": selling_price, "id": card_id})
        print(codes)
        log_string = log_string + str(codes) + "\n"
        logger.info(str(codes))

        discount = 0
        try:
            promo_code = data.get("promo_code")
            # discount = find_discount(promo_code)
            if promo_code != None:
                log_string = log_string + str(promo_code) + "\n"
        except:
            promo_code = None
            print("no promo code")
            log_string = log_string + "no promo code" + "\n"
            logger.info("no promo code")

        log_string, previous_balance, refill_allowed, last_active_date, error = find_details(phone, log_string, logger)
        if error:
            email_status, log_string = email_codes_password(codes, email, log_string, mail)
            transaction_id = create_transaction(user_id, ip_address, ip_info, user_agent, "refill_failed_so_emailed", "stripe", session)
            create_transaction_detail(promo_code, transaction_id, log_string, discount, email_status, "", session, codes)
            return jsonify({"message": "Invalid Account. You have been emailed with scratch code"}), 400
        
        if refill_allowed != "Yes":
            email_status, log_string = email_codes_password(codes, email, log_string, mail)
            transaction_id = create_transaction(user_id, ip_address, ip_info, user_agent, "refill_failed_so_emailed", "stripe", session)
            create_transaction_detail(promo_code, transaction_id, log_string, discount, email_status, "", session, codes)

            print("Refill not allowed")
            log_string = log_string + "Refill not allowed" + "\n"
            logger.info("Refill not allowed")
            return jsonify({"message": "Refill not allowed. Phone is inactive. You have been emailed with scratch code"}), 400
        log_string = perform_quick_refill(log_string, logger, card_number, phone, driver)

        log_string, new_balance, refill_allowed, last_active_date, error = find_details(phone, log_string, logger)
        transaction_id = create_transaction(user_id, ip_address, ip_info, user_agent, "refill", "stripe", session)
        create_transaction_detail(promo_code, transaction_id, log_string, discount, False, "", session, codes)

        # time.sleep(3)
        total_time = time.time() - start_time
        with open("request_cycle_stats.csv", "a") as f:
            f.write(f"{total_time}\n")
        return jsonify({"message": "Refill successful", "new_balance": new_balance, "previous_balance": previous_balance, "expiry_date": last_active_date}), 200

    except Exception as e:
        print(str(e))
        # create an instance of failed_transaction
        failed_transaction = FailedTransactions(log_string=log_string, date_time=datetime.now())
        session.add(failed_transaction)

        # commit the transaction
        session.commit()
        print(log_string)
        return jsonify({"message": "An error occurred"}), 500



def perform_quick_refill(log_string, logger, card_number, phone, driver):
    # TODO: remove this for production
    return log_string
    with open("constants.json") as f:
        constants = json.load(f)
    direct_refill_url = constants["directRefilUrl"]
    
    for z in range(1000): 
        if len(QUICK_REFILL_QUEUE) > 1:
            time.sleep(1)
        else:
            break

    driver.execute_script("window.open('');")
    new_tab_handle = driver.window_handles[-1]
    QUICK_REFILL_QUEUE.append(new_tab_handle)
    driver.switch_to.window(new_tab_handle)
    driver.get(direct_refill_url)
    WebDriverWait(driver, 30).until(EC.presence_of_all_elements_located((By.ID, 'captchaCode')))

    print("driver initiated")
    log_string = log_string + "driver initiated" + "\n"
    logger.info("driver initiated")

    solver = TwoCaptcha(os.getenv("CAPTCHA_SOLVER_API_KEY"))

    while True:
        html_content = driver.page_source

        tab_handle_info = QUICK_REFILL_QUEUE[0]
        if tab_handle_info == new_tab_handle:

            if constants["scratchSuccessfulMessage"] in html_content:
                try:
                    solver.report(captcha_id, True)
                    print("captcha reported as solved")
                except:
                    pass
                # close the current tab chrome
                QUICK_REFILL_QUEUE.remove(new_tab_handle)
                driver.close()
                driver.switch_to.window(driver.window_handles[0])
                break
            else:
                body = driver.find_element(By.TAG_NAME, "body")
                fill_scratch_data(driver, phone, card_number)
                print("phone and card data filled")
                log_string = log_string + "phone and card data filled" + "\n"
                logger.info("phone and card data filled")

                error_page = False
                if "captcha error" in html_content:
                    try:
                        solver.report(captcha_id, False)
                        print("captcha reported as not solved")
                    except:
                        pass
                    print("captcha not solved")
                    log_string = log_string + "captcha not solved" + "\n"
                    logger.warning("captcha not solved")
                    error_page = True

                code, captcha_id = solve_refill_captcha(logger, log_string, solver, new_tab_handle, driver)
                if code is None:
                    driver.refresh()
                    continue

                fill_refill_captcha_code(driver, code)
                print("captcha solution entered")
                log_string = log_string + "captcha solution entered" + "\n"
                logger.info("captcha solution entered")
                WebDriverWait(driver, float("inf")).until(staleness_of(body))
        else:
            time.sleep(1)

    write_correct_statistic()
    print("refill successful")
    log_string = log_string + "refill successful" + "\n"
    logger.info("refill successful")

    return log_string


def solve_refill_captcha(logger, log_string, solver, new_tab_handle, driver):

    if new_tab_handle not in QUICK_REFILL_QUEUE:
        QUICK_REFILL_QUEUE.append(new_tab_handle)

    try:
        with open("statistics.csv", "r", encoding="utf-8") as f:
            id = sum(1 for line in f) + 1
    except:
        id = 0

    for i in range(1000):
        
        tab_handle_info = QUICK_REFILL_QUEUE[0]
        if tab_handle_info == new_tab_handle:
            time.sleep(1)
            captcha_element = driver.find_element(By.ID, "theForm_CaptchaImage")
            captcha_element.screenshot(f"images/{id}.png")

            im = Image.open(f"images/{id}.png")
            im_resized = im.resize((300, 60))
            im_resized.save(f"images_resized/{id}.png", dpi=(300,300))
            print("screenshot taken")
            log_string = log_string + "screenshot taken" + "\n"
            logger.info("screenshot taken")

            print("sending solve request")
            log_string = log_string + "sending solve request" + "\n"
            logger.info("sending solve request")

            try:
                result = solver.normal(f"images_resized/{id}.png")
                break
            except:
                print("unsolvable captcha. Check screenshot taken")
                log_string = log_string + "unsolvable captcha. Check screenshot taken" + "\n"
                logger.warning("unsolvable captcha. Check screenshot taken")
                return None, None
            
        else:
            time.sleep(1)

    QUICK_REFILL_QUEUE.remove(new_tab_handle)
    code = result.get("code")
    QUICK_REFILL_QUEUE.append(new_tab_handle)
    for i in range(1000):
        if QUICK_REFILL_QUEUE[0] == new_tab_handle:
            break
        else:
            time.sleep(1)
    captcha_id = result.get("captchaId")

    with open("statistics.csv", "a", encoding="utf-8") as f:
        writer = csv.writer(f, delimiter=",")
        writer.writerow([id, code, "incorrect"])

    print("twoCaptcha response: "+code)
    log_string = log_string + "twoCaptcha response: "+code + "\n"
    logger.info("twoCaptcha response: "+code)
    return code, captcha_id
