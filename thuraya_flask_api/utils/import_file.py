from datetime import datetime
import csv
import os
from dotenv import load_dotenv
from cryptography.fernet import Fernet
from database.models.models import Card, CardDetail

load_dotenv()

def import_csv(po_number, pl_number, date_purchased, total_amount, payment_status, attachment_path, file, session):

    file_path = file.filename
    file.save(file_path)

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
    key = os.getenv("ENCRYPTION_KEY")
    print(key)

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

