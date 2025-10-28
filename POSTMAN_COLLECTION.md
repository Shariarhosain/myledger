# 🔐 Postman API Collection - Google Authentication

## Base URL
```
{{base_url}} = http://localhost:5000
```

---

## 1️⃣ GOOGLE SIGN-UP (Register with Google)

**Method:** POST  
**Endpoint:** `{{base_url}}/api/auth/google-signup`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5MzQ5N2RkYWZkNTAyZjBjOGFiOGY2NTJiMWZhNmU0YmE0MTAzYjYiLCJ0eXAiOiJKV1QifQ..."
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Google sign-up successful",
  "data": {
    "user": {
      "id": "cm3a1b2c3d4e5f6g7h8i9j0k",
      "fname": "John",
      "lname": "Doe",
      "email": "john.doe@gmail.com",
      "googleId": "1234567890",
      "isVerified": true,
      "createdAt": "2025-10-28T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTNhMWIyYzNkNGU1ZjZnN2g4aTlqMGsiLCJpYXQiOjE2OTg1MDQwMDAsImV4cCI6MTY5OTEwODgwMH0.abc123def456",
    "isNewUser": true
  }
}
```

**Error Response (400) - User Already Exists:**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "User already exists with this email or Google account"
}
```

---

## 2️⃣ GOOGLE SIGN-IN (Login with Google)

**Method:** POST  
**Endpoint:** `{{base_url}}/api/auth/google-signin`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5MzQ5N2RkYWZkNTAyZjBjOGFiOGY2NTJiMWZhNmU0YmE0MTAzYjYiLCJ0eXAiOiJKV1QifQ..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Google sign-in successful",
  "data": {
    "user": {
      "id": "cm3a1b2c3d4e5f6g7h8i9j0k",
      "fname": "John",
      "lname": "Doe",
      "email": "john.doe@gmail.com",
      "googleId": "1234567890",
      "isVerified": true,
      "createdAt": "2025-10-28T10:30:00.000Z",
      "updatedAt": "2025-10-28T11:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbTNhMWIyYzNkNGU1ZjZnN2g4aTlqMGsiLCJpYXQiOjE2OTg1MDQwMDAsImV4cCI6MTY5OTEwODgwMH0.abc123def456",
    "isNewUser": false
  }
}
```

**Error Response (404) - User Not Found:**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found. Please sign up first."
}
```

---

## 3️⃣ GET USER PROFILE (Protected)

**Method:** GET  
**Endpoint:** `{{base_url}}/api/users/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "cm3a1b2c3d4e5f6g7h8i9j0k",
    "fname": "John",
    "lname": "Doe",
    "email": "john.doe@gmail.com",
    "isVerified": true,
    "createdAt": "2025-10-28T10:30:00.000Z"
  }
}
```

---

## 4️⃣ GET ALL USERS (Protected)

**Method:** GET  
**Endpoint:** `{{base_url}}/api/users?page=1&limit=10`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "cm3a1b2c3d4e5f6g7h8i9j0k",
        "fname": "John",
        "lname": "Doe",
        "email": "john.doe@gmail.com",
        "isVerified": true,
        "googleId": "1234567890",
        "createdAt": "2025-10-28T10:30:00.000Z",
        "updatedAt": "2025-10-28T11:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

## 5️⃣ UPDATE USER (Protected)

**Method:** PUT  
**Endpoint:** `{{base_url}}/api/users/cm3a1b2c3d4e5f6g7h8i9j0k`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "fname": "Jane",
  "lname": "Smith"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "cm3a1b2c3d4e5f6g7h8i9j0k",
    "fname": "Jane",
    "lname": "Smith",
    "email": "john.doe@gmail.com",
    "isVerified": true,
    "googleId": "1234567890",
    "createdAt": "2025-10-28T10:30:00.000Z",
    "updatedAt": "2025-10-28T11:30:00.000Z"
  }
}
```

---

## 🎯 How to Get Google ID Token

### Method 1: From Frontend (Easiest)
1. Open `http://localhost:5000/google-signup.html`
2. Open Browser DevTools (F12)
3. Go to Network tab
4. Click "Sign in with Google"
5. Find POST request to `/api/auth/google-signup`
6. Copy the `idToken` from Request Payload
7. Use it in Postman

### Method 2: From Browser Console
```javascript
// After clicking Google Sign-In button
// In the callback function, the token is available as:
response.credential
```

---

## 📝 Testing Workflow in Postman

### Step 1: Sign Up
```
POST {{base_url}}/api/auth/google-signup
Body: { "idToken": "your-google-id-token" }
```
✅ Copy the `token` from response

### Step 2: Access Profile
```
GET {{base_url}}/api/users/profile
Header: Authorization: Bearer your-jwt-token
```

### Step 3: List All Users
```
GET {{base_url}}/api/users
Header: Authorization: Bearer your-jwt-token
```

### Step 4: Update Profile
```
PUT {{base_url}}/api/users/your-user-id
Header: Authorization: Bearer your-jwt-token
Body: { "fname": "New Name" }
```

---

## 🔧 Postman Environment Setup

Create a new environment with these variables:

| Variable | Value |
|----------|-------|
| `base_url` | `http://localhost:5000` |
| `google_token` | (paste your Google ID token) |
| `jwt_token` | (will be set after login) |

Then you can use:
- `{{base_url}}/api/auth/google-signup`
- `Authorization: Bearer {{jwt_token}}`

---

## 💡 Pro Tips

1. **Token Expiration:** Google ID tokens expire quickly (~1 hour). Get a fresh one each time from the frontend.

2. **JWT Token:** Save the JWT token from sign-up/sign-in response and use it for protected routes.

3. **Testing Flow:**
   ```
   Google Sign-Up → Get JWT Token → Use Token for Protected Routes
   ```

4. **Quick Test:** Use the HTML pages (`/google-signup.html`) to easily get valid Google ID tokens.

---

## 🚨 Common Errors

### Error: "Invalid Google token"
- Token expired (get a new one)
- Wrong Google Client ID
- Token from different Google app

### Error: "User already exists"
- Email already registered
- Try sign-in instead of sign-up

### Error: "User not found"
- Account doesn't exist yet
- Try sign-up instead of sign-in

### Error: "Authentication required"
- Missing Authorization header
- Invalid/expired JWT token
- Token format: `Bearer your-token`

---

## ✅ Complete Example Flow

### 1. Sign Up with Google
```http
POST http://localhost:5000/api/auth/google-signup
Content-Type: application/json

{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI..."
}
```

**Response:** Copy the `token`

### 2. Get Your Profile
```http
GET http://localhost:5000/api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Update Your Profile
```http
PUT http://localhost:5000/api/users/cm3a1b2c3d4e5f6g7h8i9j0k
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "fname": "Updated Name"
}
```

---

## 🎊 You're All Set!

Use these endpoints to test your Google authentication system. The easiest way to get started is to use the frontend pages to authenticate, then copy the tokens for API testing! 🚀
