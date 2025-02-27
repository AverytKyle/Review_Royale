from flask import Blueprint, jsonify
from ..config import Config

maps_routes = Blueprint('maps', __name__)

@maps_routes.route('/key', methods=['GET', 'POST'])
def get_maps_key():
    return jsonify({'googleMapsAPIKey': Config.MAPS_API_KEY})
