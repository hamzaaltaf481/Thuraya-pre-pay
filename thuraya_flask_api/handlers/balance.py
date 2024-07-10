from flask import jsonify
from utils.check_balance import find_details


def balance_check_handler(request, session, logger):
    log_string = ""

    logger.info("balance check request received")
    print("balance check request received")
    log_string = log_string + "balance check request received" + "\n"

    phone = request.form.get("phone")

    logger.info("phone: " + phone)
    print("phone: " + phone)
    log_string = log_string + "phone: " + phone + "\n"

    (
        log_string,
        current_balance,
        refill_allowed,
        last_active_date,
        current_status,
        error,
    ) = find_details(phone, log_string, logger)

    if error:
        return jsonify({"message": "Invalid Account"}), 400
    if refill_allowed != "Yes":
        print("Refill not allowed")
        log_string = log_string + "Refill not allowed" + "\n"
        logger.info("Refill not allowed")
        return jsonify({"message": "Refill not allowed. Phone is inactive."}), 400

    return (
        jsonify(
            {
                "message": "Balance check successful",
                "current_balance": current_balance,
                "refill_allowed": refill_allowed,
                "expiry_date": last_active_date,
            }
        ),
        200,
    )
