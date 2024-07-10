import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

engine = create_engine(
    f"mysql+mysqlconnector://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}/{os.getenv('MYSQL_DB')}"
)
Session = sessionmaker(bind=engine)
session = Session()

try:
    # Your database operations here
    session.commit()
except:
    session.rollback()
    raise
finally:
    session.close()
