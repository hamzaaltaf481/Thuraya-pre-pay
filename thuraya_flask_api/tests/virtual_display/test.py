# from selenium import webdriver
# from pyvirtualdisplay import Display
# import time
# import Xlib.display
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support.expected_conditions import staleness_of
# from selenium.webdriver.chrome.options import Options

# def test_display():

#     # top_left = (962, 875)
#     # bottom_right = (1112, 908)
#     # width = bottom_right[0] - top_left[0]
#     # height = bottom_right[1] - top_left[1]

#     # display = Display(visible=0, size=(1920, 1080), backend="xvfb", use_xauth=True)
#     # display.start()
#     # pyautogui._pyautogui_x11._display = Xlib.display.Display()
#     options = Options()
#     options.add_argument("--headless")
#     browser = webdriver.Chrome(options=options)
#     browser.maximize_window()
#     browser.get('https://services.thuraya.com/Bills/DirectScratchRefill.jsp')

#     top_left = (963, 875)
#     bottom_right = (1113, 908)
#     width = bottom_right[0] - top_left[0]
#     height = bottom_right[1] - top_left[1]

#     screenshot = pyautogui.screenshot(region=(top_left[0], top_left[1], width, height))
#     screenshot.save("before_captcha_error.png")

#     body = browser.find_element(By.TAG_NAME, "body")

#     input_field = browser.find_element(By.NAME, "phonenr")
#     time.sleep(0.1)
#     input_field.send_keys("55528151")

#     input_field = browser.find_element(By.NAME, "scardno")
#     time.sleep(0.1)
#     input_field.send_keys("01234567890123")

#     input_field = browser.find_element(By.ID, "captchaCode")
#     time.sleep(0.1)
#     input_field.send_keys("ABCD")

#     button = browser.find_element(By.NAME, "submit")
#     time.sleep(0.1)
#     button.click()

#     alert = browser.switch_to.alert
#     alert.accept()

#     WebDriverWait(browser, float("inf")).until(staleness_of(body))

#     # time.sleep(5)
#     browser.save_screenshot("browser.png")

#     top_left = (962, 889)
#     bottom_right = (1112, 922)
#     width = bottom_right[0] - top_left[0]
#     height = bottom_right[1] - top_left[1]


#     screenshot = pyautogui.screenshot(region=(top_left[0], top_left[1], width, height))
#     screenshot.save("after_captcha_error.png")

#     # print browser.title
#     browser.quit()

#     # display.stop()


# test_display()
