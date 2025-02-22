from app.models import db, environment, SCHEMA
from app.models.business import Business
from sqlalchemy.sql import text

def seed_businesses():
    demo_business_1 = Business(
        name="Fake 1",
        email="fakeemail@aa.io",
        phoneNumber="5551112222",
        website="www.fake.com",
        addressLineOne="123 Fake St",
        addressLineTwo="Apt 4",
        city="Orlando",
        state="Fl",
        zip="33665",
    )
    demo_business_2 = Business(
        name="Fake 2",
        email="fakeremail@aa.io",
        phoneNumber="5551112222",
        website="www.fake.com",
        addressLineOne="123 Faker St",
        addressLineTwo="",
        city="Orlando",
        state="Fl",
        zip="33665",
    )
    demo_business_3 = Business(
        name="Fake 3",
        email="fakestemail@aa.io",
        phoneNumber="5551112222",
        website="www.fake.com",
        addressLineOne="123 Fakest St",
        addressLineTwo="Apt 2",
        city="Orlando",
        state="Fl",
        zip="33665",
    )

    db.session.add(demo_business_1)
    db.session.add(demo_business_2)
    db.session.add(demo_business_3)
    db.session.commit()


def undo_businesses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM businesses"))
        
    db.session.commit()