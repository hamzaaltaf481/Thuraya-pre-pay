from flask import jsonify
from database.models.models import CardDetail

def add_card_detail_handler(session, request):

    new_card_detail = CardDetail(
        card_id=request.form.get("card_id"),
        serial_number=request.form.get("serial_number"),
        scratch_code=request.form.get("scratch_code"),
        units=request.form.get("units"),
        purchase_price=request.form.get("purchase_price"),
        selling_price=request.form.get("selling_price"),
        expiry_date=request.form.get("expiry_date"),
        remarks=request.form.get("remarks"),
        card_status=False,
    )

    session.add(new_card_detail)
    session.commit()

    return jsonify({'message': 'Card detail added successfully'}), 200


