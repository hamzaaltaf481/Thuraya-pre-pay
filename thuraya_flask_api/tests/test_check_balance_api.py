import requests
import json
import datetime
import concurrent.futures



def test_check_balance():
    phone = "21297776"
    headers = {"accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "origin": "https://www.thurayarefill.com",
        "priority": "u=1, i",
        "referer": "https://www.thurayarefill.com/?path=quick_refill",
        "sec-ch-ua": "'Chromium';v='124', 'Google Chrome';v='124', 'Not-A.Brand';v='99'",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "'Linux'",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "x-localization": "en"}
    data = {"msisdn":f"88216{phone}"}
    response = requests.post("https://www.thurayarefill.com/thuraya-refill-backend/api/device_status", headers=headers, data=json.dumps(data))
    # wait for the retrieval of info

    # convert response to json
    response_json = response.json()
    assert response_json["Credit Available"] == "10.10$"


def run_tests():
    with concurrent.futures.ThreadPoolExecutor() as executor:
        for i in range(1000):
            executor.submit(run_test, i)

def run_test(i):
    print(datetime.datetime.now())
    print(f"Running test {i}")
    test_check_balance()

run_tests()