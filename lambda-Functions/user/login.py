import json
import logging
import os
import datetime
import bcrypt
import jwt
import pymongo
from pymongo import MongoClient

#get environment variables
usr = os.environ['MONGO_DB_USER']
pwd = os.environ['MONGO_DB_PASS']
mongo_db_name = os.environ['MONGO_DB_NAME']
user_collection_name = os.environ['USER_COLLECTION']
url = os.environ['MONGO_DB_URL']
secret = os.environ['SECRET']

#connect to mongo
client = MongoClient('mongodb://' + usr.strip() + ':' + pwd.strip() + '@' + url.strip() + '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority')
mydb = client[mongo_db_name.strip()]
user_collection = mydb[user_collection_name.strip()]

def login(event, context):
    data = json.loads(event['body'])

    #handle CORS
    headers = {
        'headers': {
            'Access-Control-Allow-Headers': 'x-auth-token,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        }
    } 

    email = data['email']
    password = data['password']
    encoded_password = password.encode('utf-8') 

    #get user details
    user_details = user_collection.find_one({'email': email.strip()})
    
    if not user_details:
        response = {
            "statusCode": 401,
            "headers" : headers["headers"],
            "body": json.dumps({'message' : 'Invalid user, please register'})
        }
        return response    
    #get correct password hash
    hashed_pwd = user_details['password']
    hashed_encoded_pwd = hashed_pwd.encode('utf-8')

    #check if password matches
    if bcrypt.checkpw(encoded_password, hashed_encoded_pwd):
        user_id = user_details['user_id']

        #create auth token
        token = jwt.encode({'user_id': user_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, secret.strip())
        status_code = 200
        message = {
                'first_name' : user_details['first_name'],
                'last_name' : user_details['last_name'],
                'token' : token.decode('utf-8'),
                'message' : 'logged in'
            }
        print(headers["headers"])
        print('abc')
    else:
        status_code = 401
        message = {
                'message' : 'Invalid user, please register'
            }

    #create response    
    response = {
        "statusCode": status_code,
        "headers" : headers["headers"],
        "body": json.dumps(message)
    }

    return response

       
