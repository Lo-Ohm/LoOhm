# do python -m venv venv
# do venv\Scripts\activate
# do pip install flask flask-cors pymongo, pip install flask_jwt_extended

from flask import Flask, jsonify, request
from flask_cors import CORS
from Blueprints.APIBlueprint import api_bp
from Blueprints.MathBlueprint import math_bp
from Database import *
from werkzeug.security import generate_password_hash, check_password_hash  # For password hashing
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity



app = Flask(__name__)


app.register_blueprint(api_bp)
app.register_blueprint(math_bp)

CORS(app)  # This will enable CORS for all routes

@app.route('/', methods=['GET',"POST"])
def hello_world():
    return 'Hello, World!'

#created this to test out fetching all entries from database
@app.route('/get-data', methods=['GET'])
def get_data():
    data = list(collection.find({}, {'_id':0}))
    return jsonify(data)


#user signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    # Check if all required fields are present
    if not username or not password or not email:
        return jsonify({'message': 'Username, password, and email are required.'}), 400

    # Check if the user already exists
    if user_info_collection.find_one({'username': username}):
        return jsonify({'message': 'Username already exists'}), 400

    # Hash the password and store the user data
    hashed_password = generate_password_hash(password)

    # Insert the user into the database
    try:
        user_info_collection.insert_one({
            'username': username,
            'password': hashed_password,
            'email': email
        })
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500

#user login - search through database for user and check if password is correct and if not throw error
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Check if all required fields are present
    if not username or not password:
        return jsonify({'message': 'Username and password are required.'}), 400

    # Check if the user exists
    user = user_info_collection.find_one({'username': username})
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Check if the password is correct
    if not check_password_hash(user['password'], password):
        return jsonify({'message': 'Incorrect password'}), 401

    # Create an access token
    access_token = create_access_token(identity=username)
    return jsonify({'access_token': access_token}), 200


if __name__ == '__main__':
    app.run(debug=True)
