import time
import json
from database.models.models import User, PhoneNumber
import requests
from flask_jwt_extended import decode_token
from flask import jsonify
from selenium import webdriver
import os
from dotenv import load_dotenv
from selenium.webdriver.common.by import By
from utils.utils import check_valid
from database.database import get_card


load_dotenv()

def quick_refill_handler(request, session, logger):
    try:
        start_time = time.time()
        log_string = ""
        logger.info("refill request received")
        print("refill request received")
        log_string = log_string + "refill request received" + "\n"
        with open("constants.json") as f:
            constants = json.load(f)

        data = request.get_json()
        phone = data.get("phone")
        price = data.get("price")
        token = request.headers.get('Authorization')

        if not token:
            email=data.get('email')
            print(email)
            log_string = log_string + email + "\n"
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

        ip_address = "39.47.126.137"
        ip_info = requests.get(f"https://ipinfo.io/{ip_address}/json")
        user_agent = request.user_agent

        last_4_digits = phone[-4:]

        driver = webdriver.Chrome()

        phone_number = session.query(PhoneNumber).filter(PhoneNumber.phone == phone).first()
        if phone_number:
            password = phone_number.password
            # refill with the same thuraya service
        else:
            recharge_with_new_service(driver, phone, last_4_digits, user_agent, ip_info, email, session, user_id, logger, log_string, phone_number)
            pass

    except Exception as e:
        print(str(e))
        return jsonify({"message": "An error occurred"}), 500


def recharge_with_new_service(driver, phone, last_4_digits, user_agent, ip_info, email, session, user_id, logger, log_string, phone_number):
    with open("constants.json") as f:
        constants = json.load(f)

    driver.get(constants["rechargeUrl"])

    driver.find_element(By.ID, "EmailAddress").send_keys(os.getenv("THURAYA_RECHARGE_EMAIL"))
    driver.find_element(By.ID, "Password").send_keys(os.getenv("THURAYA_RECHARGE_PASSWORD"))
    driver.find_element(By.NAME, "Login_Form").submit()

    driver.get(constants["thurayaRechargeMyPhones"])

    # add phone and click update button
    driver.find_element(By.ID, "PhoneNo").send_keys(phone)
    driver.find_element(By.ID, "PhoneName").send_keys("Phone Name")

    driver.find_element(By.NAME, "AddPhone_Form").submit()

    phone_with_dashes = "88216-" + phone[:4] + "-" + phone[4:]

    # find the div with the phone number
    phone_div = driver.find_element(By.XPATH, f"//div[contains(text(), '{phone_with_dashes}')]")

    # wait for the data to be updated


    # do the refill with the old quick refill service

    # click update again

    # wait for the data to be updated

    # check if the refill was successful

    # get the updated balance
