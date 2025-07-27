
# 📡 API Documentation

## Base URL
```
https://7n3nk4d2d4.execute-api.ap-south-1.amazonaws.com/prod
```

## Authentication
Currently uses hardcoded userId. Future versions will implement proper authentication.

## Endpoints

### POST /workouts
Create a new workout record.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "yash1912",
  "date": "2024-01-15",
  "exercise": "Bench Press",
  "category": "Push",
  "sets": 3,
  "reps": [10, 10, 8],
  "weight": [100, 100, 105]
}
```

**Response (200 OK):**
```json
{
  "message": "Workout created successfully",
  "workoutId": "yash123_1751950900387"
}
```

### GET /workouts
Retrieve user workouts.

**Query Parameters:**
- `userId` (string, required): User identifier

**Example Request:**
```
GET /workouts?userId=yash123
```

**Response (200 OK):**
```json
{
  "workouts": [
    {
      "workoutId": "yash123_1751950900387",
      "userId": "yash123",
      "date": "2024-01-15",
      "exercise": "Bench Press",
      "category": "Push",
      "sets": 3,
      "reps": [10, 10, 8],
      "weight": [100, 100, 105],
      "createdAt": "2025-07-08T05:01:40.387Z"
    }
  ]
}
```

### DELETE /workouts/{workoutId}
Delete a specific workout.

**Path Parameters:**
- `workoutId` (string, required): Unique workout identifier

**Example Request:**
```
DELETE /workouts/yash123_1751950900387
```

**Response (200 OK):**
```json
{
  "message": "Workout deleted successfully"
}
```

## Error Responses

**400 Bad Request:**
```json
{
  "error": "Invalid request data"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error message"
}
```

## CORS Headers
All endpoints include CORS headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Headers: Content-Type`
- `Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS`