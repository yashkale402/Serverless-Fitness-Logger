import json
import boto3
import time
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('FitnessWorkouts')

def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
    
    # Handle OPTIONS request for CORS
    http_method = event.get('httpMethod') or event.get('requestContext', {}).get('httpMethod')
    if http_method == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers}
    
    try:
        # Debug logging
        print("Full event:", json.dumps(event, default=str))
        
        # Handle different body formats
        if event.get('body'):
            if isinstance(event['body'], str):
                body = json.loads(event['body'])
            else:
                body = event['body']
        else:
            # Fallback for test events
            body = event
        
        print("Parsed body:", json.dumps(body, default=str))
        
        # Validate required fields
        required_fields = ['userId', 'date', 'exercise', 'category', 'sets', 'reps', 'weight']
        for field in required_fields:
            if field not in body:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': f'Missing required field: {field}'})
                }
        
        workout_id = f"{body['userId']}_{int(time.time() * 1000)}"
        
        item = {
            'workoutId': workout_id,
            'userId': body['userId'],
            'date': body['date'],
            'exercise': body['exercise'],
            'category': body['category'],
            'sets': body['sets'],
            'reps': body['reps'],
            'weight': [Decimal(str(w)) for w in body['weight']],
            'createdAt': str(int(time.time()))
        }
        
        print("Item to save:", json.dumps(item, default=str))
        
        table.put_item(Item=item)
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Workout created successfully',
                'workoutId': workout_id
            })
        }
    except KeyError as e:
        print(f"KeyError: {str(e)}")
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': f'Missing field: {str(e)}'})
        }
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {str(e)}")
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'error': 'Invalid JSON format'})
        }
    except Exception as e:
        print(f"General error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }