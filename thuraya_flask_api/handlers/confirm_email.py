from flask import redirect, url_for
import os
from database.models.models import User
from dotenv import load_dotenv

load_dotenv()


def confirm_email_handler(session, s, token):
    frontend_url = os.getenv("FRONTEND_URL")
    try:
        email = s.loads(token, salt=os.getenv("PASSWORD_RESET_SALT"))
    except:
        return redirect(f"http://{frontend_url}/?message=invalid_or_expired_token")

    user = session.query(User).filter_by(email=email, role="customer").first()
    if user.email_confirmed:
        return redirect(f"http://{frontend_url}/login?message=already_confirmed")

    else:
        user.email_confirmed = True
        session.add(user)
        session.commit()
        return redirect(f"http://{frontend_url}/login?message=success")
