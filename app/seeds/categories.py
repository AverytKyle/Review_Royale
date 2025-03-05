from app.models import db, environment, SCHEMA
from app.models.categories import Categories
from sqlalchemy.sql import text

def seed_category():
    cat1 = Categories(
        category="Restaurant"
    )
    cat2 = Categories(
        category="Food"
    )
    cat3 = Categories(
        category="Hotel"
    )
    cat4 = Categories(
        category="Delivery"
    )

    db.session.add(cat1)
    db.session.add(cat2)
    db.session.add(cat3)
    db.session.add(cat4)
    db.session.commit()


def undo_category():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.categories RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM categories"))
        
    db.session.commit()