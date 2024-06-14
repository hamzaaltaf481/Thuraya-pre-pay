from database.models.models import User
from flask import jsonify
import requests
from flask_jwt_extended import decode_token
from database.database import get_codes
from handlers.transaction import create_transaction_detail, create_transaction
from utils.utils import email_codes_password


def purchase_handler(request, session):
    transaction_logs = ""
    token = request.headers.get('Authorization')
    data = request.get_json()
    
    if not token:
        email=data.get('email')
        print(email)
        transaction_logs = transaction_logs + email + "\n"
        new_user = User(email=email, country_region=data.get('country_region'), role='guest')
        session.add(new_user)
        session.commit()
        user_id = new_user.id

    else:
        try:
            payload = decode_token(token)
            user_id = payload['user_id']
            user = session.query(User).filter(User.id == user_id).first()
            if user:
                email = user.email
        except Exception as e:
            print(str(e))
            return jsonify({"message": "Invalid token"}), 401
    
    transaction_logs = transaction_logs + str(user_id) + "\n"
    print(user_id)

    discount =0
    try:
        promo_code = data.get("promo_code")
        # discount = find_discount(promo_code)
        if promo_code != None:
            transaction_logs = transaction_logs + str(promo_code) + "\n"

    except:
        promo_code = None
        transaction_logs = transaction_logs + "no promo code" + "\n"

    recharge_status = None
    # ip_address = request.remote_addr
    ip_address = "39.47.126.137"
    # TODO: dynamic ip address
    print(ip_address)
    transaction_logs = transaction_logs + ip_address + "\n"

    ip_info = requests.get(f"https://ipinfo.io/{ip_address}/json")
    user_agent = request.user_agent
    units = data.get("units")

    print(units)
    transaction_logs = transaction_logs + str(units) + "\n"
    transaction_id = create_transaction(user_id, ip_address, ip_info, user_agent, "purchase", "stripe", session)

    codes, error = get_codes(units, session)
    if error:
        return jsonify({"message": error}), 400
    transaction_logs = transaction_logs + str(codes) + "\n"
    print("codes: ")
    print(codes)

    email_status, transaction_logs = email_codes_password(codes, email, transaction_logs)
    create_transaction_detail(promo_code, transaction_id, transaction_logs, discount, email_status, "", session, codes)
    return jsonify({"message": "success"}), 200