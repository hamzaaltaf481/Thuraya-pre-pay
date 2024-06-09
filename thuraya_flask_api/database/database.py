import mysql.connector
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from cryptography.fernet import Fernet
from database.models.models import CardDetail, Card

load_dotenv()

def connect_to_database():
    db = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DB")
    )

    return db

def database_session():
    engine = create_engine(f"mysql+mysqlconnector://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DB')}")
    Session = sessionmaker(bind=engine)
    session = Session()

    return session

def get_card(units, session):

    code = session.query(CardDetail).filter(CardDetail.units == units, CardDetail.card_status == 0).first()
    
    if code:
        code.card_status = 1
        session.commit()
    else:
        print("no card found for the price")
        code = None

    key = os.getenv("ENCRYPTION_KEY")
    print(key)
    cipher_suite = Fernet(key)
    number = code.scratch_code
    decrypted_number = cipher_suite.decrypt(number).decode('utf-8')
    print(decrypted_number[-4:])
    return decrypted_number, code.id, code.selling_price

def get_codes(units, session):
    codes = []
    for unit in units:
        quantity = unit["quantity"]
        price = unit["price"]
        for _ in range(int(quantity)):
            number, id, selling_price = get_card(price, session)
            codes.append({"number": number, "price": selling_price, "id": id})
    
    return codes