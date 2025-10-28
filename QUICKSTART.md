# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment Variables

The `.env` file is already configured with basic settings. You need to add:

1. **Google OAuth Credentials** (optional, if you want Google login):
   - Go to https://console.cloud.google.com/
   - Create OAuth 2.0 credentials
   - Add to `.env`:
     ```
     GOOGLE_CLIENT_ID=your-client-id
     GOOGLE_CLIENT_SECRET=your-client-secret
     ```

2. **Change JWT & Session Secrets** (for production):
   ```
   JWT_SECRET=your-secure-random-string
   SESSION_SECRET=your-secure-random-string
   ```

### Step 3: Database is Already Setup ✅

The database migrations have been applied. Your PostgreSQL database is ready!

### Step 4: Start the Server

```bash
npm run dev
```

Server will start on: http://localhost:5000

---

## 🧪 Test the API

### Option 1: Use the Thunder Client Collection

1. Install Thunder Client extension in VS Code
2. Import `thunder-collection.json`
3. Start testing!

### Option 2: Manual Testing

#### 1. Send OTP to Email
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Check your email for the OTP code.

#### 2. Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

#### 3. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fname":"John",
    "lname":"Doe",
    "email":"test@example.com",
    "password":"Pass123!"
  }'
```

Save the token from the response!

#### 4. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123!"}'
```

#### 5. Get Profile (Protected Route)
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Complete API Flow

### Registration Flow:
1. `POST /api/auth/send-otp` - Send OTP to email
2. Check email inbox for 6-digit code
3. `POST /api/auth/verify-otp` - Verify the OTP
4. `POST /api/auth/register` - Register with verified email

### Login Flow:
- **Email/Password:** `POST /api/auth/login`
- **Google OAuth:** Visit `http://localhost:5000/api/auth/google`

### User Management:
- `GET /api/users/profile` - Get your profile
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Or token will be automatically sent via HTTP-only cookies.

---

## 🎯 Features Implemented

✅ Email verification with OTP (10-minute expiry)  
✅ Email/Password registration & login  
✅ Google OAuth 2.0 login  
✅ Password hashing with bcrypt  
✅ JWT authentication  
✅ Forgot password  
✅ User CRUD operations  
✅ Protected routes  
✅ Email can be verified multiple times  
✅ Pagination for user lists  

---

## 📧 Email Configuration

Currently configured for Gmail SMTP. If emails are not sending:

1. **Enable 2FA** on your Gmail account
2. **Generate App Password**: https://myaccount.google.com/apppasswords
3. Update `EMAIL_PASS` in `.env` with the app password

For other email providers, update these in `.env`:
```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

---

## 🛠️ Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Run: `npx prisma migrate dev`

### Email Not Sending
- Check Gmail app password
- Verify `EMAIL_USER` and `EMAIL_PASS`
- Check spam folder

### Google OAuth Not Working
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check authorized redirect URI in Google Console
- Must match `GOOGLE_CALLBACK_URL` in `.env`

---

## 📚 Documentation

Full API documentation is available in `README.md`

---

## 💡 Tips

1. Use environment variables for all secrets
2. Change default JWT_SECRET in production
3. Enable HTTPS in production
4. Rate limit sensitive endpoints
5. Add input validation for all routes
6. Implement refresh tokens for better security

---

## 🤝 Need Help?

Check the full README.md for detailed documentation!
