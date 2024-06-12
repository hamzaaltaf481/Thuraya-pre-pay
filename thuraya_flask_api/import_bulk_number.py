import csv
from database.models.models import PhoneNumber
from database.database import database_session

# TODO: remove the 88216 from the phone number in phone number table for consistency

def run_test():
    session = database_session()
    with open('passwords_complete.csv', mode='r') as file:
        # iterate over each row in the csv file
        csvFile = csv.reader(file)
        for count, row in enumerate(csvFile, start=1):
            # create an instance of phone number model
            phone_number_model = PhoneNumber(phone=row[1], password=row[5], status=row[4])
            # and set the phone number and password
            # save the phone number to the database
            session.add(phone_number_model)
            session.commit()
            print(f"Processed row number: {count}")

run_test()