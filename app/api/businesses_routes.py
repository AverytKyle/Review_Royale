from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime
from app.models import db, Business

businesses_routes = Blueprint('businesses', __name__)

# Get all businesses
@businesses_routes.route('/')
def get_businesses():
    businesses = Business.query.all()
    return jsonify({
        'Businesses': [n.to_dict() for n in businesses]
    }), 200

# Get all businesses for user
@businesses_routes.route('/current')
def get_businesses_user():
    businesses = Business.query.filter_by(userId=current_user.id).all()
    return jsonify({
        'Businesses': [n.to_dict() for n in businesses]
    }), 200

# Get business by id
@businesses_routes.route('/<int:businessId>')
def get_business_by_id(businessId):
    business = Business.query.get(businessId)

    if business is None:
        return jsonify({"message": "Business couldn't be found"}), 404
    
    return jsonify(business.to_dict()), 200

# Create business
@businesses_routes.route('', methods=['POST'])
@login_required
def create_business():
    data = request.get_json()
    userId = data.get('userId')
    name = data.get('name')
    phoneNumber = data.get('phoneNumber')
    website = data.get('website')
    addressLineOne = data.get('addressLineOne')
    addressLineTwo = data.get('addressLineTwo')
    city = data.get('city')
    state = data.get('state')
    zip = data.get('zip')

    if not name:
        return jsonify({"message": "Name is required"}), 400
    
    if not phoneNumber:
        return jsonify({"message": "Phone number is required"}), 400
    
    if not website:
        return jsonify({"message": "Website url is required"}), 400
    
    if not addressLineOne:
        return jsonify({"message": "Address is required"}), 400
    
    if not city:
        return jsonify({"message": "City is required"}), 400
    
    if not state:
        return jsonify({"message": "State is required"}), 400
    
    if not zip:
        return jsonify({"message": "Zip is required"}), 400
    
    business = Business(
        userId=userId,
        name=name,
        phoneNumber=phoneNumber,
        website=website,
        addressLineOne=addressLineOne,
        addressLineTwo=addressLineTwo,
        city=city,
        state=state,
        zip=zip
    )
    
    db.session.add(business)
    db.session.commit()

    return jsonify(business.to_dict()), 201

# Update a business
@businesses_routes.route('/<int:businessId>', methods=['PUT'])
@login_required
def update_business(businessId):
    business = Business.query.get(businessId)

    if not business:
        return jsonify({"message": "Business couldn't be found"}), 404
    
    data = request.get_json()
    
    business.name = data.get('name', business.name)
    business.phoneNumber = data.get('phoneNumber', business.phoneNumber)
    business.website = data.get('website', business.website)
    business.addressLineOne = data.get('addressLineOne', business.addressLineOne)
    business.addressLineTwo = data.get('addressLineTwo', business.addressLineTwo)
    business.city = data.get('city', business.city)
    business.state = data.get('state', business.state)
    business.zip = data.get('zip', business.zip)
    business.updated_at = datetime.now()
    
    db.session.commit()
    return jsonify(business.to_dict()), 200

#Delete a business
@businesses_routes.route('/<int:businessId>', methods=['DELETE'])
@login_required
def delete_business(businessId):
    business = Business.query.get(businessId)

    if business is None:
        return jsonify({"message": "Business couldn't be found"}), 404

    db.session.delete(business)
    db.session.commit()
    return jsonify({'message': 'Business successfully deleted'}), 200

@businesses_routes.route('/search')
def search_businesses():
    search_term = request.args.get('term', '')
    location = request.args.get('location', '')
    
    query = Business.query
    
    if search_term:
        search_filter = (Business.name.ilike(f'%{search_term}%') |
                        Business.city.ilike(f'%{search_term}%') |
                        Business.state.ilike(f'%{search_term}%'))
        query = query.filter(search_filter)
    
    if location:
        location_filter = (Business.city.ilike(f'%{location}%') |
                         Business.state.ilike(f'%{location}%') |
                         Business.zip.ilike(f'%{location}%'))
        query = query.filter(location_filter)
    
    businesses = query.all()
    
    return jsonify({
        'businesses': [business.to_dict() for business in businesses]
    }), 200
