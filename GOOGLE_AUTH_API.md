# 🔐 Google Authentication API Documentation

## Base URL
```
http://localhost:5000
```

---

## 📌 New Google Authentication Endpoints

### 1️⃣ Google Sign-Up (Register)

**Endpoint:** `POST /api/auth/google-signup`

**Description:** Register a new user with Google ID token. Creates user in database.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5M..."
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
      "fname": "Shariar",
      "lname": "Hosain",
      "email": "shariarhosain1315@gmail.com",
      "googleId": "1234567890",
      "isVerified": true,
      "createdAt": "2025-10-28T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isNewUser": true
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "User already exists with this email or Google account"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid Google token"
}
```

---

### 2️⃣ Google Sign-In (Login)

**Endpoint:** `POST /api/auth/google-signin`

**Description:** Sign in existing user with Google ID token. Returns user data and JWT token.

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjU5M..."
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
      "fname": "Shariar",
      "lname": "Hosain",
      "email": "shariarhosain1315@gmail.com",
      "googleId": "1234567890",
      "isVerified": true,
      "createdAt": "2025-10-28T10:30:00.000Z",
      "updatedAt": "2025-10-28T11:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isNewUser": false
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "statusCode": 404,
  "message": "User not found. Please sign up first."
}
```

**Error Response (401):**
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid Google token"
}
```

---

## 🌐 Frontend Pages

### Landing Page
**URL:** `http://localhost:5000/`
- Main landing page with navigation to Sign Up and Sign In

### Sign Up Page
**URL:** `http://localhost:5000/google-signup.html`
- Google Sign-Up with One Tap
- Auto-redirects to dashboard on success
- Shows error if account already exists

### Sign In Page
**URL:** `http://localhost:5000/google-signin.html`
- Google Sign-In with One Tap
- Auto-redirects to dashboard on success
- Shows error if account not found

### Dashboard
**URL:** `http://localhost:5000/dashboard.html`
- User profile display
- JWT token display
- Logout functionality
- Protected page (requires authentication)

---

## 🔄 Authentication Flow

### Sign-Up Flow:
```
1. User clicks "Sign in with Google" button on /google-signup.html
2. Google OAuth popup appears
3. User selects Google account
4. Google returns ID Token to frontend
5. Frontend sends POST request to /api/auth/google-signup with idToken
6. Backend verifies token with Google
7. Backend checks if user exists
   - If exists: Return error "User already exists"
   - If not exists: Create user in database
8. Backend generates JWT token
9. Backend returns user data + JWT token
10. Frontend saves token to localStorage
11. Frontend redirects to dashboard
```

### Sign-In Flow:
```
1. User clicks "Sign in with Google" button on /google-signin.html
2. Google OAuth popup appears
3. User selects Google account
4. Google returns ID Token to frontend
5. Frontend sends POST request to /api/auth/google-signin with idToken
6. Backend verifies token with Google
7. Backend searches for user in database
   - If not found: Return error "User not found"
   - If found: Proceed to login
8. Backend generates JWT token
9. Backend returns user data + JWT token
10. Frontend saves token to localStorage
11. Frontend redirects to dashboard
```

---

## 📝 How to Get Google ID Token

### Frontend (JavaScript):
```javascript
// Google Sign-In button callback
function handleGoogleResponse(response) {
  const idToken = response.credential;
  
  // Send to backend
  fetch('http://localhost:5000/api/auth/google-signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ idToken })
  })
  .then(res => res.json())
  .then(data => {
    console.log('Success:', data);
    // Save token
    localStorage.setItem('authToken', data.data.token);
  });
}
```

### HTML Setup:
```html
<script src="https://accounts.google.com/gsi/client" async defer></script>

<div id="g_id_onload"
     data-client_id="823212933581-1t0g20kji86ra7rdapcbp51emd6n2lik.apps.googleusercontent.com"
     data-callback="handleGoogleResponse">
</div>

<div class="g_id_signin" 
     data-type="standard"
     data-size="large">
</div>
```

---

## 🔑 Using JWT Token

Once you have the JWT token, include it in protected API requests:

### Example: Get User Profile
```javascript
fetch('http://localhost:5000/api/users/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 🧪 Testing with Postman

### Test Sign-Up:
1. **Get Google ID Token:**
   - Open `http://localhost:5000/google-signup.html`
   - Open browser DevTools (F12) → Network tab
   - Click "Sign in with Google"
   - Find the POST request to `/api/auth/google-signup`
   - Copy the `idToken` from request body

2. **Test in Postman:**
   ```
   POST http://localhost:5000/api/auth/google-signup
   Headers: Content-Type: application/json
   Body: {
     "idToken": "paste-your-token-here"
   }
   ```

### Test Sign-In:
```
POST http://localhost:5000/api/auth/google-signin
Headers: Content-Type: application/json
Body: {
  "idToken": "paste-your-token-here"
}
```

---

## ⚙️ Environment Variables

Required in `.env`:
```env
GOOGLE_CLIENT_ID=823212933581-1t0g20kji86ra7rdapcbp51emd6n2lik.apps.googleusercontent.com
JWT_SECRET=your-jwt-secret
```

---

## 🚀 Key Differences from Old OAuth Flow

| Feature | Old (Passport.js) | New (Direct Token) |
|---------|-------------------|-------------------|
| **Method** | GET redirect | POST with token |
| **Callback** | Server-side redirect | No callback needed |
| **Frontend** | Full page redirect | Popup/AJAX |
| **User Control** | Less | More |
| **Speed** | Slower | Faster |
| **Complexity** | More complex | Simpler |

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success (Sign-In) |
| 201 | Created (Sign-Up) |
| 400 | Bad Request (User exists, missing token) |
| 401 | Unauthorized (Invalid token) |
| 404 | Not Found (User doesn't exist) |
| 500 | Server Error |

---

## 🔒 Security Features

✅ Google OAuth 2.0 token verification  
✅ JWT tokens with 7-day expiration  
✅ HTTP-only cookies  
✅ CORS protection  
✅ Email verification from Google  
✅ Secure password storage (for email/password users)  

---

## 💡 Tips

1. **Token Expiration:** Google ID tokens are short-lived (~1 hour). Always get a fresh token from Google Sign-In.

2. **Testing:** Use the provided HTML pages for easiest testing. They handle Google OAuth flow automatically.

3. **Production:** Update `GOOGLE_CLIENT_ID` and configure authorized domains in Google Cloud Console.

4. **Debugging:** Check browser console and Network tab for detailed error messages.

---

## 📱 Example API Call with cURL

### Sign-Up:
```bash
curl -X POST http://localhost:5000/api/auth/google-signup \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_GOOGLE_ID_TOKEN"}'
```

### Sign-In:
```bash
curl -X POST http://localhost:5000/api/auth/google-signin \
  -H "Content-Type: application/json" \
  -d '{"idToken":"YOUR_GOOGLE_ID_TOKEN"}'
```

### Get Profile (with JWT):
```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🎯 Summary

- **Sign-Up:** Creates new user → Returns JWT token
- **Sign-In:** Finds existing user → Returns JWT token
- **No callbacks:** Direct token-based authentication
- **Simple:** One API call per action
- **Secure:** Google verifies identity, we verify token
