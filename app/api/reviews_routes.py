from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime
from app.models import db, Reviews, ReviewConnections

reviews_routes = Blueprint('reviews', __name__)

# Get all reviews for user
@reviews_routes.route('')
@login_required
def get_reviews():
    reviews = Reviews.query.filter_by(userId=current_user.id).all()
    return jsonify({
        'Reviews': [n.to_dict() for n in reviews]
    }), 200

# Get all reviews
@reviews_routes.route('/recent')
def get_recent_reviews():
    reviews = Reviews.query.order_by(Reviews.createdAt.desc()).limit(6).all()
    return jsonify({
        "reviews": [n.to_dict() for n in reviews]
    })

# Get review by id
@reviews_routes.route('/<int:reviewId>')
def get_review_by_id(reviewId):
    review = Reviews.query.get(reviewId)

    if review is None:
        return jsonify({"message": "Review couldn't be found"}), 404
    
    return jsonify({
        'Review': review.to_dict()
    }), 200

# Get reviews for business
@reviews_routes.route('/business/<path:businessId>')
def get_business_reviews(businessId):
    try:
        # Try to convert to int for regular business IDs
        business_id_int = int(businessId)
        reviews = Reviews.query.join(ReviewConnections).filter(ReviewConnections.businessId == business_id_int).all()
    except ValueError:
        # If conversion fails, treat as string (Google Place ID)
        reviews = Reviews.query.join(ReviewConnections).filter(ReviewConnections.googleStoreId == businessId).all()
    
    return jsonify({
        'Reviews': [review.to_dict() for review in reviews]
    })

# Create a review for a business with int
@reviews_routes.route('/new/<int:businessId>', methods=['POST'])
@login_required
def create_review_business(businessId):
    data = request.get_json()
    new_review = Reviews(
        userId=data['userId'],
        message=data['message'],
        stars=data['stars']
    )
    db.session.add(new_review)
    db.session.commit()
    
    # Create the connection
    review_connection = ReviewConnections(
        reviewId=new_review.id,
        businessId=businessId
    )
    db.session.add(review_connection)
    db.session.commit()
    
    return jsonify(new_review.to_dict()), 201

# Create a review for a business with string
@reviews_routes.route('/new/<string:businessId>', methods=['POST'])
@login_required
def create_review_place(businessId):
    data = request.get_json()
    new_review = Reviews(
        userId=data['userId'],
        message=data['message'],
        stars=data['stars']
    )
    db.session.add(new_review)
    db.session.commit()
    
    review_connection = ReviewConnections(
        reviewId=new_review.id,
        googleStoreId=businessId
    )
    db.session.add(review_connection)
    db.session.commit()
    
    return jsonify(new_review.to_dict()), 201

# Update a review
@reviews_routes.route('/<int:reviewId>', methods=['PUT'])
@login_required
def update_review(reviewId):
    review = Reviews.query.get(reviewId)

    if not review:
        return jsonify({"message": "Review couldn't be found"}), 404
    
    data = request.get_json()
    
    review.message = data.get('message', review.message)
    review.stars = data.get('stars', review.stars)
   
    db.session.commit()
    return jsonify(review.to_dict()), 200

#Delete a review
@reviews_routes.route('/<int:reviewId>', methods=['DELETE'])
@login_required
def delete_review(reviewId):
    review = Reviews.query.get(reviewId)

    if review is None:
        return jsonify({"message": "Review couldn't be found"}), 404

    db.session.delete(review)
    db.session.commit()
    return {'message': 'Review successfully deleted'}, 200