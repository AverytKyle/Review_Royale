from .db import add_prefix_for_prod, db, environment, SCHEMA
from sqlalchemy.sql import func

class Images(db.Model):
    __tablename__ = 'images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    businessId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('businesses.id')), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updatedAt = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "businessId": self.businessId,
            "url": self.url,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt
        }