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
    if len(password) < 8:
        return jsonify({'message': 'Password must be at least 8 characters long'}), 400

    existing_user = session.query(User).filter(User.email == email, User.role != 'guest').first()
    if existing_user:
        return jsonify({'message': 'User with this email already exists'}), 400

    hashed_password = generate_password_hash(request.form.get("password"), method='sha256')
    
    ip_address = str(request.remote_addr)

    ip_info = requests.get(f"https://ipinfo.io/{ip_address}/json")
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

    new_user = User(email=email, password=hashed_password, first_name=request.form.get("first_name"), last_name=request.form.get("last_name"), country_region=str(from_location), role='customer')
    session.add(new_user)
    session.commit()

    token = s.dumps(email, salt=os.getenv("PASSWORD_RESET_SALT"))
    msg = Message('Confirm Email', recipients=[email])
    link = url_for('confirm_email', token=token, _external=True)
    # link = link.replace('localhost:5000/api', os.getenv('FRONTEND_URL'))
    msg.body = 'Your email confirmation link is {}'.format(link)
    mail.send(msg)

    return jsonify({'message': 'Registered successfully. Please confirm your email!'}), 200