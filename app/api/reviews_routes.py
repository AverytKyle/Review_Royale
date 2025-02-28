from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime
from app.models import db, Reviews

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
@reviews_routes.route('/businesses/<int:businessId>')
def get_review_by_business_id(businessId):
    reviews = Reviews.query.filter(Reviews.businessId == businessId).all()

    if reviews is None:
        return jsonify({"message": "Reviews couldn't be found"}), 404
    
    return jsonify({
        'Review': [n.to_dict() for n in reviews]
    }), 200

# Create a review
@reviews_routes.route('/businesses/<int:businessId>', methods=['POST'])
@login_required
def create_review():
    data = request.get_json()
    userId = data.get('userId')
    businessId = data.get('businessId')
    message = data.get('message')
    stars = data.get('stars')

    if not message:
        return jsonify({"message": "Message is required"}), 400
    
    if not stars:
        return jsonify({"message": "Stars are required"}), 400
    
    review = Reviews(
        userId=userId,
        businessId=businessId,
        message=message,
        stars=stars,
    )
    
    db.session.add(review)
    db.session.commit()

    return jsonify(review.to_dict()), 201

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