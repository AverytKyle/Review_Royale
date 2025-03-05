from .db import add_prefix_for_prod, db, environment, SCHEMA
from sqlalchemy.sql import func

class ReviewConnections(db.Model):
    __tablename__ = 'review_connections'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    reviewId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('reviews.id')), nullable=False)
    businessId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('businesses.id')), nullable=True)
    googleStoreId = db.Column(db.String, nullable=True)
    createdAt = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updatedAt = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "reviewId": self.reviewId,
            "businessId": self.businessId,
            "googleStoreId": self.googleStoreId,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }
