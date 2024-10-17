from flask import Blueprint, jsonify, request
from Database import *

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

api_bp = Blueprint("apiBP",__name__,url_prefix="/api")

@api_bp.route('/', methods=['GET',"POST"])
def hello_world():
    return 'Hello, penis!'

@api_bp.route('/data', methods=['GET'])
def get_data():
    data = list(collection.find({}, {'_id': 0}))  # Fetch data from MongoDB
    return jsonify(data)

@api_bp.route('/add_data', methods=['POST'])
def add_data():
    new_data = request.json
    collection.insert_one(new_data)  # Insert new data into MongoDB
    return jsonify({'message': 'Data added successfully!'}), 201