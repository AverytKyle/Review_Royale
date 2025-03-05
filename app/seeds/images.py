from app.models import db, environment, SCHEMA
from app.models.images import Images
from sqlalchemy.sql import text

def seed_images():
    demo_image_1 = Images(
        businessId=1,
        url="www.fakeimg.com"
    )
    demo_image_2 = Images(
        businessId=2,
        url="www.fakeimg.com"
    )
    demo_image_3 = Images(
        businessId=3,
        url="www.fakeimg.com"
    )

    db.session.add(demo_image_1)
    db.session.add(demo_image_2)
    db.session.add(demo_image_3)
    db.session.commit()


def undo_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM images"))
        
    db.session.commit()