# do python -m venv venv
# do venv\Scripts\activate
# do pip install flask flask-cors pymongo

from flask import Flask, jsonify, request
from flask_cors import CORS
from Blueprints.APIBlueprint import api_bp
from Blueprints.MathBlueprint import math_bp

app = Flask(__name__)

app.register_blueprint(api_bp)
app.register_blueprint(math_bp)

CORS(app)  # This will enable CORS for all routes

@app.route('/', methods=['GET',"POST"])
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
