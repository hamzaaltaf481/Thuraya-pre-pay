from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import inspect
from datetime import datetime
import csv
from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

load_dotenv()

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    password = Column(String(255))
    first_name = Column(String(255))
    last_name = Column(String(255))
    country_region = Column(String(255))
    email = Column(String(255))
    role = Column(String(255))
    email_confirmed = Column(Boolean)

    transactions = relationship('UserTransaction', back_populates='user')
    
    def to_dict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}

class Card(Base):
    __tablename__ = 'cards'

    id = Column(Integer, primary_key=True, autoincrement=True)
    po_number = Column(Integer)
    pl_number = Column(Integer)
    date_purchased = Column(DateTime)
    total_amount = Column(Integer)
    payment_status = Column(Boolean)
    attachment_path = Column(String(255))

    card_details = relationship('CardDetail', back_populates='card')

    def to_dict_with_cards(self):
        data = {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
        if self.card_details:
            data['card_details'] = [card_detail.to_dict() for card_detail in self.card_details]
        return data
    
    def to_dict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}


class CardDetail(Base):
    __tablename__ = 'card_details'

    id = Column(Integer, primary_key=True, autoincrement=True)
    card_id = Column(Integer, ForeignKey('cards.id'))
    serial_number = Column(Integer)
    scratch_code = Column(String(255))
    units = Column(Integer)
    purchase_price = Column(Integer)
    selling_price = Column(Integer)
    expiry_date = Column(DateTime)
    card_status = Column(Boolean)
    remarks = Column(String(255))

    card = relationship('Card', back_populates='card_details')
    transaction_details = relationship('TransactionDetail', back_populates='card_detail') 
    
    def to_dict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}
         

class PromoCode(Base):
    __tablename__ = 'promo_codes'

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(255))
    discount = Column(String(255))
    units = Column(String(255))
    type = Column(String(255))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(Boolean)

    transaction_details = relationship('TransactionDetail', back_populates='promo')




class UserTransaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    date_time = Column(DateTime)
    from_ip = Column(String(255))
    from_location = Column(String(255))
    from_device = Column(String(255))
    from_details = Column(String(255))
    type = Column(String(255))
    payment_received = Column(Boolean)
    payment_mode = Column(String(255))
    payment_status = Column(Boolean)

    user = relationship('User', back_populates='transactions')
    transaction_details = relationship('TransactionDetail', back_populates='transaction')  # new relationship

class TransactionDetail(Base):
    __tablename__ = 'transaction_details'

    id = Column(Integer, primary_key=True, autoincrement=True)
    promo_id = Column(Integer, ForeignKey('promo_codes.id'))
    transaction_id = Column(Integer, ForeignKey('transactions.id'))
    card_details_id = Column(Integer, ForeignKey('card_details.id'))
    transaction_details = Column(Text)
    sat_phone_number = Column(Integer)
    selling_price = Column(Integer)
    discount_amount = Column(Integer)
    net_price = Column(Integer)
    card_status = Column(Boolean)
    recharge_status = Column(Boolean)
    email_status = Column(Boolean)
    remarks = Column(String(255))

    promo = relationship('PromoCode', back_populates='transaction_details')
    transaction = relationship('UserTransaction', back_populates='transaction_details')
    card_detail = relationship('CardDetail', back_populates='transaction_details')


class FailedTransactions(Base):
    __tablename__ = 'failed_transactions'

    id = Column(Integer, primary_key=True, autoincrement=True)
    log_string = Column(Text)
    date_time = Column(DateTime)

def migrate_tables(session):
    # TODO: delete this before going production
    engine = session.get_bind()
    if Base.metadata.tables:
        Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_data(session)

def seed_data(session):
    
    po_number = 123456
    pl_number = 654321
    date_purchased = "01-01-2022"
    date_purchased = datetime.strptime(date_purchased, '%d-%m-%Y')
    total_amount = 1000
    payment_status = "True"
    payment_status = bool(payment_status)
    attachment_path = "/path/to/attachment"

    card = Card(
        po_number=po_number,
        pl_number=pl_number,
        date_purchased=date_purchased,
        total_amount=total_amount,
        payment_status=payment_status,
        attachment_path=attachment_path
    )

    session.add(card)
    session.commit()
    file_path = "cards.csv"
    key = os.getenv("ENCRYPTION_KEY")

    for i in range(10):
        with open(file_path, 'r') as f:
            reader = csv.reader(f)
            for row in reader:
                print(row)
                expiry_date = datetime.strptime(row[5], '%d-%m-%Y')
                cipher_suite = Fernet(key.encode('utf-8'))
                encrypted_scratch_code = cipher_suite.encrypt(row[1].encode('utf-8'))
                card_detail = CardDetail(
                    card_id=card.id,
                    serial_number=row[0],
                    scratch_code=encrypted_scratch_code,
                    units=row[2],
                    purchase_price=row[3],
                    selling_price=row[4],
                    expiry_date=expiry_date,
                    card_status=False,
                )
                session.add(card_detail)
            session.commit()