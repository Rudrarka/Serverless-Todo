import json
import logging
import os
import datetime
import jwt
import uuid
import pymongo
from pymongo import MongoClient

#get environment variables
usr = os.environ['MONGO_DB_USER']
pwd = os.environ['MONGO_DB_PASS']
mongo_db_name = os.environ['MONGO_DB_NAME']
user_collection_name = os.environ['USER_COLLECTION']
todo_collection_name = os.environ['TODO_COLLECTION']
url = os.environ['MONGO_DB_URL']
secret = os.environ['SECRET']

#connect to mongo
client = MongoClient('mongodb://' + usr.strip() + ':' + pwd.strip() + '@' + url.strip() + '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority')
mydb = client[mongo_db_name.strip()]
user_collection = mydb[user_collection_name.strip()]
todo_collection = mydb[todo_collection_name.strip()]

def verify_token(event, context):
    auth_token = None

    headers = {
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,x-auth-token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        }
    }

    if 'x-auth-token' in event['headers']:
        auth_token = event['headers']['x-auth-token']
        print(auth_token)
        print(event)
    
    #return authorization error if invalid token
    print(auth_token)
    print(event)
    if not auth_token:
        response = {
            "statusCode": 401,
            "headers" : headers["headers"],
            "body": json.dumps({'message' : 'Invalid auth key'})
        }
        return response   
    
    try:
        #decode auth token
        decoded_token  = jwt.decode(auth_token, secret.strip())
        user_id = decoded_token['user_id']
        user_data = user_collection.find_one({'user_id' : user_id}, {'_id' : 0})

        #fetch todo list
        todo_items = todo_collection.find({ 'user_id': user_id},{'_id':0})
        todo_item_list = list(todo_items)

        status_code = 200
        message = {
                'user':{
                    'first_name' : user_data['first_name'],
                    'last_name' : user_data['last_name'],
                    'token' : auth_token
                },
                'todo_list' : todo_item_list,
                'message' : 'Verified Token'
            }
    except jwt.InvalidTokenError:
        status_code = 401
        message = {
            'message' : 'Invalid auth key'
            }
    except Exception as e:
        status_code = 400
        message = {
                'message' : str(e)
        }

    #create response    
    response = {
        "statusCode": status_code,
        "headers" : headers["headers"],
        "body": json.dumps(message)
    }

    return response
