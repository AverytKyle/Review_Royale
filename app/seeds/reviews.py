from app.models import db, environment, SCHEMA
from app.models.reviews import Reviews
from sqlalchemy.sql import text

def seed_reviews():
    demo_review_1 = Reviews(
        userId=1,
        message="Great place! Would come back again!",
        stars=5
    )
    demo_review_2 = Reviews(
        userId=1,
        message="Great place! Would come back again!",
        stars=5
    )
    demo_review_3 = Reviews(
        userId=1,
        message="Great place! Would come back again!",
        stars=5
    )

    db.session.add(demo_review_1)
    db.session.add(demo_review_2)
    db.session.add(demo_review_3)
    db.session.commit()


def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
        
    db.session.commit()