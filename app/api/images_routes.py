from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime
from app.models import db, Images

images_routes = Blueprint('images', __name__)

# Get all images for a business
@images_routes.route('/business/<int:businessId>')
def get_images(businessId):
    images = Images.query.get(businessId)
    return jsonify({
        'Images': [n.to_dict() for n in images]
    }), 200

# Get image by id
@images_routes.route('/<int:imageId>')
def get_image_by_id(imageId):
    image = Images.query.get(imageId)

    if image is None:
        return jsonify({"message": "Image couldn't be found"}), 404
    
    return jsonify({
        'Image': image.to_dict()
    }), 200

# Create an image
@images_routes.route('', methods=['POST'])
@login_required
def create_image():
    data = request.get_json()
    businessId = data.get('businessId')
    url = data.get('url')

    if not url:
        return jsonify({"message": "Url is required"}), 400
    
    image = Images(
        businessId=businessId,
        url=url,
    )
    
    db.session.add(image)
    db.session.commit()

    return jsonify(image.to_dict()), 201

# Update an image
@images_routes.route('/<int:imageId>', methods=['PUT'])
@login_required
def update_image(imageId):
    image = Images.query.get(imageId)

    if not image:
        return jsonify({"message": "Image couldn't be found"}), 404
    
    data = request.get_json()
    
    image.url = data.get('url', image.url)
   
    db.session.commit()
    return jsonify(image.to_dict()), 200

#Delete an image
@images_routes.route('/<int:imageId>', methods=['DELETE'])
@login_required
def delete_image(imageId):
    image = Images.query.get(imageId)

    if image is None:
        return jsonify({"message": "Image couldn't be found"}), 404

    db.session.delete(image)
    db.session.commit()
    return {'message': 'Image successfully deleted'}, 200