from app.models import db, environment, SCHEMA
from app.models.reviewConnections import ReviewConnections
from sqlalchemy.sql import text

def seed_review_connections():
    demo_connection_1 = ReviewConnections(
        reviewId=1,
        businessId=1,
    )
    demo_connection_2 = ReviewConnections(
        reviewId=2,
        businessId=2,
    )
    demo_connection_3 = ReviewConnections(
        reviewId=3,
        businessId=3,
    )
    demo_connection_4 = ReviewConnections(
        reviewId=4,
        businessId=4,
    )
    demo_connection_5 = ReviewConnections(
        reviewId=5,
        businessId=5,
    )
    demo_connection_6 = ReviewConnections(
        reviewId=6,
        businessId=6,
    )
    demo_connection_7 = ReviewConnections(
        reviewId=7,
        businessId=7,
    )

    db.session.add(demo_connection_1)
    db.session.add(demo_connection_2)
    db.session.add(demo_connection_3)
    db.session.add(demo_connection_4)
    db.session.add(demo_connection_5)
    db.session.add(demo_connection_6)
    db.session.add(demo_connection_7)
    db.session.commit()


def undo_review_connections():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.review_connections RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM review_connections"))
        
    db.session.commit()