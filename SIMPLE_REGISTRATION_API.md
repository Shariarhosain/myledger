# Simple Registration API Documentation

## Overview
This is a simplified registration endpoint that allows users to register with just **username**, **email**, and **password**. No email verification required, no unique constraints on email, and no first/last name fields needed.

## Endpoint

### Register User (Simple)
**POST** `/api/auth/simple-register`

#### Request Body
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Response
**Success (201 Created)**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid-string",
      "username": "johndoe",
      "email": "john@example.com",
      "profilePic": null,
      "isVerified": false,
      "createdAt": "2025-10-30T03:31:20.000Z"
    },
    "token": "jwt-token-string"
  }
}
```

**Error (400 Bad Request)**
```json
{
  "success": false,
  "message": "Username, email, and password are required"
}
```

## Key Features

✅ **No Email Verification**: Users can register immediately without OTP verification
✅ **No Unique Constraints**: Multiple users can register with the same email
✅ **No First/Last Name Required**: Only username, email, and password needed
✅ **Automatic Token Generation**: JWT token is generated and returned upon successful registration
✅ **Cookie-based Authentication**: Token is also set as an HTTP-only cookie for 30 days

## Token Changes

### Updated Token Structure
The JWT token now includes additional information:
- `userId`: User's unique ID
- `email`: User's email address
- `username`: User's username
- `timestamp`: Token creation timestamp

### Token Expiration
- Changed from **7 days** to **30 days** for all authentication methods

## Database Schema Changes

### User Model
```prisma
model User {
  id          String      @id @default(uuid())
  username    String?     // NEW: Username field (optional)
  fname       String?     // UPDATED: Made optional
  lname       String?     // UPDATED: Made optional
  email       String      // UPDATED: Removed @unique constraint
  password    String?     // Nullable for Google OAuth users
  googleId    String?     @unique
  profilePic  String?
  isVerified  Boolean     @default(false)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  trades      Trade[]
  reflections Reflection[]
}
```

## Testing with cURL

```bash
curl -X POST http://localhost:5000/api/auth/simple-register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Testing with Postman

1. Create a new POST request
2. URL: `http://localhost:5000/api/auth/simple-register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

## Notes

- This endpoint is designed for quick registration without any validation or verification
- Multiple users can have the same email address
- Passwords are hashed using bcrypt before storage
- The returned token can be used for authenticated requests
- Token is valid for 30 days
