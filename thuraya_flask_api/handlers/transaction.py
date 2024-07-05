from database.models.models import UserTransaction, TransactionDetail
from datetime import datetime
import json

def create_transaction(user_id, ip_address, ip_info, user_agent, type, mode, session):
    location = ip_info.json()
    try:
        city = location["city"]
    except:
        city = "Unknown"
    try:
        region = location["region"]
    except:
        region = "Unknown"
    try:
        country = location["country"]
    except:
        country = "Unknown"
    from_location = {"city": city, "region": region, "country": country}
    from_location_str = json.dumps(from_location)  # Convert dict to string
    print(user_id)
    print(ip_address)
    print(from_location_str)
    print(user_agent)
    print(type)
    print(mode)
    #TODO: promo code should be with transaction instead of transaction detail
    transaction = UserTransaction(
        user_id=user_id,
        from_ip = ip_address,
        from_location = from_location_str,
        from_device=str(user_agent),
        type=type,
        payment_mode=mode
    )
    session.add(transaction)
    session.commit()
    return transaction.id


def create_transaction_detail(promo_code, transaction_id, transaction_logs, discount, email_status, remarks, session, codes):
    # if promo_code!=None:
    #     # TODO: find the discount and store
    #     pass
    # else:
    #     promo_id = None

    for code in codes:
        transaction_detail = TransactionDetail (
            transaction_id=transaction_id,
            card_details_id = code["id"],
            transaction_details = transaction_logs,
            sat_phone_number = None,
            selling_price = code["price"],
            discount_amount = discount,
            net_price = code["price"] - discount,
            card_status = None,
            recharge_status = None,
            email_status = email_status,
            remarks = remarks
        )

        session.add(transaction_detail)

    session.commit()