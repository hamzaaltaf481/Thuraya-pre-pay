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


def test():
    driver = webdriver.Chrome()
    driver.execute_script("window.open('');")
