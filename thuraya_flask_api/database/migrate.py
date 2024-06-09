from database.database import connect_to_database

def migrate_tables():
    db = connect_to_database()
    cursor = db.cursor()

    cursor.execute("""
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user VARCHAR(255),
            password VARCHAR(255),
            name VARCHAR(255),
            country_region VARCHAR(255),
            email VARCHAR(255),
            role VARCHAR(255),
            email_confirmed BOOLEAN
        )
    """)

    cursor.execute("""
        CREATE TABLE promo_codes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            code VARCHAR(255),
            discount VARCHAR(255),
            units VARCHAR(255),
            type VARCHAR(255),
            start_date DATETIME,
            end_date DATETIME,
            status BOOLEAN
        )
    """)

    cursor.execute("""
        CREATE TABLE cards (
            id INT AUTO_INCREMENT PRIMARY KEY,
            po_number INT,
            pl_number INT,
            date_purchased DATETIME,
            total_amount INT,
            payment_status BOOLEAN,
            attachment_path VARCHAR(255)
        )
    """)

    cursor.execute("""
        CREATE TABLE card_details (
            id INT AUTO_INCREMENT PRIMARY KEY,
            card_id INT,
            serial_number INT,
            scratch_code VARCHAR(255),
            units INT,
            purchase_price INT, 
            selling_price INT,
            expiry_date DATETIME,
            card_status BOOLEAN,
            remarks VARCHAR(255),
            FOREIGN KEY (card_id) REFERENCES cards(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            from_ip VARCHAR(255),
            from_location VARCHAR(255),
            from_device VARCHAR(255),
            from_details VARCHAR(255),
            type VARCHAR(255),
            payment_received BOOLEAN,
            payment_mode VARCHAR(255),
            payment_status BOOLEAN,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE transaction_details (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            promo_id INT,
            transaction_id INT,
            card_details_id INT,
            type VARCHAR(255),
            transaction_details LONGTEXT,
            sat_phone_number INT,
            selling_price INT,
            discount_amount INT,
            net_price INT,
            card_status BOOLEAN,
            recharge_status BOOLEAN,
            email_status BOOLEAN,
            remarks VARCHAR(255), 
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (promo_id) REFERENCES promo_codes(id),
            FOREIGN KEY (transaction_id) REFERENCES transactions(id),
            FOREIGN KEY (card_details_id) REFERENCES card_details(id)
        )
    """)

    cursor.execute("""
        CREATE TABLE phone_numbers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            phone VARCHAR(255),
            password VARCHAR(255)
            )
    """)

    db.commit()
    return
