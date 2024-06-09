from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask import Flask, request, jsonify
import os
from werkzeug.security import generate_password_hash
from database.models.models import User
from flask_mail import Mail, Message
from flask import url_for


def forgot_password_handler(s, session, mail):
    data = request.get_json()
    user = session.query(User).filter_by(email=data['email']).first()
    if user:
        token = s.dumps(user.email, salt=os.getenv("PASSWORD_RESET_SALT"))
        msg = Message('Password Reset Request', recipients=[user.email])
        link = url_for('reset_token', token=token, _external=True)
        msg.body = f'To reset your password, visit the following link: {link}'
        mail.send(msg)
        print(msg)
    return jsonify({'message': 'If an account with that email exists, we have sent a password reset email'}), 200