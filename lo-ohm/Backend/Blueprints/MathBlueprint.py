from flask import Blueprint, jsonify, request

math_bp = Blueprint("math_testing",__name__,url_prefix="/math")


@math_bp.route('/add/<int:num1>/<int:secondNumber>', methods=['GET',"POST"])
def hello_world(num1,secondNumber):
    return request.method + " " + str(num1+secondNumber)