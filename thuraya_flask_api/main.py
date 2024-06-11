# TODO: train the captcha solver model
# TODO: make the logs proper and readable in the database
# TODO: investigate why does selenium maxmizes randomly in refill
# TODO: cpanel deployment
# TODO: iot for kids
# TODO: robotics for kids
# TODO: exception handling for all the requests
# TODO: super-admin, sub-admin
# TODO: add timeout for the captcha solver
# TODO: maybe add multiple captcha solve requests
# TODO: add last name
# TODO: use form everywhere instead of json request input
# TODO: create admin and sub admin panels

from dotenv import load_dotenv
import os
import csv
from cryptography.fernet import Fernet
import re
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import json
from datetime import datetime
from bot.scrap import parse_data, check_refill_status
from handlers.transaction import create_transaction
from handlers.reset_password import reset_password
from handlers.forgot_password import forgot_password_handler
from handlers.login import login_handler
from handlers.confirm_email import confirm_email_handler
from handlers.signup import signup_handler
from handlers.card import add_card_detail_handler
from bot.captcha import solve_login_captcha, solve_refill_captcha, write_correct_statistic
from bot.bot import (
    fill_login_data,
    fill_scratch_data,
    fill_login_captcha_code,
    fill_refill_captcha_code,
    fill_login_refill,
    check_clicked
)
from handlers.transaction import create_transaction_detail
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.expected_conditions import staleness_of
from werkzeug.security import generate_password_hash
from logger.log import setup_logger
from database.migrate import migrate_tables
from database.database import get_card, get_codes
from utils.utils import check_valid, email_codes_password
from utils.import_file import import_csv
from database.models.models import User, Card, PhoneNumber
from database.database import database_session
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message
from flask import url_for
from flask_jwt_extended import JWTManager, decode_token

load_dotenv()
logger = setup_logger()
app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['JWT_SECRET_KEY'] = os.getenv("SECRET_KEY")
app.config['SECURITY_PASSWORD_SALT'] = os.getenv("SECURITY_PASSWORD_SALT")
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("SMTP_MAIL")
app.config['MAIL_SERVER'] = os.getenv("SMTP_SERVER")
app.config['MAIL_PORT'] = os.getenv("SMTP_PORT")
app.config['MAIL_USERNAME'] = os.getenv("SMTP_MAIL")
app.config['MAIL_PASSWORD'] = os.getenv("SMTP_PASSWORD")
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False

application = app
CORS(app, origins=['http://localhost:3000','http://localhost:3001'])

mail = Mail(app)
s = URLSafeTimedSerializer(os.getenv("SECRET_KEY"))
session = database_session()
jwt = JWTManager(app)

@app.route("/api", methods=["GET"])
def index():
    return jsonify({"status": "OK"}), 200


@app.route("/api/login_refill", methods=["POST"])
def start_driver():
    try:
        start_time = time.time()
        log_string = ""
        logger.info("login request received")
        print("login request received")
        log_string = log_string + "login request received" + "\n"
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
        # driver.minimize_window()
        # driver.maximize_window()
        driver.get(constants["indexUrl"])
        time.sleep(0.1)

        password = "12345"

        # check if a password exists against the given phone number
        phone_number = session.query(PhoneNumber).filter(PhoneNumber.phone == phone).first()
        if phone_number:
            password = phone_number.password

        print("using password: "+password)
        logger.info("using password: "+password)
        log_string = log_string + "using password: "+password + "\n"

        while True:

            wrong_creds = False
            html_content = driver.page_source
            if "Your phone number or password is wrong" in html_content:
                print("phone or password wrong")
                log_string = log_string + "phone or password wrong" "\n"
                logger.warning("phone or password wrong")
                wrong_creds = True
                if password == "12345":
                    password = "1234"
                    print("using password: "+password)
                    log_string = log_string + "using password: "+password + "\n"
                    logger.info("using password: "+password)
                elif password == "1234":
                    password = last_4_digits
                    print("using password: "+password)
                    log_string = log_string + "using password: "+password + "\n"
                    logger.info("using password: "+password)
                elif password == last_4_digits:
                    print("attempted all passwords")
                    log_string = log_string + "using password: "+password + "\n"
                    logger.error("attempted all passwords")
                    break

            current_url = driver.current_url
            if (
                constants["indexUrl"] in current_url
                or constants["loginHandler"] in current_url
            ):
                body = driver.find_element(By.TAG_NAME, "body")
                for reload in range(3):
                    outer_continue = False
                    try:
                        fill_login_data(driver, phone, password, logger, log_string)
                        break
                    except:
                        time.sleep(2)
                        driver.refresh()
                        outer_continue = True
                        break
                
                if outer_continue:
                    continue

                error_page = False
                if "error=captcha" in current_url:
                    print("captcha not solved")
                    log_string = log_string + "captcha not solved" + "\n"
                    logger.warning("captcha not solved")
                    error_page = True

                code = solve_login_captcha(error_page, wrong_creds, driver, logger, log_string)
                if code == "":
                    driver.get(constants["indexUrl"])
                fill_login_captcha_code(driver, code, logger)
                clicked = check_clicked(driver)
                if clicked == False:
                    print("IP timeout")
                    logger.warning("IP timeout")
                    print("sleeping for 10 seconds")
                    logger.warning("sleeping for 10 seconds")
                    log_string = log_string + "IP timeout" + "\n"
                    log_string = log_string + "sleeping for 10 seconds" + "\n"
                WebDriverWait(driver, 30).until(staleness_of(body))
            else:
                break

        discount =0
        try:
            promo_code = data.get("promo_code")
            # discount = find_discount(promo_code)
            if promo_code != None:
                log_string = log_string + str(promo_code) + "\n"

        except:
            promo_code = None
            log_string = log_string + "no promo code" + "\n"

        current_url = driver.current_url
        if constants["indexUrl"] in current_url:

            ################################
            ################################
            ################################
            ################################
            ################################


            total_time = time.time() - start_time
            with open("login_stats.csv", "a") as f:
                writer = csv.writer(f, delimiter=",")
                writer.writerow([total_time, phone, "failed", log_string])


            # TODO: remove this jsonify        
            return jsonify({"message": "Log in Failed"}), 500    


            ################################
            ################################
            ################################
            ################################
            ################################


            print("emailing codes")
            log_string = log_string + "emailing codes" + "\n"
            email_codes_password(codes, email, log_string)
            # TODO: add create transaction and create transaction detail
            return jsonify({"message": "success", "refill_status": "mailed"}), 200
        
        print("logged in")
        # create an instance of PhoneNumber model with password and phone_number and store in the database
        phone_number_model = PhoneNumber(phone=phone, password=password)
        session.add(phone_number_model)
        session.commit()


        log_string = log_string + "logged in" + "\n"
        write_correct_statistic()
        ################################
        ################################
        ################################
        ################################
        ################################

        # write the time taken for login in a csv file
        total_time = time.time() - start_time
        with open("login_stats.csv", "a") as f:
            writer = csv.writer(f, delimiter=",")
            writer.writerow([total_time, phone, password, log_string])


        # TODO: remove this jsonify        
        return jsonify({"message": "Logged in!"}), 200    

        ################################
        ################################
        ################################
        ################################
        ################################

        time.sleep(0.1)
        driver.get(constants["detailsUrl"])
        time.sleep(0.1)

        scraped = parse_data(driver)
        if scraped["status"] != "Active":
            print("not active")
            print("emailing codes")
            log_string = log_string + "not active" + "\n"
            log_string = log_string + "emailing codes" + "\n"
            email_codes_password(codes, email, log_string)
            # TODO: add create transaction and create transaction detail
            return jsonify({"message": "success", "scraped": scraped, "refill_status": "mailed"}), 200
        
        print(scraped)
        log_string = log_string + str(scraped) + "\n"
        logger.info(scraped)
        driver.get(constants["loginRefill"])
        driver.minimize_window()
        fill_login_refill(card_number, driver, logger)
        print("scratch card data entered")
        logger.info("scratch card data entered")
        log_string = log_string + "scratch card data entered" + "\n"
        driver.get(constants["refillStatus"])
        driver.minimize_window()
        status = check_refill_status(card_number, driver)
        driver.get(constants["detailsUrl"])
        driver.minimize_window()
        time.sleep(0.1)
        scraped_after_refill = parse_data(driver)
        print(scraped_after_refill)
        log_string = log_string + str(scraped_after_refill) + "\n"
        print(status)
        log_string = log_string + status + "\n"
        logger.info(status)

        transaction_id = create_transaction(user_id, ip_address, ip_info, user_agent, "refill", "stripe", session)
        create_transaction_detail(promo_code, transaction_id, log_string, discount, False, "", session, codes)

        time.sleep(3)
        total_time = time.time() - start_time
        with open("request_cycle_stats.csv", "a") as f:
            f.write(f"{total_time}\n")

        return jsonify({"message": "success", "scraped": scraped, "scraped_after_refill": scraped_after_refill, "refill_status": status}), 200
    except Exception as e:
        print(str(e))
        # TODO: uncomment this when going prod

        # msg = Message('Crash Report', recipients=["mrni8mare@gmail.com"])
        # msg.body = 'Server crashed with error: '+str(e)
        # mail.send(msg)
        return jsonify({"message": "An error occurred"}), 500

# ARCHIVED ROUTE
@app.route("/api/card", methods=["POST"])
def fill_card_data():

    with open("constants.json") as f:
        constants = json.load(f)
    data = request.get_json()
    price = data.get("price")
    card_number = get_card(price)
    phone = data.get("phone")
    print(f"phone: {phone}")
    logger.info(f"phone: {phone}")
    print(f"card_number: {card_number}")
    logger.info(f"card_number: {card_number}")

    driver = webdriver.Chrome()
    driver.minimize_window()
    driver.get(constants["directRefilUrl"])
    time.sleep(0.1)

    while True:
        html_content = driver.page_source

        if constants["scratchSuccessfulMessage"] in html_content:
            break
        else:
            body = driver.find_element(By.TAG_NAME, "body")
            fill_scratch_data(driver, phone, card_number, logger)

            error_page = False
            if "captcha error" in html_content:
                print("captcha not solved")
                logger.warning("captcha not solved")
                error_page = True

            code = solve_refill_captcha(error_page, driver, logger)
            fill_refill_captcha_code(driver, code, logger)
            WebDriverWait(driver, float("inf")).until(staleness_of(body))

    write_correct_statistic()
    print("refill successful")
    logger.info("refill successful")
    time.sleep(3)
    return jsonify({"message": "Card data filled"}), 200

@app.route("/api/purchase", methods=["POST"])
def purchase():
    transaction_logs = ""
    token = request.headers.get('Authorization')
    data = request.get_json()
    
    if not token:
        email=data.get('email')
        print(email)
        transaction_logs = transaction_logs + email + "\n"
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
    
    transaction_logs = transaction_logs + str(user_id) + "\n"
    print(user_id)

    discount =0
    try:
        promo_code = data.get("promo_code")
        # discount = find_discount(promo_code)
        if promo_code != None:
            transaction_logs = transaction_logs + str(promo_code) + "\n"

    except:
        promo_code = None
        transaction_logs = transaction_logs + "no promo code" + "\n"

    recharge_status = None
    # ip_address = request.remote_addr
    ip_address = "39.47.126.137"
    # TODO: dynamic ip address
    print(ip_address)
    transaction_logs = transaction_logs + ip_address + "\n"

    ip_info = requests.get(f"https://ipinfo.io/{ip_address}/json")
    user_agent = request.user_agent
    units = data.get("units")

    print(units)
    transaction_logs = transaction_logs + str(units) + "\n"
    transaction_id = create_transaction(user_id, ip_address, ip_info, user_agent, "purchase", "stripe", session)

    codes = get_codes(units, session)
    transaction_logs = transaction_logs + str(codes) + "\n"
    print("codes: ")
    print(codes)

    email_status, transaction_logs = email_codes_password(codes, email, transaction_logs)
    create_transaction_detail(promo_code, transaction_id, transaction_logs, discount, email_status, "", session, codes)
    return jsonify({"message": "success"}), 200

@app.route("/api/migrate", methods=["GET"])
def migrate_db():
    migrate_tables()
    return jsonify({"message": "success"}), 200

@app.route("/api/admin/import", methods=["POST"])
def import_cards():
    file = request.files['file']
    
    po_number = request.form.get("po_number")
    pl_number = request.form.get("pl_number")
    date_purchased = request.form.get("date_purchased")
    date_purchased = datetime.strptime(date_purchased, '%d-%m-%Y')
    total_amount = request.form.get("total_amount")
    payment_status = request.form.get("payment_status")
    payment_status = bool(payment_status)
    attachment_path = request.form.get("attachment_path")
    
    import_csv(po_number, pl_number, date_purchased, total_amount, payment_status, attachment_path, file)
    return jsonify({"message": "success"}), 200

@app.route('/api/admin/add-card-detail', methods=['POST'])
def add_card_detail():
    response, code = add_card_detail_handler(session)
    return response, code

@app.route('/api/admin/view-cards', methods=['POST'])
def view_cards():
    token = request.headers.get('Authorization')
    payload = decode_token(token)
    user_role = payload['user_role']

    # TODO: uncomment this check after testing
    # if user_role != "admin":
    #     return jsonify({'message': 'Unauthorized'}), 401
    
    cards = session.query(Card)
    cards_dict = [card.to_dict() for card in cards]
    print(cards_dict)

    for card_dict in cards_dict:
        cards_detail_dict = card_dict["card_details"]
        for card_detail_dict in cards_detail_dict:
            scratch_code = card_detail_dict["scratch_code"]
            key = os.getenv("ENCRYPTION_KEY")
            cipher_suite = Fernet(key)
            decrypted_number = cipher_suite.decrypt(scratch_code).decode('utf-8')
            card_detail_dict["scratch_code"] = decrypted_number
    
    return jsonify(cards_dict)


@app.route('/api/signup', methods=['POST'])
def signup():
    response, code = signup_handler(session, s, mail)
    return response, code



@app.route('/api/confirm_email/<token>')
def confirm_email(token):
    response, code = confirm_email_handler(session, s, token)
    return response, code


@app.route('/api/login', methods=['POST'])
def login():
    response, code = login_handler(session)
    return response, code


@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    response, code = forgot_password_handler(s, session, mail)
    return response, code

@app.route('/api/reset-password/<token>', methods=['POST'])
def reset_token(token):
    response, code = reset_password(s, token, session)
    return response, code

if __name__ == "__main__":
    app.run(debug=True)
