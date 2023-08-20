from flask import Flask, request
from flask_restful import Api, Resource, reqparse, fields, marshal_with


# FLASK API SETUP
app = Flask(__name__)
CORS(app)
api = Api(app)


class LogIn(Resource):
    def post():
        
    