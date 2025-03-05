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

    db.session.add(demo_connection_1)
    db.session.add(demo_connection_2)
    db.session.add(demo_connection_3)
    db.session.commit()


def undo_review_connections():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.review_connections RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM review_connections"))
        
    db.session.commit()