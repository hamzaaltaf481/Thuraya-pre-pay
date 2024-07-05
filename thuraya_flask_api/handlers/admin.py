from flask import jsonify, request
from cryptography.fernet import Fernet
import os
from database.models.models import Card, CardDetail, User
from flask_jwt_extended import decode_token, create_access_token
from datetime import datetime, timedelta
from utils.import_file import import_csv
from werkzeug.security import check_password_hash


def view_cards_handler(session, request):
    # token = request.headers.get('Authorization')
    # # TODO: add check for if decoding fails
    # payload = decode_token(token)
    # user_role = payload['user_role']

    # if user_role != "admin":
    #     return jsonify({'message': 'Unauthorized'}), 401
    
    cards = session.query(Card)
    cards_dict = [card.to_dict() for card in cards]

    return jsonify(cards_dict), 200

def admin_login_handler(session):
    user = session.query(User).filter_by(email=request.form.get("email")).filter(User.role == 'admin').first()
    if not user or not check_password_hash(user.password, request.form.get("password")):
        return jsonify({'message': 'Login Unsuccessful. Please check email and password'}), 401
    
    if user.email_confirmed == False or user.email_confirmed == None:
        return jsonify({'message': 'Email not confirmed'}), 401
    
    additional_claims = {"user_role": user.role, "user_id": user.id}
    expires = timedelta(minutes=300000)
    # TODO: make expire time lower for prod
    access_token = create_access_token(identity=user.email, additional_claims=additional_claims, expires_delta=expires)
    return jsonify({'message': 'Logged in successfully', 'access_token': access_token, 'first_name': user.first_name, 'last_name': user.last_name, "user_role": user.role}), 200


def view_scratch_codes_handler(session, request):
    # token = request.headers.get('Authorization')
    # # TODO: add check for if decoding fails
    # payload = decode_token(token)
    # user_role = payload['user_role']

    # if user_role != "admin":
    #     return jsonify({'message': 'Unauthorized'}), 401
    card_id = request.form.get("card_id")

    card = session.query(Card).filter(Card.id == card_id).first()
    card_dict = card.to_dict_with_cards()  # Assuming to_dict() is a method that converts a card to a dictionary

    cards_detail_dict = card_dict["card_details"]
    for card_detail_dict in cards_detail_dict:
        scratch_code = card_detail_dict["scratch_code"]
        key = os.getenv("ENCRYPTION_KEY")
        cipher_suite = Fernet(key)
        decrypted_number = cipher_suite.decrypt(scratch_code).decode('utf-8')
        card_detail_dict["scratch_code"] = decrypted_number[-4:]

    return jsonify(card_dict), 200


def import_card_handler(request, session):

    # token = request.headers.get('Authorization')
    # # TODO: add check for if decoding fails
    # payload = decode_token(token)
    # user_role = payload['user_role']

    # # TODO: uncomment this check after testing
    # if user_role != "admin":
    #     return jsonify({'message': 'Unauthorized'}), 401
    try:
        file = request.files['file']
    except:
        return jsonify({'message': 'No file provided'}), 400
    
    po_number = request.form.get("po_number")
    pl_number = request.form.get("pl_number")
    date_purchased = request.form.get("date_purchased")
    date_purchased = datetime.strptime(date_purchased, '%d-%m-%Y')
    total_amount = request.form.get("total_amount")
    payment_status = request.form.get("payment_status")
    payment_status = bool(payment_status)
    attachment_path = request.form.get("attachment_path")
    
    import_csv(po_number, pl_number, date_purchased, total_amount, payment_status, attachment_path, file, session)
    return jsonify({"message": "success"}), 200


def add_card_detail_handler(session, request):

    token = request.headers.get('Authorization')
    # # TODO: add check for if decoding fails
    # payload = decode_token(token)
    # user_role = payload['user_role']

    # # TODO: uncomment this check after testing
    # if user_role != "admin":
    #     return jsonify({'message': 'Unauthorized'}), 401

    new_card_detail = CardDetail(
        card_id=request.form.get("card_id"),
        serial_number=request.form.get("serial_number"),
        scratch_code=request.form.get("scratch_code"),
        units=request.form.get("units"),
        purchase_price=request.form.get("purchase_price"),
        selling_price=request.form.get("selling_price"),
        expiry_date=request.form.get("expiry_date"),
        remarks=request.form.get("remarks"),
        card_status=False,
    )

    session.add(new_card_detail)
    session.commit()

    return jsonify({'message': 'Card detail added successfully'}), 200