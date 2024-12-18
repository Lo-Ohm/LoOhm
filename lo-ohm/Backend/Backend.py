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
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer
import os
from werkzeug.utils import secure_filename
import base64

load_dotenv(dotenv_path='global.env')

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)

app.register_blueprint(api_bp)
app.register_blueprint(math_bp)

CORS(app)  # This will enable CORS for all routes

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('EMAIL_USER')
app.config['MAIL_PASSWORD'] = os.getenv('EMAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('EMAIL_USER')

mail = Mail(app)
serializer = URLSafeTimedSerializer(app.config['JWT_SECRET_KEY'])

# Remove UPLOAD_FOLDER related code

def send_verification_email(email, token):
    verification_url = f"http://localhost:5000/verify-email/{token}"
    msg = Message('Verify Your Email',
                 recipients=[email],
                 body=f'Please click the following link to verify your email: {verification_url}')
    mail.send(msg)

@app.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    try:
        email = serializer.loads(token, max_age=3600)  # Token expires in 1 hour
        user = user_info_collection.find_one({'email': email})
        if user:
            user_info_collection.update_one(
                {'email': email},
                {'$set': {'is_verified': True}}
            )
            return jsonify({'message': 'Email verified successfully'}), 200
        return jsonify({'message': 'User not found'}), 404
    except:
        return jsonify({'message': 'Invalid or expired token'}), 400

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

    if user_info_collection.find_one({'username': username}):
        return jsonify({'message': 'Username already exists'}), 400
    
    if user_info_collection.find_one({'email': email}):
        return jsonify({'message': 'Email already exists'}), 400

    # Hash the password and store the user data
    hashed_password = generate_password_hash(password)

    # Read the default profile picture and convert to Base64
    default_pfp_path = os.path.join('pfp.jpg')
    with open(default_pfp_path, 'rb') as image_file:
        default_pfp_base64 = base64.b64encode(image_file.read()).decode('utf-8')

    # Insert the user into the database
    try:
        user_info_collection.insert_one({
            'username': username,
            'password': hashed_password,
            'email': email,
            'is_verified': False,
            'profilePicture': default_pfp_base64  # Assign default pfp
        })

        # Send verification email
        token = serializer.dumps(email)
        send_verification_email(email, token)

        return jsonify({
            'message': 'User created successfully. Please check your email to verify your account.'
        }), 201
    except Exception as e:
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

    if not user.get('is_verified', False):
        return jsonify({'message': 'Please verify your email before logging in.'}), 401

    # Check if the password is correct
    if not check_password_hash(user['password'], password):
        return jsonify({'message': 'Invalid credentials.'}), 401
    
    # Create an access token
    access_token = create_access_token(identity=user['username'])
    return jsonify({'message': 'Login successful', 'access_token': access_token}), 200

#------------------------ INVENTORY ------------------------#
@app.route('/additem', methods=['POST'])
def additem():
    data = request.json
    username = data.get('username')
    name = data.get('name')
    description = data.get('description')
    price = data.get('price')
    location = data.get('location')
    tags = data.get('tags')
    image = data.get('image')

    # Check if all required fields are present
    if not username or not name or not description or not price or not location or not tags or not image:
        return jsonify({'message': 'Username, item name, description, price, location, tags, and image url are required.'}), 400

    try:
        collection.insert_one({
            'username': username,
            'name': name,
            'description': description,
            'price': price,
            'location': location,
            'tags': tags,
            'image': image
        })
        return jsonify({'message': 'Item added successfully'}), 201
    except Exception as e:
        return jsonify({'message': f'An error occurred: {str(e)}'}), 500
    
@app.route('/getitems', methods=['GET'])
def get_items():
    data = list(collection.find({}))
    itemary = {}
    for i in data:
        itemary.update({i.get('name') : str(i.get('_id'))})
    print(itemary)
    return jsonify(itemary)

@app.route('/getia', methods=['GET'])
def get_ia():
    data = list(collection.find({}, {'_id': 1, 'username': 1, 'name': 1, 'description': 1, 'price': 1, 'location': 1, 'tags': 1, 'image': 1}))
    itemary = {}
    for i in data:
        itemary.update({
            str(i.get('_id')): [
                i.get('username', 'N/A'),
                i.get('name', 'N/A'),
                i.get('description', 'N/A'),
                i.get('price', 0),
                i.get('location', 'N/A'),
                i.get('tags', []),
                i.get('image', 'N/A')
            ]
        })
    return jsonify(itemary)

#------------------------ CHATTING ------------------------#
@app.route('/chat/send', methods=['POST'])
def send_message():
    data = request.json
    sender = data.get('sender')
    recipient = data.get('recipient')
    content = data.get('content')
    timestamp = datetime.now()

    if not all([sender, recipient, content]):
        return jsonify({'message': 'Missing required fields'}), 400

    try:
        # Create a unique conversation ID by sorting usernames
        conv_users = sorted([sender, recipient])
        conv_id = f"{conv_users[0]}_{conv_users[1]}"

        # Create or update conversation
        conversations_collection.update_one(
            {'conversation_id': conv_id},
            {
                '$setOnInsert': {
                    'participants': conv_users,
                    'created_at': timestamp
                },
                '$push': {
                    'messages': {
                        'sender': sender,
                        'content': content,
                        'timestamp': timestamp
                    }
                }
            },
            upsert=True
        )
        return jsonify({'message': 'Message sent successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/chat/conversations/<username>', methods=['GET'])
def get_conversations(username):
    try:
        # Find all conversations where user is a participant
        conversations = conversations_collection.find({
            'participants': username
        })
        
        result = []
        for conv in conversations:
            result.append({
                'conversation_id': conv['conversation_id'],
                'participants': conv['participants'],
                'messages': conv.get('messages', [])
            })
        
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/usernameinfo', methods=['GET'])
@jwt_required()
def usernameinfo():
    current_user = get_jwt_identity()
    print(current_user)
    return jsonify(current_user)

@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    current_user = get_jwt_identity()
    user = user_info_collection.find_one(
        {'username': current_user},
        {'_id': 0, 'password': 0}
    )
    return jsonify(user)

@app.route('/profile/picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    if 'profilePicture' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['profilePicture']
    if file.filename == '':
        return jsonify({'message': 'No file selected'}), 400
    
    try:
        # Read image file and convert to base64
        image_binary = file.read()
        image_base64 = base64.b64encode(image_binary).decode('utf-8')
        
        current_user = get_jwt_identity()
        user_info_collection.update_one(
            {'username': current_user},
            {'$set': {'profilePicture': image_base64}}
        )
        
        return jsonify({
            'message': 'Profile picture updated',
            'pictureUrl': image_base64
        })
    except Exception as e:
        return jsonify({'message': f'Error uploading image: {str(e)}'}), 500

@app.route('/profile/update', methods=['POST'])
@jwt_required()
def update_profile():
    current_user = get_jwt_identity()
    data = request.json
    
    updates = {}
    if 'username' in data and data['username'] != current_user:
        if user_info_collection.find_one({'username': data['username']}):
            return jsonify({'message': 'Username already taken'}), 400
        updates['username'] = data['username']
    
    if 'password' in data and data['password']:
        updates['password'] = generate_password_hash(data['password'])
    
    if updates:
        user_info_collection.update_one(
            {'username': current_user},
            {'$set': updates}
        )
        return jsonify({'message': 'Profile updated successfully'})
    
    return jsonify({'message': 'No updates provided'}), 400



# Add an item to the cart
@app.route('/cart/add', methods=['POST'])
@jwt_required()
def add_to_cart():
    data = request.json
    current_user = get_jwt_identity()
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({'message': 'Product ID is required.'}), 400

    try:
        user_info_collection.update_one(
            {'username': current_user},
            {'$addToSet': {'cart': product_id}}  # Avoid duplicates
        )
        return jsonify({'message': 'Product added to cart'}), 200
    except Exception as e:
        return jsonify({'message': f'Error adding to cart: {str(e)}'}), 500

# Get the user's cart
@app.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    current_user = get_jwt_identity()

    try:
        user = user_info_collection.find_one({'username': current_user}, {'cart': 1, '_id': 0})
        cart = user.get('cart', [])
        return jsonify({'cart': cart}), 200
    except Exception as e:
        return jsonify({'message': f'Error fetching cart: {str(e)}'}), 500


# Remove an item from the cart
@app.route('/cart/remove', methods=['POST'])
@jwt_required()
def remove_from_cart():
    data = request.json
    current_user = get_jwt_identity()
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({'message': 'Product ID is required.'}), 400

    try:
        user_info_collection.update_one(
            {'username': current_user},
            {'$pull': {'cart': product_id}}  # Remove the product from the cart
        )
        return jsonify({'message': 'Product removed from cart'}), 200
    except Exception as e:
        return jsonify({'message': f'Error removing from cart: {str(e)}'}), 500



if __name__ == '__main__':
    app.run(debug=True)
