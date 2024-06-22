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
from bot.captcha import solve_refill_captcha, write_correct_statistic
import os
from twocaptcha import TwoCaptcha
from handlers.transaction import create_transaction
from handlers.transaction import create_transaction_detail
from utils.check_balance import find_details
from datetime import datetime

load_dotenv()

QUICK_REFILL_QUEUE = []

def quick_refill_handler(request, session, logger, driver):
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
            # TODO: log here and return error message
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

        # TODO: uncomment this line
        # ip_address = request.remote_addr
        ip_address = "39.47.126.137"
        print("ip_address: "+ip_address)
        log_string = log_string + "ip_address: "+ip_address + "\n"
        logger.info("ip_address: "+ip_address)
        ip_info = requests.get(f"https://ipinfo.io/{ip_address}/json")
        user_agent = request.user_agent
        print("user_agent: "+str(user_agent))
        log_string = log_string + "user_agent: "+str(user_agent) + "\n"
        logger.info("user_agent: "+str(user_agent))
        
        # TODO: not sure about the point of this
        last_4_digits = phone[-4:]

        codes = []
        codes.append({"number": card_number, "price": selling_price, "id": card_id})
        print(codes)
        log_string = log_string + str(codes) + "\n"
        logger.info(str(codes))

        # TODO: maybe current status not needed
        log_string, previous_balance, refill_allowed, last_active_date, current_status, error = find_details(phone, log_string, logger)
        if error:
            return jsonify({"message": "Invalid Account"}), 400
        if refill_allowed != "Yes":
            print("Refill not allowed")
            log_string = log_string + "Refill not allowed" + "\n"
            logger.info("Refill not allowed")
            # TODO: maybe send email in this case
            return jsonify({"message": "Refill not allowed. Phone is inactive. Maybe implement email."}), 400
        log_string = perform_quick_refill(log_string, logger, card_number, phone, driver)
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

        log_string, new_balance, refill_allowed, last_active_date, current_status, error = find_details(phone, log_string, logger)
        transaction_id = create_transaction(user_id, ip_address, ip_info, user_agent, "refill", "stripe", session)
        create_transaction_detail(promo_code, transaction_id, log_string, discount, False, "", session, codes)

        time.sleep(3)
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
    return log_string
    with open("constants.json") as f:
        constants = json.load(f)
    
    for z in range(100): 
        if len(QUICK_REFILL_QUEUE) > 1:
            time.sleep(1)
        else:
            break


    direct_refill_url = constants["directRefilUrl"]
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

    write_correct_statistic()
    print("refill successful")
    log_string = log_string + "refill successful" + "\n"
    logger.info("refill successful")

    return log_string

