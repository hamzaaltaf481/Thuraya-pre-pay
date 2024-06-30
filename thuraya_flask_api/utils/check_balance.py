import json
import requests


def find_details(phone, log_string, logger):
    with open("constants.json") as f:
        constants = json.load(f)
    
    data = {"msisdn":f"88216{phone}"}

    response = requests.post(constants["balanceAPI"], headers=constants["balanceAPIHeaders"], data=json.dumps(data))
    # wait for the retrieval of info

    # convert response to json
    response_json = response.json()
    print("response_json: ")
    print(response_json)


    try:
        print("balance: ")
        print(response_json["Credit Available"])
        log_string = log_string + "balance: " + response_json["Credit Available"] + "\n"
        logger.info("balance: " + response_json["Credit Available"])

        print("refill allowed: ")
        print(response_json["Refill Allowed"])
        log_string = log_string + "refill allowed: " + response_json["Refill Allowed"] + "\n"
        logger.info("refill allowed: " + response_json["Refill Allowed"])

        print("expiry date: ")
        print(response_json["Last Active Date"])
        log_string = log_string + "expiry date: " + response_json["Last Active Date"] + "\n"
        logger.info("expiry date: " + response_json["Last Active Date"])

        return log_string, response_json["Credit Available"], response_json["Refill Allowed"], response_json["Last Active Date"], None
    except:
        error = response_json["Error"]
        print("Invalid Account")
        log_string = log_string + "Invalid Account" + "\n"
        logger.info("Invalid Account")
        return log_string, None, None, None, error
