from bs4 import BeautifulSoup
import time

def parse_data(driver):
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")

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

    return response


def check_refill_status(card_number, driver):
    
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    first_9_digits = card_number[:9]
    found = False

    for i in range(10):
        try:
            first_td = soup.find(lambda tag: tag.name == 'td' and first_9_digits in tag.text)
            second_td = first_td.find(lambda tag: tag.name == 'td' and first_9_digits in tag.text)
            third_td = second_td.find(lambda tag: tag.name == 'td' and first_9_digits in tag.text)
            fourth_td = third_td.find(lambda tag: tag.name == 'td' and first_9_digits in tag.text)
            found = True
            break
        except:
            time.sleep(2)
            driver.refresh()
            continue
    
    if found == False:
        return "Not found"

    parent_tr = fourth_td.find_parent('tr')
    all_tds_in_tr = parent_tr.find_all('td')
    last_td_in_tr = all_tds_in_tr[-1]
    status = last_td_in_tr.text

    return status