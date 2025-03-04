from .db import add_prefix_for_prod, db, environment, SCHEMA
from sqlalchemy.sql import func

class Reviews(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    businessId = db.Column(db.String, db.ForeignKey(add_prefix_for_prod('businesses.id')), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    stars = db.Column(db.Integer, nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updatedAt = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())


    def to_dict(self):
        return {
            "id": self.id,
            "userid": self.userId,
            "businessId": self.businessId,
            "message": self.message,
            "stars": self.stars,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }