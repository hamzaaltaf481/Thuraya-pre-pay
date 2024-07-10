import pandas as pd
import requests

# read the excel file named "bulk_phone_nos.xlsx" and store the phone numbers in a list
# make request to localhost:5000/api/login_refill with json data phone: phone, price: 20, email: mrni8mare@gmail.com


def test_stats():
    dataframe1 = pd.read_excel("QR_2022_&_2023.xlsx")

    for phone in dataframe1["Satellite Phone Number"]:
        phone = str(phone)
        phone = phone[5:]
        print(phone)

        response = requests.post(
            "http://localhost:5000/api/login_refill",
            json={"phone": phone, "price": "20", "email": "mrni8mare@gmail.com"},
        )

        print(response.json())
        print(response.status_code)


test_stats()
