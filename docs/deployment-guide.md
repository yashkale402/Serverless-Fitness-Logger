
# 🚀 Deployment Guide

## Prerequisites
- AWS Account (Free Tier)
- Basic knowledge of AWS services

## Step 1: Create DynamoDB Table
1. Go to AWS Console → DynamoDB
2. Click "Create Table"
3. Table name: `FitnessWorkouts`
4. Partition key: `workoutId` (String)
5. Click "Create Table"

## Step 2: Create Lambda Functions
Create 3 Lambda functions with Python 3.12 runtime:

### CreateWorkout Function
- Function name: `CreateWorkout`
- Runtime: Python 3.12
- Code: Use `/backend/lambda-functions/CreateWorkout/lambda_function.py`
- Permissions: Attach DynamoDBFullAccess policy

### GetWorkouts Function
- Function name: `GetWorkouts`
- Runtime: Python 3.12
- Code: Use `/backend/lambda-functions/GetWorkouts/lambda_function.py`
- Permissions: Attach DynamoDBFullAccess policy

### DeleteWorkout Function
- Function name: `DeleteWorkout`
- Runtime: Python 3.12
- Code: Use `/backend/lambda-functions/DeleteWorkout/lambda_function.py`
- Permissions: Attach DynamoDBFullAccess policy

## Step 3: Create API Gateway
1. Create REST API named `FitnessAPI`
2. Create `/workouts` resource
3. Add POST, GET methods to `/workouts`
4. Create `/{workoutId}` resource under `/workouts`
5. Add DELETE method to `/{workoutId}`
6. Enable CORS on all methods
7. Enable Lambda Proxy Integration
8. Deploy to `prod` stage

## Step 4: Deploy Frontend
1. Create S3 bucket for static website hosting
2. Upload all files from `/frontend/` folder
3. Enable static website hosting
4. Update `aws-config.js` with your API Gateway URL 
5. Make bucket public for website access

## Step 5: Test Application
1. Access S3 website URL
2. Test workout logging functionality
3. Verify data in DynamoDB
4. Test history and progress pages

## 🔧 Configuration
Update `frontend/aws-config.js` with your API Gateway URL:
```javascript
const AWS_CONFIG = {
    API_BASE_URL: 'https://YOUR-API-ID.execute-api.REGION.amazonaws.com/prod',
    USER_ID: 'your-user-id'
};
```

## 💰 Cost Optimization
- Use DynamoDB On-Demand pricing
- All services stay within free tier for personal use
- Monitor usage in AWS Cost Explorer