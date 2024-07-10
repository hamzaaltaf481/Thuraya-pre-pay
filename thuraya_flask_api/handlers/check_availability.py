from database.models.models import CardDetail
from flask import jsonify


def check_availability_handler(session):
    """
    This function checks the availability of the card details in the database.
    :count the number of cards against each units possible value.
    """
    card_details = session.query(CardDetail).all()  # Execute the query
    card_details_dict = {
        10: 0,
        20: 0,
        39: 0,
        50: 0,
        80: 0,
        160: 0,
        500: 0,
        1000: 0,
        2500: 0,
    }
    for card in card_details:
        if card.card_status == False:
            card_details_dict[card.units] += 1

    print(card_details_dict)
    return jsonify(card_details_dict), 200
