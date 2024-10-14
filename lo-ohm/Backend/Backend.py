# do python -m venv venv
# do venv\Scripts\activate
# do pip install flask flask-cors pymongo

from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# MongoDB setup
uri = "mongodb+srv://LoOhm:OhmLo@loohm.z6ji1.mongodb.net/?retryWrites=true&w=majority&appName=LoOhm" # connection string uri
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['Main_DB'] # Replace 'database_name' with database name
collection = db['Info'] # Replace 'collection_name' with collection name

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
    try:
        client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)
    app.run(debug=True)
