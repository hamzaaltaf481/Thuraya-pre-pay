import os
import csv
import pyautogui
import time
from dotenv import load_dotenv
from twocaptcha import TwoCaptcha

load_dotenv()
LOGIN_CAPTCHA_QUEUE = []
QUICK_REFILL_CAPTCHA_QUEUE=[]


def solve_login_captcha(error_page, wrong_creds, driver, logger, log_string):

    if error_page == True or wrong_creds == True:
        top_left = (990, 906)
        bottom_right = (1140, 940)
    else:
        top_left = (990, 885)
        bottom_right = (1140, 918)

    width = bottom_right[0] - top_left[0]
    height = bottom_right[1] - top_left[1]

    LOGIN_CAPTCHA_QUEUE.append(driver)
    for i in range(1000):
            
        try:
            with open("statistics.csv", "r", encoding="utf-8") as f:
                id = sum(1 for line in f) + 1
        except:
            id = 0

        driver_info = LOGIN_CAPTCHA_QUEUE[0]
        if driver_info == driver:
            driver.maximize_window()
            time.sleep(1)
            screenshot = pyautogui.screenshot(region=(top_left[0], top_left[1], width, height))
            # driver.minimize_window()
            print("screenshot taken")
            log_string = log_string + "screenshot taken" + "\n"
            logger.info("screenshot taken")
            screenshot.save(f"images/{id}.png")
            
            LOGIN_CAPTCHA_QUEUE.pop(0)
            break
        else:
            time.sleep(1)

    solver = TwoCaptcha(os.getenv("CAPTCHA_SOLVER_API_KEY"))
    print("sending solve request")
    log_string = log_string + "sending solve request" + "\n"
    logger.info("sending solve request")

    try:
        start_time = time.time()
        result = solver.normal(f"images/{id}.png")
        end_time = time.time()
        elapsed_time = end_time - start_time
        print(f"Time taken: {elapsed_time} seconds")
        log_string = log_string + f"Time taken: {elapsed_time} seconds" + "\n"
    except:
        print("unsolvable captcha. Check screenshot taken")
        log_string = log_string + "unsolvable captcha. Check screenshot taken" + "\n"
        logger.warning("unsolvable captcha. Check screenshot taken")
        return ""

    code = result.get("code")

    with open("statistics.csv", "a", encoding="utf-8") as f:
        writer = csv.writer(f, delimiter=",")
        writer.writerow([id, code, "incorrect", elapsed_time])

    print("twoCaptcha response: "+code)
    log_string = log_string + "twoCaptcha response: "+code + "\n"
    logger.info("twoCaptcha response: "+code)
    return code


def solve_refill_captcha(error_page, driver, logger, log_string, solver):

    if error_page == True:
        top_left = (995, 900)
        bottom_right = (1140, 933)
        pass
    else:

        top_left = (990, 883)
        bottom_right = (1140, 915)

    width = bottom_right[0] - top_left[0]
    height = bottom_right[1] - top_left[1]

    QUICK_REFILL_CAPTCHA_QUEUE.append(driver)

    for i in range(1000):
        
        try:
            with open("statistics.csv", "r", encoding="utf-8") as f:
                id = sum(1 for line in f) + 1
        except:
            id = 0
        
        driver_info = QUICK_REFILL_CAPTCHA_QUEUE[0]
        if driver_info == driver:
            driver.maximize_window()
            time.sleep(3)
            # TODO: adjust this value
            # driver.minimize_window()
            screenshot = pyautogui.screenshot(region=(top_left[0], top_left[1], width, height))
            print("screenshot taken")
            log_string = log_string + "screenshot taken" + "\n"
            logger.info("screenshot taken")
            screenshot.save(f"images/{id}.png")

            print("sending solve request")
            log_string = log_string + "sending solve request" + "\n"
            logger.info("sending solve request")

            try:
                result = solver.normal(f"images/{id}.png")
                QUICK_REFILL_CAPTCHA_QUEUE.pop(0)
                break
            except:
                print("unsolvable captcha. Check screenshot taken")
                log_string = log_string + "unsolvable captcha. Check screenshot taken" + "\n"
                logger.warning("unsolvable captcha. Check screenshot taken")
                # TODO: fix error: local variable 'result' referenced before assignment
                return None, None
            
        else:
            time.sleep(1)

    
    code = result.get("code")
    captcha_id = result.get("captchaId")

    with open("statistics.csv", "a", encoding="utf-8") as f:
        writer = csv.writer(f, delimiter=",")
        writer.writerow([id, code, "incorrect"])

    print("twoCaptcha response: "+code)
    log_string = log_string + "twoCaptcha response: "+code + "\n"
    logger.info("twoCaptcha response: "+code)
    return code, captcha_id


def write_correct_statistic():
    with open("statistics.csv", "r", encoding="utf-8") as f:
        lines = list(csv.reader(f))

    if lines:
        lines[-1][2] = "correct" 
    else:
        print("File is empty.")

    with open("statistics.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(lines)
