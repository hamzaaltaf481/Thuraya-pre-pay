import re
import os
import requests
from flask import request, jsonify, url_for
from flask_mail import Message
from werkzeug.security import generate_password_hash
from database.models.models import User




def signup_handler(session, s, mail):

    email = request.form.get("email")
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'message': 'Invalid email format'}), 400

    password = request.form.get("password")
    if len(password) < 8 or not re.search("[a-z]", password) or not re.search("[A-Z]", password) or not re.search("[0-9]", password):
        return jsonify({'message': 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one digit'}), 400

    existing_user = session.query(User).filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'User with this email already exists'}), 400

    hashed_password = generate_password_hash(request.form.get("password"), method='sha256')
    
    # ip_address = request.remote_addr
    ip_address = "39.47.126.137"
    # TODO: dynamic ip address

    ip_info = requests.get(f"https://ipinfo.io/{ip_address}/json")
    location = ip_info.json()
    from_location = {"city": location["city"], "region": location["region"], "country": location["country"]}

    new_user = User(email=email, password=hashed_password, name=request.form.get("name"), country_region=str(from_location), role='customer')
    session.add(new_user)
    session.commit()

    token = s.dumps(email, salt=os.getenv("PASSWORD_RESET_SALT"))
    msg = Message('Confirm Email', recipients=[email])
    link = url_for('confirm_email', token=token, _external=True)
    msg.body = 'Your email confirmation link is {}'.format(link)
    mail.send(msg)

    return jsonify({'message': 'Registered successfully. Please confirm your email!'}), 200