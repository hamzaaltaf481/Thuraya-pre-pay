import requests
import json

url = 'https://www.thurayarefill.com/thuraya-refill-backend/api/device_status'
headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json',
    'origin': 'https://www.thurayarefill.com',
    'priority': 'u=1, i',
    'referer': 'https://www.thurayarefill.com/?path=quick_refill',
    'sec-ch-ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'x-localization': 'en'
}
data = {"msisdn":"8821622770450"}

response = requests.post(url, headers=headers, data=json.dumps(data))

print(response.text)