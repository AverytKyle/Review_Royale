from flask import Blueprint, jsonify
from flask_wtf.csrf import generate_csrf
import os

csrf_routes = Blueprint('csrf', __name__)

@csrf_routes.route('/restore', methods=['GET'])
def restore_csrf():
    response = jsonify({'message': 'CSRF token restored'})
    response.set_cookie(
        'csrf_token',  
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get('FLASK_ENV') == 'production' else None,
        httponly=True
    )
    return response
