# do python -m venv venv
# do venv\Scripts\activate
# do pip install flask flask-cors pymongo, pip install flask_jwt_extended, dotenv

from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from Blueprints.APIBlueprint import api_bp
from Blueprints.MathBlueprint import math_bp
from Database import *
from werkzeug.security import generate_password_hash, check_password_hash  # For password hashing
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


load_dotenv(dotenv_path='lo-ohm/Backend/global.env')


app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

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

    user_check_start = datetime.now()  # Start time for the user query
    if user_info_collection.find_one({'username': username}):
        user_check_end = datetime.now()
        print(f"User check took: {user_check_end - user_check_start}")
        return jsonify({'message': 'Username already exists'}), 400
    
    # Check if the email already exists
    email_check_start = datetime.now()  # Start time for the email query
    if user_info_collection.find_one({'email': email}):
        email_check_end = datetime.now()
        print(f"Email check took: {email_check_end - email_check_start}")
        return jsonify({'message': 'Email already exists'}), 400

    # Hash the password and store the user data
    hashed_password = generate_password_hash(password)

    # Insert the user into the database
    insert_start = datetime.now()  # Start time for the insert operation
    try:
        user_info_collection.insert_one({
            'username': username,
            'password': hashed_password,
            'email': email
        })
        insert_end = datetime.now()
        print(f"Insert took: {insert_end - insert_start}")
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        end_time = datetime.now()
        print(f"Total time for signup: {end_time - insert_start}")
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500


#user login - search through database for user and check if password is correct and if not throw error
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    # Check if either username or email is provided
    if not username and not email:
        return jsonify({'message': 'Username or email is required.'}), 400
    
    # Check if password is provided
    if not password:
        return jsonify({'message': 'Password is required.'}), 400

    # If username is provided, search by username
    if username:
        user = user_info_collection.find_one({'username': username})
    
    # If email is provided, search by email
    if email and not username:
        user = user_info_collection.find_one({'email': email})

    if not user:
        return jsonify({'message': 'User does not exist.'}), 401

    # Check if the password is correct
    if not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials.'}), 401
    
    # Create an access token
    access_token = create_access_token(identity=user['username'])
    return jsonify({'message': 'Login successful', 'access_token': access_token}), 200


if __name__ == '__main__':
    app.run(debug=True)
