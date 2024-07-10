def test():
    log_string = ""
    try:
        log_string = log_string + "1"
        raise Exception("Test Exception")
    except Exception as e:
        log_string = log_string + "2"
        print(log_string)
        print(e)


test()
