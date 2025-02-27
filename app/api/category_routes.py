from flask import Blueprint, jsonify, request
from datetime import datetime
from app.models import db, Categories

category_routes = Blueprint('categories', __name__)

@category_routes.route('/')
def get_categories():
    categories = Categories.query.all()
    return jsonify({
        "categories": [n.to_dict() for n in categories]
    }), 200