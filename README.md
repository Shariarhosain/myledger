# Therellwalker Backend API

A complete authentication system with email verification, Google OAuth 2.0, and user management.

## Features

✅ Email & Password Authentication  
✅ Google OAuth 2.0 Login  
✅ Email Verification with OTP  
✅ Password Hashing with bcrypt  
✅ JWT Token Authentication  
✅ Forgot Password  
✅ User CRUD Operations  
✅ Trade Management System  
✅ **Reflections & Journaling** ⭐ NEW  
✅ Protected Routes  

## Tech Stack

- **Node.js** & **Express.js**
- **PostgreSQL** with **Prisma ORM**
- **JWT** for authentication
- **Passport.js** for Google OAuth 2.0
- **Nodemailer** for email sending
- **bcryptjs** for password hashing

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update the `.env` file with your credentials:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# Server
PORT=5000
NODE_ENV=development

# JWT & Session Secrets
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret

# Email (Gmail)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="465"
EMAIL_SECURE="true"
EMAIL_USER=your-email@gmail.com
EMAIL_PASS="your-app-password"

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Setup Google OAuth 2.0

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret to `.env`

### 4. Setup Gmail App Password

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate a new app password
4. Use this password in `EMAIL_PASS` in `.env`

### 5. Run Database Migrations

```bash
npx prisma generate
npx prisma migrate dev
```

### 6. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

Server will run on: `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

---

## Authentication Routes

### 1. Send Email Verification OTP

**Endpoint:** `POST /auth/send-otp`

**Description:** Sends a 6-digit OTP to the user's email for verification. OTP expires in 10 minutes.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to email successfully"
}
```

---

### 2. Verify Email OTP

**Endpoint:** `POST /auth/verify-otp`

**Description:** Verifies the OTP sent to the email. Email can be verified multiple times.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### 3. Register with Email & Password

**Endpoint:** `POST /auth/register`

**Description:** Registers a new user. Email must be verified first before registration.

**Request Body:**
```json
{
  "fname": "John",
  "lname": "Doe",
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "fname": "John",
      "lname": "Doe",
      "email": "user@example.com",
      "isVerified": true,
      "createdAt": "2024-10-28T10:30:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

---

### 4. Login with Email & Password

**Endpoint:** `POST /auth/login`

**Description:** Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "fname": "John",
      "lname": "Doe",
      "email": "user@example.com",
      "isVerified": true,
      "createdAt": "2024-10-28T10:30:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

---

### 5. Login with Google OAuth 2.0

**Endpoint:** `GET /auth/google`

**Description:** Initiates Google OAuth 2.0 login flow. Redirects to Google login page.

**Usage:**
```javascript
// Frontend: Redirect user to this URL
window.location.href = 'http://localhost:5000/api/auth/google';
```

**Callback:** `GET /auth/google/callback`

After successful authentication, redirects to:
```
http://localhost:3000/auth/success?token=jwt-token
```

---

### 6. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Description:** Updates password for a user if email exists.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

### 7. Logout

**Endpoint:** `POST /auth/logout`

**Description:** Clears authentication cookie.

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User Routes (Protected)

All user routes require authentication. Include JWT token in header:
```
Authorization: Bearer your-jwt-token
```

### 1. Get Current User Profile

**Endpoint:** `GET /users/profile`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fname": "John",
    "lname": "Doe",
    "email": "user@example.com",
    "isVerified": true,
    "createdAt": "2024-10-28T10:30:00.000Z"
  }
}
```

---

### 2. Get All Users (with Pagination)

**Endpoint:** `GET /users?page=1&limit=10`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "fname": "John",
        "lname": "Doe",
        "email": "user@example.com",
        "isVerified": true,
        "createdAt": "2024-10-28T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

### 3. Get User by ID

**Endpoint:** `GET /users/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "fname": "John",
    "lname": "Doe",
    "email": "user@example.com",
    "isVerified": true,
    "createdAt": "2024-10-28T10:30:00.000Z"
  }
}
```

---

### 4. Update User

**Endpoint:** `PUT /users/:id`

**Description:** Users can only update their own profile.

**Request Body:**
```json
{
  "fname": "Jane",
  "lname": "Smith",
  "email": "newemail@example.com",
  "password": "NewPassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "fname": "Jane",
    "lname": "Smith",
    "email": "newemail@example.com",
    "isVerified": true,
    "updatedAt": "2024-10-28T11:00:00.000Z"
  }
}
```

---

### 5. Delete User

**Endpoint:** `DELETE /users/:id`

**Description:** Users can only delete their own profile.

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Authentication Flow

### Email & Password Registration

1. **Send OTP** → `POST /auth/send-otp`
2. **Verify OTP** → `POST /auth/verify-otp`
3. **Register** → `POST /auth/register`
4. **Login** → `POST /auth/login`

### Google OAuth Registration/Login

1. Redirect to → `GET /auth/google`
2. User logs in with Google
3. Callback handles authentication
4. Redirect to frontend with token

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message here"
}
```

**Common Status Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Database Schema

### User Model
```prisma
model User {
  id         String   @id @default(uuid())
  fname      String
  lname      String
  email      String   @unique
  password   String?  // Nullable for Google OAuth users
  googleId   String?  @unique
  isVerified Boolean  @default(false)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

### EmailVerification Model
```prisma
model EmailVerification {
  id        String   @id @default(uuid())
  email     String
  otp       String
  verified  Boolean  @default(false)
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

---

## Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with 7-day expiration
- ✅ HTTP-only cookies for token storage
- ✅ Email verification required before registration
- ✅ OTP expires in 10 minutes
- ✅ Protected routes with authentication middleware
- ✅ Users can only modify their own data

---

## Testing with Postman/Thunder Client

### 1. Import Environment Variables
Create a new environment with:
```
baseUrl: http://localhost:5000/api
token: (will be set after login)
```

### 2. Test Flow

1. **Send OTP:**
   ```
   POST {{baseUrl}}/auth/send-otp
   Body: {"email": "test@example.com"}
   ```

2. **Verify OTP:**
   ```
   POST {{baseUrl}}/auth/verify-otp
   Body: {"email": "test@example.com", "otp": "123456"}
   ```

3. **Register:**
   ```
   POST {{baseUrl}}/auth/register
   Body: {
     "fname": "John",
     "lname": "Doe",
     "email": "test@example.com",
     "password": "Pass123!"
   }
   ```

4. **Login:**
   ```
   POST {{baseUrl}}/auth/login
   Body: {"email": "test@example.com", "password": "Pass123!"}
   ```
   Save the token from response.

5. **Get Profile (Protected):**
   ```
   GET {{baseUrl}}/users/profile
   Headers: Authorization: Bearer {{token}}
   ```

---

## Reflection Routes (Protected) ⭐ NEW

All reflection routes require authentication. Include JWT token in header:
```
Authorization: Bearer your-jwt-token
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reflections` | Create new reflection |
| GET | `/api/reflections` | Get all reflections |
| GET | `/api/reflections/:id` | Get single reflection |
| PUT | `/api/reflections/:id` | Update reflection |
| DELETE | `/api/reflections/:id` | Delete reflection |
| GET | `/api/reflections/stats` | Get statistics |
| GET | `/api/reflections/rotation-state` | Get rotation state |
| PUT | `/api/reflections/rotation-state` | Update rotation state |

### Example: Create Reflection

**Request:**
```json
POST /api/reflections
{
  "date": "10/29/2025, 09:55:09 AM",
  "prompt": "Were you confident or doubtful when placing trades?",
  "group": "MINDSET & CONFIDENCE",
  "answer": "Today I felt very confident in my trading decisions..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reflection created successfully",
  "data": {
    "id": "uuid",
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

📚 **Full Documentation:** See [`REFLECTION_API_DOCUMENTATION.md`](./REFLECTION_API_DOCUMENTATION.md) for complete API reference.

---

## Project Structure

```
therellwalker_backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   └── passport.js        # Google OAuth configuration
│   ├── Controllers/
│   │   ├── authController.js     # Auth endpoints
│   │   ├── userController.js     # User CRUD endpoints
│   │   ├── tradeController.js    # Trade endpoints
│   │   └── reflectionController.js  # Reflection endpoints ⭐
│   ├── Middlewares/
│   │   ├── jwt.js            # JWT utilities
│   │   └── verify.js         # Auth middleware
│   ├── Routes/
│   │   ├── authRoutes.js     # Auth routes
│   │   ├── userRoutes.js     # User routes
│   │   ├── tradeRoutes.js    # Trade routes
│   │   └── reflectionRoutes.js  # Reflection routes ⭐
│   ├── Services/
│   │   ├── authService.js       # Auth business logic
│   │   ├── userService.js       # User business logic
│   │   ├── tradeService.js      # Trade business logic
│   │   └── reflectionService.js # Reflection business logic ⭐
│   ├── utils/
│   │   ├── email.js          # Email utilities
│   │   └── error.js          # Error handling
│   └── app.js                # Main application file
├── REFLECTION_API_DOCUMENTATION.md    # Reflection API docs ⭐
├── REFLECTION_COMPLETE_GUIDE.md       # Complete guide ⭐
├── REFLECTION_TESTING_GUIDE.md        # Testing guide ⭐
├── reflection-api-collection.json     # Thunder Client collection ⭐
├── .env                      # Environment variables
└── package.json              # Dependencies
```

---

## License

MIT

---

## Support

For issues and questions, please open an issue on GitHub.
