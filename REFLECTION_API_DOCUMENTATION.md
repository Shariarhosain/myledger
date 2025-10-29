# Reflection API Documentation

This document describes the API endpoints for the Reflections feature in the MyLedger trading journal application.

## Base URL
```
/api/reflections
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Create a New Reflection
Create and save a new reflection entry.

**Endpoint:** `POST /api/reflections`

**Request Body:**
```json
{
  "date": "10/29/2025, 09:55:09 AM",
  "prompt": "Were you confident or doubtful when placing trades?",
  "group": "MINDSET & CONFIDENCE",
  "answer": "Today I felt very confident in my trading decisions..."
}
```

**Required Fields:**
- `date` (string): The date and time when the reflection was created
- `prompt` (string): The reflection prompt question
- `group` (string): The category/group name (e.g., "MINDSET & CONFIDENCE", "SELF AWARENESS & EMOTIONS", etc.)
- `answer` (string): The user's reflection answer

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Reflection created successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-uuid",
    "date": "10/29/2025, 09:55:09 AM",
    "prompt": "Were you confident or doubtful when placing trades?",
    "group": "MINDSET & CONFIDENCE",
    "answer": "Today I felt very confident in my trading decisions...",
    "createdAt": "2025-10-29T09:55:09.000Z",
    "updatedAt": "2025-10-29T09:55:09.000Z"
  }
}
```

---

### 2. Get All Reflections
Retrieve all reflections for the authenticated user with pagination.

**Endpoint:** `GET /api/reflections`

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Number of items per page (default: 100)

**Example:** `GET /api/reflections?page=1&limit=20`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "user-uuid",
      "date": "10/29/2025, 09:55:09 AM",
      "prompt": "Were you confident or doubtful when placing trades?",
      "group": "MINDSET & CONFIDENCE",
      "answer": "Today I felt very confident...",
      "createdAt": "2025-10-29T09:55:09.000Z",
      "updatedAt": "2025-10-29T09:55:09.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 15,
    "pages": 1
  }
}
```

---

### 3. Get Single Reflection
Retrieve a specific reflection by ID.

**Endpoint:** `GET /api/reflections/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-uuid",
    "date": "10/29/2025, 09:55:09 AM",
    "prompt": "Were you confident or doubtful when placing trades?",
    "group": "MINDSET & CONFIDENCE",
    "answer": "Today I felt very confident...",
    "createdAt": "2025-10-29T09:55:09.000Z",
    "updatedAt": "2025-10-29T09:55:09.000Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Reflection not found"
}
```

---

### 4. Update a Reflection
Update an existing reflection. Only the answer, prompt, and group fields can be updated.

**Endpoint:** `PUT /api/reflections/:id`

**Request Body:**
```json
{
  "answer": "Updated reflection answer..."
}
```

**Allowed Fields:**
- `answer` (string)
- `prompt` (string)
- `group` (string)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reflection updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-uuid",
    "date": "10/29/2025, 09:55:09 AM",
    "prompt": "Were you confident or doubtful when placing trades?",
    "group": "MINDSET & CONFIDENCE",
    "answer": "Updated reflection answer...",
    "createdAt": "2025-10-29T09:55:09.000Z",
    "updatedAt": "2025-10-29T10:30:00.000Z"
  }
}
```

---

### 5. Delete a Reflection
Delete a reflection by ID.

**Endpoint:** `DELETE /api/reflections/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reflection deleted successfully"
}
```

---

### 6. Get Reflection Statistics
Get statistics about the user's reflections.

**Endpoint:** `GET /api/reflections/stats`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 45,
    "groupCounts": {
      "MINDSET & CONFIDENCE": 12,
      "SELF AWARENESS & EMOTIONS": 15,
      "PERFORMANCE & IMPROVEMENT": 10,
      "STRATEGY & EXECUTION": 8
    },
    "recentCount": 12
  }
}
```

**Fields:**
- `total`: Total number of reflections
- `groupCounts`: Number of reflections per category
- `recentCount`: Number of reflections in the last 30 days

---

### 7. Get Rotation State
Get the current prompt rotation state for the user.

**Endpoint:** `GET /api/reflections/rotation-state`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "currentGroupIndex": 2,
    "promptIndexes": [3, 1, 2, 0]
  }
}
```

**Fields:**
- `currentGroupIndex` (number): Index of the current group (0-3)
- `promptIndexes` (array): Array of prompt indexes for each group

---

### 8. Update Rotation State
Update the prompt rotation state for the user.

**Endpoint:** `PUT /api/reflections/rotation-state`

**Request Body:**
```json
{
  "currentGroupIndex": 2,
  "promptIndexes": [3, 1, 2, 0]
}
```

**Required Fields:**
- `currentGroupIndex` (number): Index of the current group
- `promptIndexes` (array of numbers): Array of prompt indexes for each group

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Rotation state updated successfully",
  "data": {
    "currentGroupIndex": 2,
    "promptIndexes": [3, 1, 2, 0]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "date is required"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Reflection not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details..."
}
```

---

## Frontend Integration Example

### Fetch All Reflections
```javascript
const fetchReflections = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/reflections', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('Reflections:', data.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Create a New Reflection
```javascript
const createReflection = async (reflectionData) => {
  try {
    const response = await fetch('http://localhost:5000/api/reflections', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: new Date().toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        }),
        prompt: currentPrompt,
        group: currentGroup,
        answer: reflection
      })
    });
    
    const data = await response.json();
    if (data.success) {
      console.log('Reflection saved:', data.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Get/Update Rotation State
```javascript
// Get rotation state
const getRotationState = async () => {
  const response = await fetch('http://localhost:5000/api/reflections/rotation-state', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  const data = await response.json();
  return data.data;
};

// Update rotation state
const updateRotationState = async (rotationState) => {
  const response = await fetch('http://localhost:5000/api/reflections/rotation-state', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rotationState)
  });
  const data = await response.json();
  return data.data;
};
```

---

## Testing with Postman/Thunder Client

### Create Test Collection
1. Set base URL: `http://localhost:5000/api/reflections`
2. Add Authorization header with Bearer token
3. Test each endpoint with sample data

### Sample Test Data
```json
{
  "date": "10/29/2025, 09:55:09 AM",
  "prompt": "What was your best trade today? Why?",
  "group": "PERFORMANCE & IMPROVEMENT",
  "answer": "My best trade was shorting NQ at 15850 because I identified a clear resistance level and waited for confirmation before entering."
}
```
