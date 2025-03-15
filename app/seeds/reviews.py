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
    demo_review_4 = Reviews(
        userId=1,
        message="A literature review is a critical summary and evaluation of the current resources (e.g., books and journal articles) on a specific topic or research question. It is a crucial part of academic writing, such as dissertations, in all categories and fields. Essentially, literature reviews help contextualize your investigations and show how your work is building on existing research.",
        stars=5
    )
    demo_review_5 = Reviews(
        userId=1,
        message="It’s also essential that a literature review critically analyze the sources cited in your study, considering factors such as sample size, research design, and potential biases. Be sure to structure your literature review using the same referencing style as the rest of your research paper",
        stars=1
    )
    demo_review_6 = Reviews(
        userId=1,
        message="A literature review is a crucial step in the research process, providing an in-depth analysis of existing research on a specific topic. However, many students and researchers often struggle with the time it takes to complete this task. In this article, we’ll explore the factors that influence the duration of writing a literature review and offer practical tips to help you get started.",
        stars=2
    )
    demo_review_7 = Reviews(
        userId=1,
        message="Keep in mind that these are rough estimates, and the actual time it takes to write a literature review can vary significantly depending on your research topic and writing style.",
        stars=4
    )
    

    db.session.add(demo_review_1)
    db.session.add(demo_review_2)
    db.session.add(demo_review_3)
    db.session.add(demo_review_4)
    db.session.add(demo_review_5)
    db.session.add(demo_review_6)
    db.session.add(demo_review_7)
    db.session.commit()


def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
        
    db.session.commit()