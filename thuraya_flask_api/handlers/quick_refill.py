import time
import json
from database.models.models import User, PhoneNumber
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


load_dotenv()

def quick_refill_handler(request, session, logger):
    try:
        start_time = time.time()
        log_string = ""
        logger.info("refill request received")
        print("refill request received")
        log_string = log_string + "refill request received" + "\n"

        data = request.get_json()
        phone = data.get("phone")
        price = data.get("price")
        token = request.headers.get('Authorization')

        if not token:
            email=data.get('email')
            new_user = User(email=email, country_region=data.get('country_region'), role='guest')
            session.add(new_user)
            session.commit()
            user_id = new_user.id

        else:
            try:
                payload = decode_token(token)
                user_id = payload['user_id']
                user = session.query(User).filter(User.id == user_id).first()
                if user:
                    email = user.email
            except Exception as e:
                print(str(e))
                return jsonify({"message": "Invalid token"}), 401
            
        valid = check_valid(phone, price)

        if not valid:
            return jsonify({"message": "Phone or Price invalid!"}), 400
            
        card_number, card_id, selling_price = get_card(price, session)
        log_string = log_string + "scratch_card: " + card_number[-4:] + "\n"
        # TODO: will be only used in case we need to email the user
        codes = []
        codes.append({"number": card_number, "price": selling_price, "id": card_id})

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

        phone_number = session.query(PhoneNumber).filter(PhoneNumber.phone == phone).first()
        if phone_number:
            print("password for phone found")
            log_string = log_string + "password for phone found" + "\n"
            logger.info("password for phone found")
            password = phone_number.password
            # TODO: refill with the same thuraya service
            # TODO: discuss maybe not needed
        else:
            print("password for phone not found")
            log_string = log_string + "password for phone not found" + "\n"
            logger.info("password for phone not found")
            log_string, old_balance, refill_allowed, last_active_date, current_status, error = find_details(phone, log_string, logger)
            if error:
                return jsonify({"message": "Invalid Account"}), 400
            if refill_allowed != "Yes":
                print("Refill not allowed")
                log_string = log_string + "Refill not allowed" + "\n"
                logger.info("Refill not allowed")
                # TODO: maybe send email in this case
                return jsonify({"message": "Refill not allowed. Phone is inactive."}), 400
            perform_quick_refill(log_string, logger, card_number, phone)
            log_string, new_balance, refill_allowed, last_active_date, current_status, error = find_details(phone, log_string, logger)
            return jsonify({"message": "Refill successful", "new_balance": new_balance, "old_balance": old_balance, "expiry date": last_active_date}), 200


    except Exception as e:
        print(str(e))
        return jsonify({"message": "An error occurred"}), 500



def find_details(phone, log_string, logger):
    with open("constants.json") as f:
        constants = json.load(f)
    
    data = {"msisdn":f"88216{phone}"}

    response = requests.post(constants["balanceAPI"], headers=constants["balanceAPIHeaders"], data=json.dumps(data))
    # wait for the retrieval of info

    # convert response to json
    response_json = response.json()

    try:
        error = response_json["Error"]
        print("Invalid Account")
        log_string = log_string + "Invalid Account" + "\n"
        logger.info("Invalid Account")
        return log_string, None, None, None, None, error
    except:
        print("balance: ")
        print(response_json["Credit Available"])
        log_string = log_string + "balance: " + response_json["Credit Available"] + "\n"
        logger.info("balance: " + response_json["Credit Available"])

        print("refill allowed: ")
        print(response_json["Refill Allowed"])
        log_string = log_string + "balance: " + response_json["Refill Allowed"] + "\n"
        logger.info("refill allowed: " + response_json["Refill Allowed"])

        print("expiry date: ")
        print(response_json["Last Active Date"])
        log_string = log_string + "balance: " + response_json["Last Active Date"] + "\n"
        logger.info("expiry date: " + response_json["Last Active Date"])

        print("current status: ")
        print(response_json["Current Status"])
        log_string = log_string + "balance: " + response_json["Current Status"] + "\n"
        logger.info("current status: " + response_json["Current Status"])

        return log_string, response_json["Credit Available"], response_json["Refill Allowed"], response_json["Last Active Date"], response_json["Current Status"], None


def perform_quick_refill(log_string, logger, card_number, phone):
    with open("constants.json") as f:
        constants = json.load(f)
    
    options = webdriver.ChromeOptions()
    # options.add_argument("--no-sandbox")
    # options.add_argument("--disable-dev-shm-usage")
    # options.add_argument("--disable-gpu")
    # options.add_argument("--disable-features=NetworkService")
    # options.add_argument("--disable-features=NetworkServiceInProcess")
    # options.add_argument("--disable-features=NetworkServiceInProcess")

    driver = webdriver.Chrome(options=options)
    driver.minimize_window()
    print("driver initiated")
    log_string = log_string + "driver initiated" + "\n"
    logger.info("driver initiated")

    driver.get(constants["directRefilUrl"])
    solver = TwoCaptcha(os.getenv("CAPTCHA_SOLVER_API_KEY"))

    while True:
        html_content = driver.page_source

        if constants["scratchSuccessfulMessage"] in html_content:
            try:
                solver.report(captcha_id, True)
            except:
                pass
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
                except:
                    pass
                print("captcha not solved")
                log_string = log_string + "captcha not solved" + "\n"
                logger.warning("captcha not solved")
                error_page = True

            code, captcha_id = solve_refill_captcha(error_page, driver, logger, log_string, solver)
            if code == None:
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
    time.sleep(3)

