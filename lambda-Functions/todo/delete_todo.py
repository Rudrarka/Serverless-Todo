import json
import logging
import os
import datetime
import jwt
import pymongo
from pymongo import MongoClient

#get environment variables
usr = os.environ['MONGO_DB_USER']
pwd = os.environ['MONGO_DB_PASS']
mongo_db_name = os.environ['MONGO_DB_NAME']
todo_collection_name = os.environ['TODO_COLLECTION']
url = os.environ['MONGO_DB_URL']
secret = os.environ['SECRET']

#connect to mongo
client = MongoClient('mongodb://' + usr.strip() + ':' + pwd.strip() + '@' + url.strip() + '?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority')
mydb = client[mongo_db_name.strip()]
todo_collection = mydb[todo_collection_name.strip()]

def delete_todo(event, context):
    todo_id = event['pathParameters']['id']
    auth_token = None

    #handle CORS
    headers = {
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent,x-auth-token',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,DELETE'
        }
    }

    if 'x-auth-token' in event['headers']:
        auth_token = event['headers']['x-auth-token']
    
    #return authorization error if invalid token
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

        #delete todo item
        todo_collection.delete_one({'todo_id': todo_id })

        todo_items = todo_collection.find({ 'user_id': user_id},{'_id':0})
        todo_item_list = list(todo_items)

        status_code = 200
        message = {
                'updated_todo_list' : todo_item_list,
                'message' : 'Todo Item deleted'
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
