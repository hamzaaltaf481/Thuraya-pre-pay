import secrets
import string
from fpdf import FPDF
from PyPDF2 import PdfWriter, PdfReader
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
from email.mime.base import MIMEBase
from email import encoders

load_dotenv()


def email_codes_password(card_number, email):

    alphabet = string.ascii_letters + string.digits
    password = "".join(secrets.choice(alphabet) for i in range(10))
    print(password)

    pdf_filename = create_pdf(card_number)

    protected_pdf_filename = protect_pdf(password, pdf_filename)

    send_email(
        subject="Thuraya Refill Codes",
        message="Password protected pdf file is attached",
        from_addr=os.getenv("SMTP_MAIL"),
        to_addr=email,
        smtp_server=os.getenv("SMTP_SERVER"),
        smtp_port=os.getenv("SMTP_PORT"),
        username=os.getenv("SMTP_MAIL"),
        password=os.getenv("SMTP_PASSWORD"),
        attachment_path=protected_pdf_filename,
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


def protect_pdf(password, pdf_filename):
    pdf_writer = PdfWriter()
    pdf_file = open(pdf_filename, "rb")
    pdf_reader = PdfReader(pdf_file)
    for page_number in range(len(pdf_reader.pages)):
        pdf_writer.add_page(pdf_reader.pages[page_number])
    pdf_writer.encrypt(password)
    protected_pdf_filename = "protected_card_number.pdf"
    with open(protected_pdf_filename, "wb") as out:
        pdf_writer.write(out)
    pdf_file.close()
    os.remove(pdf_filename)
    return protected_pdf_filename


def create_pdf(card_number):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=15)
    pdf.cell(200, 10, txt="scratch card number" + card_number, ln=True, align="C")
    pdf_filename = "card_number.pdf"
    pdf.output(pdf_filename)
    return pdf_filename


def send_email(
    subject,
    message,
    from_addr,
    to_addr,
    smtp_server,
    smtp_port,
    username,
    password,
    attachment_path=None,
):
    msg = MIMEMultipart()
    msg["From"] = from_addr
    msg["To"] = to_addr
    msg["Subject"] = subject

    msg.attach(MIMEText(message, "plain"))

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


def generate_key():
    from cryptography.fernet import Fernet

    key = Fernet.generate_key()
    cipher_suite = Fernet(key)

    print(key.decode("utf-8"))
