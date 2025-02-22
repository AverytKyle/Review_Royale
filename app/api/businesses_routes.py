from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime

businesses_routes = Blueprint('business', __name__)

# Get all businesses
# @businesses_routes.route('')
# def get_businesses():
#     businesses = 