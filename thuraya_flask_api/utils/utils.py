# TODO: use flask mail object instead of custom mail function

import secrets
import string
from fpdf import FPDF
from PyPDF2 import PdfWriter, PdfReader
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
from datetime import datetime
import re
from email.mime.base import MIMEBase
from email import encoders

load_dotenv()

def check_valid(phone, price):

    if not phone.isdigit() or len(phone) != 8:
        return False

    if not price.isdigit():
        return False

    return True

def email_codes_password(card_numbers, email, transaction_logs):

    alphabet = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(alphabet) for i in range(10))
    print(password)

    transaction_logs = transaction_logs + "password: " +password + "\n"

    card_numbers = str(card_numbers)
    pdf_filename = create_pdf(card_numbers, email)

    print("pdf_filename: " + pdf_filename)
    transaction_logs = transaction_logs + "pdf_filename: " +pdf_filename + "\n"


    protected_pdf_filename = protect_pdf(password, pdf_filename, email)
    transaction_logs = transaction_logs + "protected_pdf_filename: " + protected_pdf_filename + "\n"


    send_email(
        subject="Thuraya Refill Codes",
        message="Password protected pdf file is attached",
        from_addr=os.getenv("SMTP_MAIL"),
        to_addr=email,
        smtp_server=os.getenv("SMTP_SERVER"),
        smtp_port=os.getenv("SMTP_PORT"),
        username=os.getenv("SMTP_MAIL"),
        password=os.getenv("SMTP_PASSWORD"), 
        attachment_path=protected_pdf_filename
    )

    send_email(
        subject="Password for Thuraya Refill Codes",
        message="Password for the refill Codes PDF file: " + password,
        from_addr=os.getenv("SMTP_MAIL"),
        to_addr=email,
        smtp_server=os.getenv("SMTP_SERVER"),
        smtp_port=os.getenv("SMTP_PORT"),
        username=os.getenv("SMTP_MAIL"),
        password=os.getenv("SMTP_PASSWORD"), 
    )

    print("emails sent")
    transaction_logs = transaction_logs + "emails sent" + "\n"

    return True, transaction_logs



def protect_pdf(password, pdf_filename, email):
    pdf_writer = PdfWriter()
    pdf_file = open(pdf_filename, "rb")
    pdf_reader = PdfReader(pdf_file)
    for page_number in range(len(pdf_reader.pages)):
        pdf_writer.add_page(pdf_reader.pages[page_number])
    pdf_writer.encrypt(password)
    protected_pdf_filename = "pdfs/protected_pdf" + re.sub(r'\W+', '', email) + "_" + datetime.now().strftime("%Y%m%d%H%M%S") + ".pdf"

    with open(protected_pdf_filename, "wb") as out:
        pdf_writer.write(out)
    pdf_file.close()
    os.remove(pdf_filename) 
    return protected_pdf_filename


def create_pdf(card_numbers, email):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size = 15)
    pdf.multi_cell(200, 10, txt = "scratch card number: " + str(card_numbers), align = 'C')
    pdf_filename = "pdfs/pdf" + re.sub(r'\W+', '', email) + "_" + datetime.now().strftime("%Y%m%d%H%M%S") + ".pdf"
    pdf.output(pdf_filename)
    return pdf_filename


def send_email(subject, message, from_addr, to_addr, smtp_server, smtp_port, username, password, attachment_path=None):
    msg = MIMEMultipart()
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Subject'] = subject

    msg.attach(MIMEText(message, 'plain'))

    if attachment_path is not None:
        with open(attachment_path, "rb") as attachment:
            part = MIMEBase("application", "octet-stream")
            part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header(
            "Content-Disposition",
            f"attachment; filename= {os.path.basename(attachment_path)}",
        )
        msg.attach(part)

    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(username, password)
    text = msg.as_string()
    server.sendmail(from_addr, to_addr, text)
    server.quit()