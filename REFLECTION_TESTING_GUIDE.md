# Reflection API Testing Guide

## Quick Start Testing

### Prerequisites
1. ✅ Server is running on `http://localhost:5000`
2. ✅ Database migration completed
3. ✅ User account created and verified
4. ✅ JWT token obtained from login

---

## Step-by-Step Testing

### Step 1: Login to Get Token
```bash
# Windows PowerShell
$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"your-email@example.com","password":"your-password"}'
$token = $loginResponse.token
Write-Host "Token: $token"
```

### Step 2: Test Create Reflection
```bash
# Windows PowerShell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    date = "10/29/2025, 09:55:09 AM"
    prompt = "Were you confident or doubtful when placing trades?"
    group = "MINDSET & CONFIDENCE"
    answer = "Today I felt very confident in my trading decisions. I followed my plan and waited for proper setups."
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/reflections" -Method Post -Headers $headers -Body $body
$response | ConvertTo-Json
```

### Step 3: Test Get All Reflections
```bash
# Windows PowerShell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/reflections" -Method Get -Headers $headers
$response | ConvertTo-Json
```

### Step 4: Test Get Rotation State
```bash
# Windows PowerShell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/reflections/rotation-state" -Method Get -Headers $headers
$response | ConvertTo-Json
```

### Step 5: Test Update Rotation State
```bash
# Windows PowerShell
$rotationBody = @{
    currentGroupIndex = 1
    promptIndexes = @(1, 0, 2, 3)
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/reflections/rotation-state" -Method Put -Headers $headers -Body $rotationBody
$response | ConvertTo-Json
```

### Step 6: Test Get Statistics
```bash
# Windows PowerShell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/reflections/stats" -Method Get -Headers $headers
$response | ConvertTo-Json
```

---

## Using Thunder Client in VS Code

### 1. Install Thunder Client Extension
- Open VS Code
- Go to Extensions (Ctrl+Shift+X)
- Search for "Thunder Client"
- Install it

### 2. Import Collection
- Click Thunder Client icon in sidebar
- Click "Collections"
- Click "Import" (menu icon with three dots)
- Select `reflection-api-collection.json`

### 3. Set Environment Variables
- Click "Env" tab
- Select "Development"
- Update variables:
  - `base_url`: `http://localhost:5000`
  - `auth_token`: Paste your JWT token
  - `reflection_id`: Will be filled after creating a reflection

### 4. Run Tests
- Click on each request
- Click "Send"
- Verify responses

---

## Sample Test Data

### Different Reflection Groups

#### 1. MINDSET & CONFIDENCE
```json
{
  "date": "10/29/2025, 10:00:00 AM",
  "prompt": "Were you confident or doubtful when placing trades?",
  "group": "MINDSET & CONFIDENCE",
  "answer": "I was confident because I had done my analysis and waited for confirmation."
}
```

#### 2. SELF AWARENESS & EMOTIONS
```json
{
  "date": "10/29/2025, 10:05:00 AM",
  "prompt": "What emotions did you feel most while trading today?",
  "group": "SELF AWARENESS & EMOTIONS",
  "answer": "I felt calm and focused, especially after my morning meditation routine."
}
```

#### 3. PERFORMANCE & IMPROVEMENT
```json
{
  "date": "10/29/2025, 10:10:00 AM",
  "prompt": "What was your best trade today? Why?",
  "group": "PERFORMANCE & IMPROVEMENT",
  "answer": "My best trade was shorting NQ at resistance. I identified the level early and executed perfectly."
}
```

#### 4. STRATEGY & EXECUTION
```json
{
  "date": "10/29/2025, 10:15:00 AM",
  "prompt": "Did you follow your trading plan today?",
  "group": "STRATEGY & EXECUTION",
  "answer": "Yes, I followed my plan completely. I only took setups that matched my criteria."
}
```

---

## Expected Responses

### Success Response (201 Created)
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
    "answer": "Today I felt very confident...",
    "createdAt": "2025-10-29T09:55:09.000Z",
    "updatedAt": "2025-10-29T09:55:09.000Z"
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "answer is required"
}
```

---

## Verification Checklist

- [ ] User can create reflections
- [ ] User can view all their reflections
- [ ] User can view a single reflection
- [ ] User can update a reflection
- [ ] User can delete a reflection
- [ ] User can get statistics
- [ ] User can get rotation state
- [ ] User can update rotation state
- [ ] Pagination works correctly
- [ ] User can only access their own reflections
- [ ] Invalid tokens are rejected
- [ ] Required field validation works

---

## Database Verification

### Check if tables were created:
```sql
-- Connect to your PostgreSQL database
SELECT * FROM reflections;
SELECT * FROM rotation_states;
```

### Verify data:
```sql
-- Count total reflections
SELECT COUNT(*) FROM reflections;

-- Get reflections by user
SELECT * FROM reflections WHERE "userId" = 'your-user-id';

-- Check rotation states
SELECT * FROM rotation_states;
```

---

## Troubleshooting

### Issue: "Table does not exist"
**Solution:** Run the migration
```bash
npx prisma migrate dev
npx prisma generate
```

### Issue: "Unauthorized"
**Solution:** 
1. Check if token is valid
2. Verify token format: `Bearer YOUR_TOKEN`
3. Login again to get fresh token

### Issue: "Reflection not found"
**Solution:**
1. Verify the reflection ID
2. Check if the reflection belongs to the logged-in user
3. Ensure the reflection wasn't deleted

### Issue: Server not responding
**Solution:**
```bash
# Restart the server
npm start
# Or
node src/app.js
```

---

## Complete Testing Script (PowerShell)

Save this as `test-reflections.ps1`:

```powershell
# Configuration
$baseUrl = "http://localhost:5000/api"
$email = "your-email@example.com"
$password = "your-password"

Write-Host "🧪 Starting Reflection API Tests..." -ForegroundColor Cyan

# 1. Login
Write-Host "`n1️⃣ Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginBody
    $token = $loginResponse.token
    Write-Host "✅ Login successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
    exit
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. Create Reflection
Write-Host "`n2️⃣ Creating reflection..." -ForegroundColor Yellow
$reflectionBody = @{
    date = "10/29/2025, 09:55:09 AM"
    prompt = "Test prompt"
    group = "MINDSET & CONFIDENCE"
    answer = "Test answer"
} | ConvertTo-Json

try {
    $createResponse = Invoke-RestMethod -Uri "$baseUrl/reflections" -Method Post -Headers $headers -Body $reflectionBody
    $reflectionId = $createResponse.data.id
    Write-Host "✅ Reflection created! ID: $reflectionId" -ForegroundColor Green
} catch {
    Write-Host "❌ Create failed: $_" -ForegroundColor Red
}

# 3. Get All Reflections
Write-Host "`n3️⃣ Getting all reflections..." -ForegroundColor Yellow
try {
    $allReflections = Invoke-RestMethod -Uri "$baseUrl/reflections" -Method Get -Headers $headers
    Write-Host "✅ Retrieved $($allReflections.data.Count) reflections" -ForegroundColor Green
} catch {
    Write-Host "❌ Get all failed: $_" -ForegroundColor Red
}

# 4. Get Statistics
Write-Host "`n4️⃣ Getting statistics..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/reflections/stats" -Method Get -Headers $headers
    Write-Host "✅ Statistics: Total = $($stats.data.total)" -ForegroundColor Green
} catch {
    Write-Host "❌ Get stats failed: $_" -ForegroundColor Red
}

# 5. Get Rotation State
Write-Host "`n5️⃣ Getting rotation state..." -ForegroundColor Yellow
try {
    $rotationState = Invoke-RestMethod -Uri "$baseUrl/reflections/rotation-state" -Method Get -Headers $headers
    Write-Host "✅ Rotation state retrieved!" -ForegroundColor Green
} catch {
    Write-Host "❌ Get rotation state failed: $_" -ForegroundColor Red
}

Write-Host "`n✨ All tests completed!" -ForegroundColor Cyan
```

Run it with:
```bash
.\test-reflections.ps1
```

---

## Next Steps

1. ✅ Test all endpoints using Thunder Client
2. ✅ Verify data in database
3. ✅ Integrate with frontend
4. ✅ Add error handling in frontend
5. ✅ Deploy to production

---

**Happy Testing! 🚀**
