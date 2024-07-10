from flask import request, jsonify
from database.models.models import User
from flask_jwt_extended import create_access_token
from datetime import timedelta
from werkzeug.security import check_password_hash


def login_handler(session):
    user = (
        session.query(User)
        .filter_by(email=request.form.get("email"))
        .filter(User.role != "guest")
        .first()
    )
    if not user or not check_password_hash(user.password, request.form.get("password")):
        return (
            jsonify({"message": "Login Unsuccessful. Please check email and password"}),
            401,
        )

    if user.email_confirmed == False or user.email_confirmed == None:
        return jsonify({"message": "Email not confirmed"}), 401

    additional_claims = {"user_role": user.role, "user_id": user.id}
    expires = timedelta(minutes=300000)
    # TODO: make expire time lower for prod
    access_token = create_access_token(
        identity=user.email, additional_claims=additional_claims, expires_delta=expires
    )
    return (
        jsonify(
            {
                "message": "Logged in successfully",
                "access_token": access_token,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "user_role": user.role,
            }
        ),
        200,
    )
