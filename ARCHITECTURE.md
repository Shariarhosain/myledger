# 🏗️ System Architecture Overview

## 📊 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Public Folder)                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  index.html  │  │ signup.html  │  │ signin.html  │              │
│  │  (Landing)   │  │ (Register)   │  │   (Login)    │              │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘              │
│         │                  │                  │                       │
│         └──────────────────┴──────────────────┘                      │
│                            │                                          │
│                    Google Sign-In Button                             │
│                    (Gets ID Token)                                   │
│                            │                                          │
└────────────────────────────┼──────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      GOOGLE OAUTH 2.0                                │
├─────────────────────────────────────────────────────────────────────┤
│  • User authenticates with Google                                    │
│  • Google verifies identity                                          │
│  • Returns ID Token (JWT) to frontend                                │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND API (Express.js)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  POST /api/auth/google-signup                                        │
│  ├─ Receives: { idToken }                                           │
│  ├─ Verifies token with Google                                       │
│  ├─ Checks if user exists                                            │
│  ├─ Creates new user in DB                                           │
│  ├─ Generates JWT token                                              │
│  └─ Returns: { user, token, isNewUser }                             │
│                                                                       │
│  POST /api/auth/google-signin                                        │
│  ├─ Receives: { idToken }                                           │
│  ├─ Verifies token with Google                                       │
│  ├─ Finds user in DB                                                 │
│  ├─ Generates JWT token                                              │
│  └─ Returns: { user, token, isNewUser }                             │
│                                                                       │
│  GET /api/users/profile (Protected)                                  │
│  ├─ Requires: Authorization: Bearer {jwt}                            │
│  ├─ Verifies JWT token                                               │
│  ├─ Fetches user from DB                                             │
│  └─ Returns: { user }                                                │
│                                                                       │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────┐                        │
│  │              users                      │                        │
│  ├─────────────────────────────────────────┤                        │
│  │  id         VARCHAR (UUID)              │                        │
│  │  fname      VARCHAR                     │                        │
│  │  lname      VARCHAR                     │                        │
│  │  email      VARCHAR (UNIQUE)            │                        │
│  │  password   VARCHAR (NULLABLE)          │                        │
│  │  googleId   VARCHAR (NULLABLE, UNIQUE)  │  ← For Google Auth    │
│  │  isVerified BOOLEAN                     │                        │
│  │  createdAt  TIMESTAMP                   │                        │
│  │  updatedAt  TIMESTAMP                   │                        │
│  └─────────────────────────────────────────┘                        │
│                                                                       │
│  ┌─────────────────────────────────────────┐                        │
│  │        email_verifications              │                        │
│  ├─────────────────────────────────────────┤                        │
│  │  id         VARCHAR (UUID)              │                        │
│  │  email      VARCHAR                     │                        │
│  │  otp        VARCHAR                     │                        │
│  │  verified   BOOLEAN                     │                        │
│  │  expiresAt  TIMESTAMP                   │                        │
│  │  createdAt  TIMESTAMP                   │                        │
│  └─────────────────────────────────────────┘                        │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

### 📝 Sign-Up Flow

```
1. USER
   └─> Clicks "Sign in with Google" on /google-signup.html

2. GOOGLE
   └─> Shows account selection popup
   └─> User selects account
   └─> Google verifies user identity
   └─> Returns ID Token (JWT) to frontend

3. FRONTEND
   └─> Receives ID Token from Google
   └─> Sends POST to /api/auth/google-signup
       Body: { idToken: "eyJhbGc..." }

4. BACKEND
   └─> Verifies ID Token with Google API
   └─> Extracts user info (email, name, googleId)
   └─> Checks database for existing user
   └─> IF user exists:
       └─> Return error "User already exists"
   └─> ELSE:
       └─> Create new user in database
       └─> Generate JWT token (expires in 7 days)
       └─> Return { user, token, isNewUser: true }

5. FRONTEND
   └─> Saves token to localStorage
   └─> Redirects to /dashboard.html

6. DASHBOARD
   └─> Reads token from localStorage
   └─> Displays user profile
   └─> Token used for all future API calls
```

### 🔐 Sign-In Flow

```
1. USER
   └─> Clicks "Sign in with Google" on /google-signin.html

2. GOOGLE
   └─> Shows account selection popup
   └─> User selects account
   └─> Returns ID Token to frontend

3. FRONTEND
   └─> Receives ID Token
   └─> Sends POST to /api/auth/google-signin
       Body: { idToken: "eyJhbGc..." }

4. BACKEND
   └─> Verifies ID Token with Google API
   └─> Searches database for user (by email or googleId)
   └─> IF user not found:
       └─> Return error "User not found. Please sign up first."
   └─> ELSE:
       └─> Generate JWT token
       └─> Return { user, token, isNewUser: false }

5. FRONTEND
   └─> Saves token to localStorage
   └─> Redirects to /dashboard.html
```

---

## 🗂️ Technology Stack

```
┌─────────────────────────────────────────────┐
│              FRONTEND LAYER                  │
├─────────────────────────────────────────────┤
│  • HTML5                                     │
│  • Tailwind CSS                              │
│  • Vanilla JavaScript                        │
│  • Google Sign-In Library                    │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│              BACKEND LAYER                   │
├─────────────────────────────────────────────┤
│  • Node.js v20+                              │
│  • Express.js v5                             │
│  • google-auth-library                       │
│  • jsonwebtoken                              │
│  • bcryptjs                                  │
│  • nodemailer                                │
└─────────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────────┐
│              DATABASE LAYER                  │
├─────────────────────────────────────────────┤
│  • PostgreSQL                                │
│  • Prisma ORM                                │
└─────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
therellwalker_backend/
│
├── public/                    ← FRONTEND FILES
│   ├── index.html            ← Landing page
│   ├── google-signup.html    ← Sign up page
│   ├── google-signin.html    ← Sign in page
│   └── dashboard.html        ← Protected dashboard
│
├── src/
│   ├── Controllers/          ← REQUEST HANDLERS
│   │   ├── authController.js    ◄─ NEW METHODS ADDED
│   │   └── userController.js
│   │
│   ├── Services/             ← BUSINESS LOGIC
│   │   ├── authService.js       ◄─ NEW METHODS ADDED
│   │   └── userService.js
│   │
│   ├── Middlewares/          ← AUTH & VALIDATION
│   │   ├── jwt.js
│   │   └── verify.js
│   │
│   ├── Routes/               ← API ENDPOINTS
│   │   ├── authRoutes.js        ◄─ NEW ROUTES ADDED
│   │   └── userRoutes.js
│   │
│   ├── config/               ← CONFIGURATION
│   │   └── passport.js
│   │
│   ├── utils/                ← HELPER FUNCTIONS
│   │   ├── email.js
│   │   └── error.js
│   │
│   └── app.js                ← MAIN APPLICATION
│
├── prisma/
│   ├── schema.prisma         ← DATABASE SCHEMA
│   └── migrations/           ← DB MIGRATIONS
│
├── .env                      ← ENVIRONMENT VARIABLES
├── package.json              ← DEPENDENCIES
│
└── Documentation/
    ├── README.md             ← Full API docs
    ├── GOOGLE_AUTH_API.md    ← Google auth details
    ├── POSTMAN_COLLECTION.md ← API testing guide
    ├── SETUP_COMPLETE.md     ← Setup summary
    └── ARCHITECTURE.md       ← This file
```

---

## 🔐 Security Features

```
┌──────────────────────────────────────────────┐
│          SECURITY LAYERS                      │
├──────────────────────────────────────────────┤
│                                               │
│  1. GOOGLE OAUTH 2.0                         │
│     └─ User identity verified by Google      │
│     └─ No passwords stored for Google users  │
│                                               │
│  2. TOKEN VERIFICATION                        │
│     └─ Backend verifies Google ID token      │
│     └─ Prevents token forgery                │
│                                               │
│  3. JWT AUTHENTICATION                        │
│     └─ Stateless authentication              │
│     └─ 7-day expiration                       │
│     └─ Signed with secret key                │
│                                               │
│  4. BCRYPT PASSWORD HASHING                   │
│     └─ 10 rounds of salting                  │
│     └─ For email/password users              │
│                                               │
│  5. HTTP-ONLY COOKIES                         │
│     └─ XSS protection                        │
│     └─ Automatic token inclusion             │
│                                               │
│  6. CORS PROTECTION                           │
│     └─ Restricts API access                  │
│     └─ Configured origins only               │
│                                               │
│  7. INPUT VALIDATION                          │
│     └─ Email format validation               │
│     └─ Required field checks                 │
│                                               │
│  8. DATABASE CONSTRAINTS                      │
│     └─ Unique email addresses                │
│     └─ Unique Google IDs                     │
│                                               │
└──────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### Token Generation & Usage

```
┌─────────────┐
│   Google    │
│  ID Token   │  (Short-lived, ~1 hour)
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Backend Verifies with Google   │
│  • Extracts user info           │
│  • Validates signature          │
│  • Checks expiration            │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Create/Find User in Database   │
│  • Check if user exists         │
│  • Create or update record      │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────┐
│  Generate   │
│  JWT Token  │  (Long-lived, 7 days)
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Return to Frontend             │
│  { user, token, isNewUser }     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Store in localStorage          │
│  • authToken                    │
│  • user object                  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Use for Protected API Calls    │
│  Authorization: Bearer {token}  │
└─────────────────────────────────┘
```

---

## 🎯 API Endpoint Matrix

| Endpoint | Method | Auth Required | Purpose |
|----------|--------|---------------|---------|
| `/` | GET | ❌ | Landing page |
| `/google-signup.html` | GET | ❌ | Sign up page |
| `/google-signin.html` | GET | ❌ | Sign in page |
| `/dashboard.html` | GET | ✅* | Dashboard |
| `/api/auth/send-otp` | POST | ❌ | Email verification |
| `/api/auth/verify-otp` | POST | ❌ | Verify OTP |
| `/api/auth/register` | POST | ❌ | Email/password signup |
| `/api/auth/login` | POST | ❌ | Email/password login |
| **`/api/auth/google-signup`** | **POST** | ❌ | **Google signup** |
| **`/api/auth/google-signin`** | **POST** | ❌ | **Google signin** |
| `/api/auth/forgot-password` | POST | ❌ | Reset password |
| `/api/auth/logout` | POST | ❌ | Logout |
| `/api/users/profile` | GET | ✅ | Get current user |
| `/api/users` | GET | ✅ | List all users |
| `/api/users/:id` | GET | ✅ | Get user by ID |
| `/api/users/:id` | PUT | ✅ | Update user |
| `/api/users/:id` | DELETE | ✅ | Delete user |

*Dashboard requires token in localStorage (client-side check)

---

## 🚀 Deployment Checklist

### Before Production:

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Change `SESSION_SECRET` to strong random string
- [ ] Update `GOOGLE_CLIENT_ID` for production domain
- [ ] Configure Google authorized origins
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Update CORS origins
- [ ] Set up proper database backups
- [ ] Configure rate limiting
- [ ] Add request logging
- [ ] Set up error monitoring
- [ ] Update frontend URLs
- [ ] Test all endpoints
- [ ] Review security headers

---

## 📈 Performance Considerations

- **JWT Tokens:** Stateless, no database lookups
- **Google Verification:** Cached for performance
- **Database:** Indexed on email and googleId
- **Static Files:** Served directly by Express
- **Connection Pooling:** Prisma handles automatically

---

## 🎊 Summary

This architecture provides:

✅ **Simple**: Direct token-based authentication  
✅ **Secure**: Multiple layers of security  
✅ **Scalable**: Stateless JWT tokens  
✅ **Modern**: Latest OAuth 2.0 standards  
✅ **Flexible**: Supports both Google and email/password auth  
✅ **User-Friendly**: Beautiful Tailwind UI  
✅ **Developer-Friendly**: Clear separation of concerns  

---

**Built with ❤️ using Node.js, Express, Prisma, PostgreSQL, and Google OAuth 2.0**
