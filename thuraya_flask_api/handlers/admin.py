from flask import jsonify
from cryptography.fernet import Fernet
import os
from database.models.models import Card
from flask_jwt_extended import decode_token


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