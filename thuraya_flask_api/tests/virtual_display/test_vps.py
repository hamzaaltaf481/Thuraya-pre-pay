                                                                                              
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By


def test():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    browser = webdriver.Chrome(options=options)
    browser.maximize_window()
    browser.get('https://services.thuraya.com/Bills/DirectScratchRefill.jsp')
    captcha_element = browser.find_element(By.ID, "theForm_CaptchaImage")
    captcha_element.screenshot("browser.png")
    browser.quit()


test()
