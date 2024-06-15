import time
from selenium.webdriver.common.by import By


def fill_login_data(driver, phone, password, logger, log_string):
    input_field = driver.find_element(By.NAME, "PhoneNbr_suffix")
    time.sleep(0.1)
    input_field.send_keys(phone)

    input_field = driver.find_element(By.NAME, "Password")
    time.sleep(0.1)
    input_field.send_keys(password)
    print("entered credentials")
    log_string = log_string + "entered credentials" + "\n"
    logger.info("entered credentials")

def fill_scratch_data(driver, phone, card_number):
    input_field = driver.find_element(By.NAME, "phonenr")
    time.sleep(0.1)
    input_field.send_keys(phone)

    input_field = driver.find_element(By.NAME, "scardno")
    time.sleep(0.1)
    input_field.send_keys(card_number)

def fill_login_captcha_code(driver, code, logger):
    input_field = driver.find_element(By.ID, "captchaCode")
    time.sleep(0.1)
    input_field.send_keys(code)
    
    button = driver.find_element(By.NAME, "submit_button")
    time.sleep(0.1)
    button.click()
    print("captcha solution entered")
    logger.info("captcha solution entered")

def fill_refill_captcha_code(driver, code):
    input_field = driver.find_element(By.ID, "captchaCode")
    time.sleep(0.1)
    input_field.send_keys(code)
    
    button = driver.find_element(By.NAME, "submit")
    time.sleep(0.1)
    button.click()

    alert = driver.switch_to.alert
    alert.accept()


def check_clicked(driver):
    try:
        button = driver.find_element(By.NAME, "submit_button")
    except:
        return True
    
    button_value = button.get_attribute("value")
    for char in button_value:
        if char.isdigit():
            return False
        
    return True

def fill_login_refill(card_number, driver, logger):

    input_field = driver.find_element(By.NAME, "scardno")
    time.sleep(0.1)
    input_field.send_keys(card_number)

    button = driver.find_element(By.NAME, "submit")
    time.sleep(0.1)
    button.click()

    alert = driver.switch_to.alert
    alert.accept()
