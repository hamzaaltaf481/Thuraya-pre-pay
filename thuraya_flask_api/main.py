# TODO: train the captcha solver model
# TODO: cpanel deployment
# TODO: exception handling for all the requests
# TODO: add timeout for the captcha solver
# TODO: make sure to use json for refill and purchase and form elswewhere
# TODO: create admin and sub admin panels
# TODO: add admin checks when going into production
# TODO: make the message more detailed. but can mess up the frontend 
# TODO: format all code maybe
# TODO: ask Sir if to send the reciept to the user email for refill
# TODO: add timestamps for all tables
# TODO: move the archived code to new folder
# TODO: use single driver and use tabs for all the requests
# TODO: increase resolution of screenshot before solve request
# TODO: add the http protocol to .env. Maybe remove .env from .gitignore
# TODO: add logs for even when the return is not 200
# TODO: design the admin frontend with html
# TODO: add second input with confirm email
# TODO: minor adjustments in the frontend
# TODO: with the current main config does not auto reload the server with changes
# TODO: add better monitoring with either emails or with discord

import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from handlers.reset_password import reset_password
from handlers.forgot_password import forgot_password_handler
from handlers.login import login_handler
from handlers.confirm_email import confirm_email_handler
from handlers.signup import signup_handler
from handlers.admin import view_cards_handler, import_card_handler, add_card_detail_handler, view_scratch_codes_handler
from handlers.purchase import purchase_handler
from handlers.quick_refill import quick_refill_handler
from handlers.check_availability import check_availability_handler
from handlers.balance import balance_check_handler
from logger.log import setup_logger
from database.models.models import migrate_tables
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

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
CORS(app, origins=['http://localhost:3000','http://localhost:3001', 'https://signumtechnologies.com'])

mail = Mail(app)
s = URLSafeTimedSerializer(os.getenv("SECRET_KEY"))
jwt = JWTManager(app)
engine = create_engine(f"mysql+mysqlconnector://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DB')}")
Session = sessionmaker(bind=engine)

# IN CASE OF DB ISSUES
# @app.route("/api/rollback", methods=["GET"])
# def rollback():
#     session = Session()
#     try:
#         session.commit()
#     except:
#         session.rollback()
#     return jsonify({"status": "OK"}), 200

@app.route("/api", methods=["GET"])
def index():
    return jsonify({"status": "OK"}), 200

@app.route("/api/quick_refill", methods=["POST"])
def quick_refill():
    session = Session()
    response, code = quick_refill_handler(request, session, logger, driver)
    return response, code

@app.route("/api/balance_check", methods=["POST"])
def balance_check():
    session = Session()
    response, code = balance_check_handler(request, session, logger)
    return response, code

@app.route("/api/purchase", methods=["POST"])
def purchase():
    session = Session()
    response, code = purchase_handler(request, session, logger, mail)
    return response, code
    

@app.route("/api/check-availability", methods=["GET"])
def check_availability():
    session = Session()
    response, code = check_availability_handler(session)
    return response, code

@app.route("/api/migrate", methods=["GET"])
def migrate_db():
    session = Session()
    migrate_tables(session)
    return jsonify({"message": "success"}), 200

@app.route("/api/admin/import", methods=["POST"])
def import_cards():
    session = Session()
    response, code = import_card_handler(request, session)
    return response, code

@app.route('/api/admin/add-single-card', methods=['POST'])
def add_card_detail():
    session = Session()
    response, code = add_card_detail_handler(session)
    return response, code

@app.route('/api/admin/view-cards', methods=['POST'])
def view_cards():
    session = Session()
    response, code = view_cards_handler(session, request)
    return response, code

@app.route('/api/admin/view-scratch-codes', methods=['POST'])
def view_scratch_codes():
    session = Session()
    response, code = view_scratch_codes_handler(session, request)
    return response, code


@app.route('/api/signup', methods=['POST'])
def signup():
    session = Session()
    response, code = signup_handler(session, s, mail)
    return response, code



@app.route('/api/confirm_email/<token>')
def confirm_email(token):
    session = Session()
    response = confirm_email_handler(session, s, token)
    return response


@app.route('/api/login', methods=['POST'])
def login():
    session = Session()
    response, code = login_handler(session)
    return response, code


@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    session = Session()
    response, code = forgot_password_handler(s, session, mail)
    return response, code

@app.route('/api/reset-password/<token>', methods=['POST'])
def reset_token(token):
    session = Session()
    response, code = reset_password(s, token, session)
    return response, code

if __name__ == "__main__":
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)
    driver.maximize_window()
    host = '0.0.0.0' if os.getenv("ENV") == 'production' else 'localhost'
    app.run(debug=True, use_reloader=False, host=host)