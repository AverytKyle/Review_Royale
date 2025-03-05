from app.models import db, environment, SCHEMA
from sqlalchemy.sql import text
from app.models.businessCat import BusinessCat

def seed_businessCat():
    businessCat1 = BusinessCat(businessId=1, categoryId=1)
    businessCat2 = BusinessCat(businessId=2, categoryId=2)
    businessCat3 = BusinessCat(businessId=3, categoryId=3)
    businessCat4 = BusinessCat(businessId=1, categoryId=4)

    db.session.add(businessCat1)
    db.session.add(businessCat2)
    db.session.add(businessCat3)
    db.session.add(businessCat4)
    db.session.commit()

def undo_businessCat():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.businessCat RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM businessCat"))

    db.session.commit()
