from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask import Flask, request, jsonify
import os
from werkzeug.security import generate_password_hash
from database.models.models import User


def reset_password(s, token, session):
    try:
        email = s.loads(token, salt=os.getenv("PASSWORD_RESET_SALT"), max_age=3600)
    except SignatureExpired:
        return jsonify({'message': 'The token is expired!'}), 400
    data = request.form
    user = session.query(User).filter_by(email=email).first()  

    if not user:
        return jsonify({'message': 'User not found!'}), 404

    hashed_password = generate_password_hash(data.get('password'), method='sha256')
    user.password = hashed_password
    session.commit()
    return jsonify({'message': 'Your password has been updated!'}), 200