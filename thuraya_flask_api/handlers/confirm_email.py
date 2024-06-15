import os
from flask import jsonify
from database.models.models import User


def confirm_email_handler(session, s, token):
    try:
        email = s.loads(token, salt=os.getenv("PASSWORD_RESET_SALT"), max_age=3600)
    except:
        return jsonify({'message': 'The confirmation link is invalid or has expired.'}), 400

    user = session.query(User).filter_by(email=email, role='customer').first()
    if user.email_confirmed:
        return jsonify({'message': 'Account already confirmed. Please login.'}), 200

    else:
        user.email_confirmed = True
        session.add(user)
        session.commit()
        return jsonify({'message': 'You have confirmed your account. Thanks!'}), 200