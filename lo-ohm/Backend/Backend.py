# do python -m venv venv
# do venv\Scripts\activate
# do pip install flask flask-cors pymongo

from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['database_name'] # Replace 'database_name' with database name
collection = db['collection_name'] # Replace 'collection_name' with collection name

@app.route('/api/data', methods=['GET'])
def get_data():
    data = list(collection.find({}, {'_id': 0}))  # Fetch data from MongoDB
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
def add_data():
    new_data = request.json
    collection.insert_one(new_data)  # Insert new data into MongoDB
    return jsonify({'message': 'Data added successfully!'}), 201

if __name__ == '__main__':
    app.run(debug=True)
