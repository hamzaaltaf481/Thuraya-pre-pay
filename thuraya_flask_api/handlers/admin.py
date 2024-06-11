from flask import jsonify
from cryptography.fernet import Fernet
import os
from database.models.models import Card
from flask_jwt_extended import decode_token
from datetime import datetime
from utils.import_file import import_csv


def view_cards_handler(session, request):
    token = request.headers.get('Authorization')
    # TODO: add check for if decoding fails
    payload = decode_token(token)
    user_role = payload['user_role']

    # TODO: uncomment this check after testing
    # if user_role != "admin":
    #     return jsonify({'message': 'Unauthorized'}), 401
    
    cards = session.query(Card)
    cards_dict = [card.to_dict() for card in cards]

    for card_dict in cards_dict:
        cards_detail_dict = card_dict["card_details"]
        for card_detail_dict in cards_detail_dict:
            scratch_code = card_detail_dict["scratch_code"]
            key = os.getenv("ENCRYPTION_KEY")
            cipher_suite = Fernet(key)
            decrypted_number = cipher_suite.decrypt(scratch_code).decode('utf-8')
            card_detail_dict["scratch_code"] = decrypted_number
    
    return jsonify(cards_dict), 200


def import_card_handler(request):
    file = request.files['file']
    
    po_number = request.form.get("po_number")
    pl_number = request.form.get("pl_number")
    date_purchased = request.form.get("date_purchased")
    date_purchased = datetime.strptime(date_purchased, '%d-%m-%Y')
    total_amount = request.form.get("total_amount")
    payment_status = request.form.get("payment_status")
    payment_status = bool(payment_status)
    attachment_path = request.form.get("attachment_path")
    
    import_csv(po_number, pl_number, date_purchased, total_amount, payment_status, attachment_path, file)
    return jsonify({"message": "success"}), 200