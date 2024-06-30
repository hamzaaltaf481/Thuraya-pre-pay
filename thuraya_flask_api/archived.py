
# # ARCHIVED ROUTE
# @app.route("/api/login_refill", methods=["POST"])
# def start_driver():
#     response_code = random.randint(1, 4)

#     if response_code == 1: 
#         return jsonify({"message": "Invalid token"}), 401
#     elif response_code == 2:
#         return jsonify({"message": "Phone or Price invalid!"}), 400
#     elif response_code == 3:
#         return jsonify({"message": "success", "refill_status": "mailed"}), 200
#     elif response_code == 4:
#         return jsonify({
#         "message": "success",
#         "refill_status": "SUCCESS",
#         "previoud_balance": "10.10 $",
#         "new_balance": "30.10 $",
#         "scraped": {
#             "activation_date": "08/09/2020",
#             "balance": "10.10 $",
#             "call_limit": "30/11/2024",
#             "last_recharge": "150.00 $",
#             "status": "Active",
#             "total_refill": "150.00 $"
#         },
#         "scraped_after_refill": {
#             "activation_date": "08/09/2020",
#             "balance": "10.10 $",
#             "call_limit": "30/11/2024",
#             "last_recharge": "150.00 $",
#             "status": "Active",
#             "total_refill": "150.00 $"
#         }
#         }), 200
#     else:
#         return jsonify({"message": "An error occurred"}), 500
#     try:
#         start_time = time.time()
#         log_string = ""
#         logger.info("login request received")
#         print("login request received")
#         log_string = log_string + "login request received" + "\n"
#         with open("constants.json") as f:
#             constants = json.load(f)

#         data = request.get_json()
#         phone = data.get("phone")
#         price = data.get("price")
#         token = request.headers.get('Authorization')

#         if not token:
#             email=data.get('email')
#             print(email)
#             log_string = log_string + email + "\n"
#             new_user = User(email=email, country_region=data.get('country_region'), role='guest')
#             session.add(new_user)
#             session.commit()
#             user_id = new_user.id

#         else:
#             try:
#                 payload = decode_token(token)
#                 user_id = payload['user_id']
#                 user = session.query(User).filter(User.id == user_id).first()
#                 if user:
#                     email = user.email
#             except Exception as e:
#                 print(str(e))
#                 return jsonify({"message": "Invalid token"}), 401


#         valid = check_valid(phone, price)

#         if not valid:
#             return jsonify({"message": "Phone or Price invalid!"}), 400
            
#         card_number, card_id, selling_price = get_card(price, session)
#         log_string = log_string + "scratch_card: " + card_number[-4:] + "\n"
#         codes = []
#         codes.append({"number": card_number, "price": selling_price, "id": card_id})

#         logger.info("phone: "+phone)
#         print("phone: "+phone)
#         logger.info("price: "+price)
#         print("price: "+price)
#         logger.info("email: "+email)
#         print("email: "+email)
#         log_string = log_string + "phone: "+phone + "\n"
#         log_string = log_string + "price: "+price + "\n"
#         log_string = log_string + "email: "+email + "\n"

#         ip_address = "39.47.126.137"
#         ip_info = requests.get(f"https://ipinfo.io/{ip_address}/json")
#         user_agent = request.user_agent

#         last_4_digits = phone[-4:]

#         driver = webdriver.Chrome()
#         # driver.minimize_window()
#         # driver.maximize_window()
#         driver.get(constants["indexUrl"])
#         time.sleep(0.1)

#         password = "12345"

#         # check if a password exists against the given phone number
#         phone_number = session.query(PhoneNumber).filter(PhoneNumber.phone == phone).first()
#         if phone_number:
#             password = phone_number.password

#         print("using password: "+password)
#         logger.info("using password: "+password)
#         log_string = log_string + "using password: "+password + "\n"

#         while True:

#             wrong_creds = False
#             html_content = driver.page_source
#             if "Your phone number or password is wrong" in html_content:
#                 print("phone or password wrong")
#                 log_string = log_string + "phone or password wrong" "\n"
#                 logger.warning("phone or password wrong")
#                 wrong_creds = True
#                 if password == "12345":
#                     password = "1234"
#                     print("using password: "+password)
#                     log_string = log_string + "using password: "+password + "\n"
#                     logger.info("using password: "+password)
#                 elif password == "1234":
#                     password = last_4_digits
#                     print("using password: "+password)
#                     log_string = log_string + "using password: "+password + "\n"
#                     logger.info("using password: "+password)
#                 elif password == last_4_digits:
#                     print("attempted all passwords")
#                     log_string = log_string + "using password: "+password + "\n"
#                     logger.error("attempted all passwords")
#                     break

#             current_url = driver.current_url
#             if (
#                 constants["indexUrl"] in current_url
#                 or constants["loginHandler"] in current_url
#             ):
#                 body = driver.find_element(By.TAG_NAME, "body")
#                 for reload in range(3):
#                     outer_continue = False
#                     try:
#                         fill_login_data(driver, phone, password, logger, log_string)
#                         break
#                     except:
#                         time.sleep(2)
#                         driver.refresh()
#                         outer_continue = True
#                         break
                
#                 if outer_continue:
#                     continue

#                 error_page = False
#                 if "error=captcha" in current_url:
#                     print("captcha not solved")
#                     log_string = log_string + "captcha not solved" + "\n"
#                     logger.warning("captcha not solved")
#                     error_page = True

#                 code = solve_login_captcha(error_page, wrong_creds, driver, logger, log_string)
#                 if code == "":
#                     driver.get(constants["indexUrl"])
#                 fill_login_captcha_code(driver, code, logger)
#                 clicked = check_clicked(driver)
#                 if clicked == False:
#                     print("IP timeout")
#                     logger.warning("IP timeout")
#                     print("sleeping for 10 seconds")
#                     logger.warning("sleeping for 10 seconds")
#                     log_string = log_string + "IP timeout" + "\n"
#                     log_string = log_string + "sleeping for 10 seconds" + "\n"
#                 WebDriverWait(driver, 30).until(staleness_of(body))
#             else:
#                 break

#         discount =0
#         try:
#             promo_code = data.get("promo_code")
#             # discount = find_discount(promo_code)
#             if promo_code != None:
#                 log_string = log_string + str(promo_code) + "\n"

#         except:
#             promo_code = None
#             log_string = log_string + "no promo code" + "\n"

#         current_url = driver.current_url
#         if constants["indexUrl"] in current_url:

#             ################################
#             ################################
#             ################################
#             ################################
#             ################################


#             total_time = time.time() - start_time
#             with open("login_stats.csv", "a") as f:
#                 writer = csv.writer(f, delimiter=",")
#                 writer.writerow([total_time, phone, "failed", log_string])


#             return jsonify({"message": "Log in Failed"}), 500    


#             ################################
#             ################################
#             ################################
#             ################################
#             ################################


#             print("emailing codes")
#             log_string = log_string + "emailing codes" + "\n"
#             email_codes_password(codes, email, log_string)
#             return jsonify({"message": "success", "refill_status": "mailed"}), 200
        
#         print("logged in")
#         # create an instance of PhoneNumber model with password and phone_number and store in the database
#         phone_number_model = PhoneNumber(phone=phone, password=password, status="ACTIVE")
#         session.add(phone_number_model)
#         session.commit()


#         log_string = log_string + "logged in" + "\n"
#         write_correct_statistic()
#         ################################
#         ################################
#         ################################
#         ################################
#         ################################

#         # write the time taken for login in a csv file
#         total_time = time.time() - start_time
#         with open("login_stats.csv", "a") as f:
#             writer = csv.writer(f, delimiter=",")
#             writer.writerow([total_time, phone, password, log_string])


#         return jsonify({"message": "Logged in!"}), 200    

#         ################################
#         ################################
#         ################################
#         ################################
#         ################################

#         time.sleep(0.1)
#         driver.get(constants["detailsUrl"])
#         time.sleep(0.1)

#         scraped = parse_data(driver)
#         if scraped["status"] != "Active":
#             print("not active")
#             print("emailing codes")
#             log_string = log_string + "not active" + "\n"
#             log_string = log_string + "emailing codes" + "\n"
#             email_codes_password(codes, email, log_string)
#             return jsonify({"message": "success", "scraped": scraped, "refill_status": "mailed"}), 200
        
#         print(scraped)
#         log_string = log_string + str(scraped) + "\n"
#         logger.info(scraped)
#         driver.get(constants["loginRefill"])
#         driver.minimize_window()
#         fill_login_refill(card_number, driver, logger)
#         print("scratch card data entered")
#         logger.info("scratch card data entered")
#         log_string = log_string + "scratch card data entered" + "\n"
#         driver.get(constants["refillStatus"])
#         driver.minimize_window()
#         status = check_refill_status(card_number, driver)
#         driver.get(constants["detailsUrl"])
#         driver.minimize_window()
#         time.sleep(0.1)
#         scraped_after_refill = parse_data(driver)
#         print(scraped_after_refill)
#         log_string = log_string + str(scraped_after_refill) + "\n"
#         print(status)
#         log_string = log_string + status + "\n"
#         logger.info(status)

#         transaction_id = create_transaction(user_id, ip_address, ip_info, user_agent, "refill", "stripe", session)
#         create_transaction_detail(promo_code, transaction_id, log_string, discount, False, "", session, codes)

#         time.sleep(3)
#         total_time = time.time() - start_time
#         with open("request_cycle_stats.csv", "a") as f:
#             f.write(f"{total_time}\n")

#         return jsonify({"message": "success", "scraped": scraped, "scraped_after_refill": scraped_after_refill, "refill_status": status}), 200
#     except Exception as e:
#         print(str(e))

#         # msg = Message('Crash Report', recipients=["mrni8mare@gmail.com"])
#         # msg.body = 'Server crashed with error: '+str(e)
#         # mail.send(msg)
#         return jsonify({"message": "An error occurred"}), 500

# # ARCHIVED ROUTE
# @app.route("/api/card", methods=["POST"])
# def fill_card_data():

#     with open("constants.json") as f:
#         constants = json.load(f)
#     data = request.get_json()
#     price = data.get("price")
#     card_number = get_card(price)
#     phone = data.get("phone")
#     print(f"phone: {phone}")
#     logger.info(f"phone: {phone}")
#     print(f"card_number: {card_number}")
#     logger.info(f"card_number: {card_number}")

#     driver = webdriver.Chrome()
#     driver.minimize_window()
#     driver.get(constants["directRefilUrl"])
#     time.sleep(0.1)

#     while True:
#         html_content = driver.page_source

#         if constants["scratchSuccessfulMessage"] in html_content:
#             break
#         else:
#             body = driver.find_element(By.TAG_NAME, "body")
#             fill_scratch_data(driver, phone, card_number, logger)

#             error_page = False
#             if "captcha error" in html_content:
#                 print("captcha not solved")
#                 logger.warning("captcha not solved")
#                 error_page = True

#             code = solve_refill_captcha(error_page, driver, logger)
#             fill_refill_captcha_code(driver, code, logger)
#             WebDriverWait(driver, float("inf")).until(staleness_of(body))

#     write_correct_statistic()
#     print("refill successful")
#     logger.info("refill successful")
#     time.sleep(3)
#     return jsonify({"message": "Card data filled"}), 200
