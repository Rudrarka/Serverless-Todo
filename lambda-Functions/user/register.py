import json
import logging
import os
import datetime
import uuid
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
print('mongodb://' + usr.strip() + ':' + pwd.strip() + '@' + url.strip()+'?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority')

#connect to mongo
client = MongoClient('mongodb://' + usr.strip() + ':' + pwd.strip() + '@' + url.strip() + '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority')
mydb = client[mongo_db_name.strip()]
user_collection = mydb[user_collection_name.strip()]

def register(event, context):
    data = json.loads(event['body'])
    
    #handle CORS
    headers = {
        'headers': {
            'Access-Control-Allow-Headers': 'x-auth-token,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        }
    }

    # hash password
    password = data['password']
    encoded_password = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(encoded_password, salt)

    timestamp = str(datetime.datetime.now())
    user_id = str(uuid.uuid1())

    # create index to ensure uniqueness of email
    user_collection.create_index([('email', 1)], unique=True)

    item = {
        'user_id': user_id,
        'first_name': data['first_name'],
        'last_name': data['last_name'],
        'email': data['email'],
        'password' : hashed_password.decode('utf-8'),
        'created_on': timestamp
    }

    # write the user information to the database
    try:
        user_collection.insert_one(item)
        status_code = 200

        #create auth token 
        token = jwt.encode({'user_id': user_id, 'exp' : datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, 'secret')
        message = {
                'first_name' : data['first_name'],
                'last_name' : data['last_name'],
                'token' : token.decode('utf-8'),
                'message' : 'user created'
            }
    except Exception as e:
        logging.error(e)
        if 'duplicate key' in str(e):
            status_code = 409
            message = {
                'message' : 'Email id already exists'
            }
        else:
            status_code = 400
            message = {
                'message' : str(e)
            }

    # create a response
    response = {
        "statusCode": status_code,
        "headers" : headers["headers"],
        "body": json.dumps(message)
    }

    return response
