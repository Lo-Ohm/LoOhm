import os
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv



# Load .env file
load_dotenv(dotenv_path='lo-ohm/Backend/global.env')

# MongoDB setup
uri = os.getenv("MONGODB_URI") # connection string uri
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['Main_DB']
collection = db['Info']
user_info_collection = db['user_info']
chat_collection = db['chatbox']
conversations_collection = db['conversations']
