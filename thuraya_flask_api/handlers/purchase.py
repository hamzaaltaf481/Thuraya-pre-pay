from database.models.models import User, FailedTransactions
from flask import jsonify
import requests
from flask_jwt_extended import decode_token
from database.database import get_codes
from handlers.transaction import create_transaction_detail, create_transaction
from utils.utils import email_codes_password
from datetime import datetime


def purchase_handler(request, session, logger, mail):
    transaction_logs = ""
    try:
        token = request.headers.get('Authorization')
        data = request.get_json()
        
        if not token:
            email=data.get('email')
            transaction_logs = transaction_logs + "guest user" + "\n"
            logger.info("guest user")
            print("guest user")
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
                    transaction_logs = transaction_logs + "logged in user" + "\n"
                    print("logged in user")
                    logger.info("logged in user")
            except Exception as e:
                print(str(e))
                return jsonify({"message": "Invalid token"}), 401
        
        transaction_logs = transaction_logs + "email: " + email + "\n"
        print("email: " + email)
        logger.info("email: " + email)
        transaction_logs = transaction_logs + "user_id: " + str(user_id) + "\n"
        print("user_id: " + str(user_id))
        logger.info("user_id: " + str(user_id))

        discount =0
        try:
            promo_code = data.get("promo_code")
            # TODO: discount and promo code
            # discount = find_discount(promo_code)
            if promo_code != None:
                transaction_logs = transaction_logs + str(promo_code) + "\n"
                print(promo_code)
                logger.info(promo_code)

        except:
            promo_code = None
            transaction_logs = transaction_logs + "no promo code" + "\n"
            print("no promo code")
            logger.info("no promo code")

        recharge_status = None
        # ip_address = request.remote_addr
        ip_address = "39.47.126.137"
        # TODO: dynamic ip address
        print("ip_address:" + ip_address)
        transaction_logs = transaction_logs + "ip_address: " + ip_address + "\n"
        logger.info("ip_address: " + ip_address)

        ip_info = requests.get(f"https://ipinfo.io/{ip_address}/json")
        user_agent = request.user_agent
        units = data.get("units")

        print("units: " + str(units))
        transaction_logs = transaction_logs + "units: " + str(units) + "\n"
        logger.info("units: " + str(units))
        transaction_id = create_transaction(user_id, ip_address, ip_info, user_agent, "purchase", "stripe", session)

        codes, error = get_codes(units, session)
        if error:
            return jsonify({"message": error}), 400
        transaction_logs = transaction_logs + "codes: " +str(codes) + "\n"
        print("codes: ")
        print(codes)
        logger.info("codes: ")
        logger.info(codes)

        email_status, transaction_logs = email_codes_password(codes, email, transaction_logs, mail)
        create_transaction_detail(promo_code, transaction_id, transaction_logs, discount, email_status, "", session, codes)
        return jsonify({"message": "success"}), 200
    except Exception as e:
        print(str(e))
        failed_transaction = FailedTransactions(log_string=transaction_logs, date_time=datetime.datetime.now())
        session.add(failed_transaction)
        # commit the transaction
        session.commit()
        print(transaction_logs)
        return jsonify({"message": "Internal Server Error"}), 500