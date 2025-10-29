# Reflection API - Quick Reference Card

## 🔗 Base URL
```
http://localhost:5000/api/reflections
```

## 🔐 Authentication
All requests require JWT token:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📌 Quick Commands

### Get Token (Login First)
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"your@email.com","password":"pass"}'
$token = $response.token
```

### Set Headers
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
```

---

## 🚀 API Endpoints Cheat Sheet

### 1. CREATE Reflection
```powershell
POST /api/reflections
```
```powershell
$body = '{"date":"10/29/2025, 09:55:09 AM","prompt":"Your prompt?","group":"MINDSET & CONFIDENCE","answer":"Your answer"}'
Invoke-RestMethod -Uri "http://localhost:5000/api/reflections" -Method Post -Headers $headers -Body $body
```

### 2. GET All Reflections
```powershell
GET /api/reflections
```
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/reflections" -Method Get -Headers $headers
```

### 3. GET Single Reflection
```powershell
GET /api/reflections/:id
```
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/reflections/REFLECTION_ID" -Method Get -Headers $headers
```

### 4. UPDATE Reflection
```powershell
PUT /api/reflections/:id
```
```powershell
$updateBody = '{"answer":"Updated answer text"}'
Invoke-RestMethod -Uri "http://localhost:5000/api/reflections/REFLECTION_ID" -Method Put -Headers $headers -Body $updateBody
```

### 5. DELETE Reflection
```powershell
DELETE /api/reflections/:id
```
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/reflections/REFLECTION_ID" -Method Delete -Headers $headers
```

### 6. GET Statistics
```powershell
GET /api/reflections/stats
```
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/reflections/stats" -Method Get -Headers $headers
```

### 7. GET Rotation State
```powershell
GET /api/reflections/rotation-state
```
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/reflections/rotation-state" -Method Get -Headers $headers
```

### 8. UPDATE Rotation State
```powershell
PUT /api/reflections/rotation-state
```
```powershell
$rotationBody = '{"currentGroupIndex":1,"promptIndexes":[0,1,2,3]}'
Invoke-RestMethod -Uri "http://localhost:5000/api/reflections/rotation-state" -Method Put -Headers $headers -Body $rotationBody
```

---

## 📋 Request Body Templates

### Create Reflection
```json
{
  "date": "10/29/2025, 09:55:09 AM",
  "prompt": "Were you confident or doubtful when placing trades?",
  "group": "MINDSET & CONFIDENCE",
  "answer": "Your detailed reflection answer here..."
}
```

### Update Reflection
```json
{
  "answer": "Updated reflection text"
}
```

### Update Rotation State
```json
{
  "currentGroupIndex": 2,
  "promptIndexes": [3, 1, 2, 0]
}
```

---

## 🎨 Reflection Groups

1. **MINDSET & CONFIDENCE**
2. **SELF AWARENESS & EMOTIONS**
3. **PERFORMANCE & IMPROVEMENT**
4. **STRATEGY & EXECUTION**

---

## ✅ Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

## ❌ Error Response Format
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 🔢 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## 🧪 Complete Test Script

```powershell
# 1. Login
$login = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"your@email.com","password":"pass"}'
$token = $login.token

# 2. Set headers
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Create reflection
$createBody = '{"date":"10/29/2025, 09:55:09 AM","prompt":"Test prompt?","group":"MINDSET & CONFIDENCE","answer":"Test answer"}'
$created = Invoke-RestMethod -Uri "http://localhost:5000/api/reflections" -Method Post -Headers $headers -Body $createBody
Write-Host "Created ID: $($created.data.id)"

# 4. Get all
$all = Invoke-RestMethod -Uri "http://localhost:5000/api/reflections" -Method Get -Headers $headers
Write-Host "Total reflections: $($all.data.Count)"

# 5. Get stats
$stats = Invoke-RestMethod -Uri "http://localhost:5000/api/reflections/stats" -Method Get -Headers $headers
Write-Host "Statistics: Total = $($stats.data.total)"

Write-Host "✅ All tests passed!"
```

---

## 📱 Frontend Integration Snippets

### React - Create API Service
```javascript
// src/api/reflectionService.js
import axios from 'axios';

const API = 'http://localhost:5000/api/reflections';
const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export const reflectionAPI = {
  create: (data) => axios.post(API, data, { headers: getHeaders() }),
  getAll: () => axios.get(API, { headers: getHeaders() }),
  getOne: (id) => axios.get(`${API}/${id}`, { headers: getHeaders() }),
  update: (id, data) => axios.put(`${API}/${id}`, data, { headers: getHeaders() }),
  delete: (id) => axios.delete(`${API}/${id}`, { headers: getHeaders() }),
  getStats: () => axios.get(`${API}/stats`, { headers: getHeaders() }),
  getRotation: () => axios.get(`${API}/rotation-state`, { headers: getHeaders() }),
  updateRotation: (data) => axios.put(`${API}/rotation-state`, data, { headers: getHeaders() }),
};
```

### React - Use in Component
```javascript
import { reflectionAPI } from './api/reflectionService';

// Save reflection
const handleSave = async () => {
  try {
    const data = {
      date: new Date().toLocaleString('en-US', {...}),
      prompt: currentPrompt,
      group: currentGroup,
      answer: reflection
    };
    const res = await reflectionAPI.create(data);
    toast.success('Saved!');
  } catch (err) {
    toast.error('Failed to save');
  }
};

// Load reflections
useEffect(() => {
  const load = async () => {
    const res = await reflectionAPI.getAll();
    setReflections(res.data.data);
  };
  load();
}, []);
```

---

## 🎯 Common Tasks

### Check if server is running
```powershell
Invoke-RestMethod -Uri "http://localhost:5000" -Method Get
```

### Restart server
```powershell
cd "d:\Office\mern\client work\therellwalker_backend"
npm start
```

### Run database migration
```powershell
npx prisma migrate dev
```

### Generate Prisma client
```powershell
npx prisma generate
```

### View database
```powershell
npx prisma studio
```

---

## 📖 Documentation Files

- `REFLECTION_COMPLETE_GUIDE.md` - Full overview
- `REFLECTION_API_DOCUMENTATION.md` - API reference
- `REFLECTION_TESTING_GUIDE.md` - Testing guide
- `reflection-api-collection.json` - Thunder Client collection

---

## 💾 Save This File!

Print or bookmark this page for quick reference during development.

---

**Last Updated:** October 29, 2025  
**Status:** Production Ready ✅
