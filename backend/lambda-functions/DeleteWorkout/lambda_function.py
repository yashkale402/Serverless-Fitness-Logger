import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('FitnessWorkouts')

def lambda_handler(event, context):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS'
    }
    
    if event['httpMethod'] == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers}
    
    try:
        workout_id = event['pathParameters']['workoutId']
        
        table.delete_item(
            Key={'workoutId': workout_id}
        )
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Workout deleted successfully'
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }