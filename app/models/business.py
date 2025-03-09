from .db import add_prefix_for_prod, db, environment, SCHEMA
from sqlalchemy.sql import func

class Business(db.Model):
    __tablename__ = 'businesses'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    phoneNumber = db.Column(db.String(50), nullable=False)
    website = db.Column(db.String(255), nullable=False)
    addressLineOne = db.Column(db.String(50), nullable=False)
    addressLineTwo = db.Column(db.String(50), nullable=True)
    city = db.Column(db.String(50), nullable=False)
    state = db.Column(db.String(2), nullable=False)
    zip = db.Column(db.String(50), nullable=False)
    createdAt = db.Column(db.DateTime, nullable=False, server_default=func.now())
    updatedAt = db.Column(db.DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    reviews = db.relationship('ReviewConnections', backref='businesses', lazy=True, cascade='all, delete-orphan')
    images = db.relationship('Images', backref='businesses', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "name": self.name,
            "phoneNumber": self.phoneNumber,
            "website": self.website,
            "addressLineOne": self.addressLineOne,
            "addressLineTwo": self.addressLineTwo,
            "city": self.city,
            "state": self.state,
            "zip": self.zip,
            "createdAt": self.createdAt,
            "updatedAt": self.updatedAt,
            "reviews": [connection.to_dict() for connection in self.reviews]
        }