from twocaptcha import TwoCaptcha
import os
from dotenv import load_dotenv

load_dotenv()


def test_captcha_response():

    solver = TwoCaptcha(os.getenv("CAPTCHA_SOLVER_API_KEY"))
    result = solver.normal(f"../images/2.png")
    print(result)


test_captcha_response()
