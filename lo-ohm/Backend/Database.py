from pymongo import MongoClient
from pymongo.server_api import ServerApi


# MongoDB setup
uri = "mongodb+srv://LoOhm:OhmLo@loohm.z6ji1.mongodb.net/?retryWrites=true&w=majority&appName=LoOhm" # connection string uri
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['Main_DB'] # Replace 'database_name' with database name
collection = db['Info'] # Replace 'collection_name' with collection name
user_info_collection = db['user_info']  # New collection for storing user information
