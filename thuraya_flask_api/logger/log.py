import logging
import colorlog
import datetime

def setup_logger():
    logger = colorlog.getLogger()
    logger.setLevel(logging.DEBUG)

    log_colors_config = {
        'DEBUG': 'cyan',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'red,bg_white',
    }
    today = datetime.date.today().strftime("%d-%m-%Y")

    file_handler = logging.FileHandler(f"logs/{today}.log")
    file_handler.setLevel(logging.DEBUG)

    formatter = colorlog.ColoredFormatter(
        '%(log_color)s%(asctime)s - %(levelname)s - %(message)s',
        log_colors=log_colors_config)

    file_handler.setFormatter(formatter)

    logger.addHandler(file_handler)

    return logger