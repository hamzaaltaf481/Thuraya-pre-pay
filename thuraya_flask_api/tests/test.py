from dotenv import load_dotenv
from twocaptcha import TwoCaptcha
from datetime import datetime
import pyautogui
from PIL import ImageGrab
import mysql.connector
import random
import os
from mss import mss
from dotenv import load_dotenv
from bs4 import BeautifulSoup


load_dotenv()


def test_solver():
    load_dotenv()
    solver = TwoCaptcha(os.getenv('CAPTCHA_SOLVER_API_KEY'))
    result = solver.normal('screenshot.png')
    print(result)

def test_screenshot():
    top_left = (988, 885)
    bottom_right = (1140, 918)

    width = bottom_right[0] - top_left[0]
    height = bottom_right[1] - top_left[1]

    screenshot = pyautogui.screenshot(region=(top_left[0], top_left[1], width, height))
    current_time = datetime.now().strftime("%Y%m%d%H%M%S%f")
    screenshot.save(f"{current_time}.png") 


def test_mss():
    with mss() as sct:
        # Get the size of the screen
        monitor = sct.monitors[1]  # 0 is the index of the primary monitor

        # Make sure the coordinates are within the bounds of the screen
        top_left = (min(988, monitor['width'] - 1), min(885, monitor['height'] - 1))
        bottom_right = (min(1140, monitor['width']), min(918, monitor['height']))

        width = bottom_right[0] - top_left[0]
        height = bottom_right[1] - top_left[1]
        print(width)
        print(height)
        print(top_left[0])
        print(top_left[1])

        screenshot = sct.grab({
            'left': top_left[0],
            'top': top_left[1],
            'width': width,
            'height': height
        })

        current_time = datetime.now().strftime("%Y%m%d%H%M%S%f")

        # Save the screenshot as a PNG file
        with open(f"{current_time}.png", 'wb') as f:
            mss.tools.to_png(screenshot.rgb, screenshot.size, output=f)


def test_pillow():
    top_left = (988, 885)
    bottom_right = (1140, 918)

    width = bottom_right[0] - top_left[0]
    height = bottom_right[1] - top_left[1]

    screenshot = ImageGrab.grab(bbox=(top_left[0], top_left[1], top_left[0] + width, top_left[1] + height))

    current_time = datetime.now().strftime("%Y%m%d%H%M%S%f")
    screenshot.save(f"{current_time}.png", 'PNG')

def test_insert_cards():
    db = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DB")
    )
    cursor = db.cursor()
    sql = "INSERT INTO cards (price, number, used) VALUES (%s, %s, %s)"

    for i in range(500):
        price = 10  
        number = ''.join(random.choices('0123456789', k=14)) 
        used = random.choice([0, 1]) 

        cursor.execute(sql, (price, number, used))
    
    for i in range(500):
        price = 39
        number = ''.join(random.choices('0123456789', k=14)) 
        used = random.choice([0, 1]) 

        cursor.execute(sql, (price, number, used))

    for i in range(500):
        price = 80
        number = ''.join(random.choices('0123456789', k=14)) 
        used = random.choice([0, 1]) 

        cursor.execute(sql, (price, number, used))

    for i in range(500):
        price = 160
        number = ''.join(random.choices('0123456789', k=14)) 
        used = random.choice([0, 1]) 

        cursor.execute(sql, (price, number, used))
    for i in range(500):
        price = 500
        number = ''.join(random.choices('0123456789', k=14)) 
        used = random.choice([0, 1]) 

        cursor.execute(sql, (price, number, used))
    for i in range(500):
        price = 1000
        number = ''.join(random.choices('0123456789', k=14)) 
        used = random.choice([0, 1]) 

        cursor.execute(sql, (price, number, used))
    for i in range(500):
        price = 2500
        number = ''.join(random.choices('0123456789', k=14)) 
        used = random.choice([0, 1]) 

        cursor.execute(sql, (price, number, used))

    db.commit()

def test_parse():
    with open('scrap.html', 'r') as file:
        data = file.read()

    soup = BeautifulSoup(data, 'html.parser')
    parent_td = soup.find(lambda tag: tag.name == 'td' and 'Activation date' in tag.text)
    response = {}
    
    status_td = parent_td.find(lambda tag: tag.name == 'td' and 'Current Status' in tag.text)
    if status_td:
        next_td = status_td.find_next_sibling('td')
        if next_td:
            if next_td.text.strip() != "Active":
                response['status'] = next_td.text.strip().replace('\xa0', ' ')
                return response
            else:
                response['status'] = "Active"

    activation_td = parent_td.find(lambda tag: tag.name == 'td' and 'Activation date' in tag.text)
    if activation_td:
        next_td = activation_td.find_next_sibling('td')
        if next_td:
            response['activation_date'] = next_td.text.strip().replace('\xa0', ' ')

    balance_td = parent_td.find(lambda tag: tag.name == 'td' and 'Balance' in tag.text)
    if balance_td:
        next_td = balance_td.find_next_sibling('td')
        if next_td:
            response['balance'] = next_td.text.strip().replace('\xa0', ' ')

    call_limit_td = parent_td.find(lambda tag: tag.name == 'td' and 'Outgoing call limit date' in tag.text)
    if call_limit_td:
        next_td = call_limit_td.find_next_sibling('td')
        if next_td:
            response['call_limit'] = next_td.text.strip().replace('\xa0', ' ')

    total_refill_td = parent_td.find(lambda tag: tag.name == 'td' and 'Total account refill' in tag.text)
    if total_refill_td:
        next_td = total_refill_td.find_next_sibling('td')
        if next_td:
            response['total_refill'] = next_td.text.strip().replace('\xa0', ' ')

    last_recharge_td = parent_td.find(lambda tag: tag.name == 'td' and 'Total account refill' in tag.text)
    if last_recharge_td:
        next_td = last_recharge_td.find_next_sibling('td')
        if next_td:
            response['last_recharge'] = next_td.text.strip().replace('\xa0', ' ')

    print(response)
    return response


def check_refill_status(card_number):
    with open('status.html', 'r') as file:
        data = file.read()

    soup = BeautifulSoup(data, 'html.parser')
    # html = driver.page_source
    # soup = BeautifulSoup(html, "html.parser")
    first_9_digits = card_number[:9]

    first_td = soup.find(lambda tag: tag.name == 'td' and first_9_digits in tag.text)
    second_td = first_td.find(lambda tag: tag.name == 'td' and first_9_digits in tag.text)
    third_td = second_td.find(lambda tag: tag.name == 'td' and first_9_digits in tag.text)
    fourth_td = third_td.find(lambda tag: tag.name == 'td' and first_9_digits in tag.text)

    parent_tr = fourth_td.find_parent('tr')
    all_tds_in_tr = parent_tr.find_all('td')
    last_td_in_tr = all_tds_in_tr[-1]
    print(last_td_in_tr)


import secrets
import string
from fpdf import FPDF
from PyPDF2 import PdfWriter, PdfReader


def email_codes_password(card_number, email):

    # email that pdf to email

    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(10))  # for a 10-character password
    print(password)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size = 15)
    pdf.cell(200, 10, txt = "scratch card number" + card_number, ln = True, align = 'C')
    pdf_filename = "card_number.pdf"
    pdf.output(pdf_filename)

    pdf_writer = PdfWriter()
    pdf_file = open(pdf_filename, "rb")
    pdf_reader = PdfReader(pdf_file)
    for page_number in range(len(pdf_reader.pages)):
        pdf_writer.add_page(pdf_reader.pages[page_number])
    pdf_writer.encrypt(password)
    protected_pdf_filename = "protected_card_number.pdf"
    with open(protected_pdf_filename, "wb") as out:
        pdf_writer.write(out)

# email_codes_password("12345678901234", "email")

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(subject, message, from_addr, to_addr, smtp_server, smtp_port, username, password):
    msg = MIMEMultipart()
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'plain'))

    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(username, password)
    text = msg.as_string()
    server.sendmail(from_addr, to_addr, text)
    server.quit()

# Usage
# send_email(
#     subject="Hello",
#     message="This is a test email",
#     from_addr="test@thurayaprepay.com",
#     to_addr="mrni8mare@gmail.com",
#     smtp_server="mail.thurayaprepay.com",
#     smtp_port=587,
#     username="test@thurayaprepay.com",
#     password="bYjNV27H4wP%"
# )

import csv

def find_average():
    total = 0
    count = 0

    with open('../statistics.csv', 'r') as file:
        reader = csv.reader(file)
        next(reader)  # Skip the header row
        for row in reader:
            total += float(row[3])  # Add the value in the fourth column
            count += 1

    print(total / count if count else 0)

import time
from selenium import webdriver
def test_driver_refresh():
    driver = webdriver.Chrome()
    time.sleep(1)
    driver.minimize_window()
    time.sleep(0.1)
    driver.get("https://services.thuraya.com/Bills/index.jsp")
    time.sleep(0.1)
    driver.refresh()
    time.sleep(5)


# print(datetime.now().strftime("%Y%m%d%H%M%S"))

def min_test():
    driver = webdriver.Chrome()
    driver.minimize_window()
    driver.get("https://services.thuraya.com/Bills/index.jsp")
    time.sleep(2)
    driver.minimize_window()
    driver.get("https://services.thuraya.com/Bills/index.jsp")
    time.sleep(2)
    driver.minimize_window()
    driver.get("https://services.thuraya.com/Bills/index.jsp")
    time.sleep(2)
    driver.quit()


def find_avg_max_min():
    with open('../statistics.csv', 'r') as f:
        reader = csv.reader(f)
        first_column = [float(row[3]) for row in reader]  # get the first column
        # calculate the average
        avg = sum(first_column) / len(first_column)
        # find max and min
        max_val = max(first_column)
        min_val = min(first_column)
        return avg, max_val, min_val

avg, max_val, min_val = find_avg_max_min()
print(f"Average: {avg}, Max: {max_val}, Min: {min_val}")