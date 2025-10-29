# Reflection Feature - Backend Implementation Summary

## ✅ Implementation Complete

The complete CRUD operations for the Reflections feature have been successfully implemented in your backend.

---

## 📁 Files Created/Modified

### New Files Created:
1. **`src/Services/reflectionService.js`** - Business logic for reflection operations
2. **`src/Controllers/reflectionController.js`** - HTTP request handlers
3. **`src/Routes/reflectionRoutes.js`** - API route definitions
4. **`REFLECTION_API_DOCUMENTATION.md`** - Complete API documentation
5. **`reflection-api-collection.json`** - Thunder Client/Postman collection for testing

### Modified Files:
1. **`prisma/schema.prisma`** - Added Reflection and RotationState models
2. **`src/app.js`** - Registered reflection routes
3. **Database Migration** - Created migration file: `20251029040920_add_reflection_models`

---

## 🗄️ Database Schema

### Reflection Model
```prisma
model Reflection {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  date      String   // Date in string format
  prompt    String   // The reflection prompt question
  group     String   // Category/group name
  answer    String   @db.Text // User's reflection answer
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
  @@map("reflections")
}
```

### RotationState Model
```prisma
model RotationState {
  id                  String   @id @default(uuid())
  userId              String   @unique
  currentGroupIndex   Int      @default(0)
  promptIndexes       Int[]    // Array of prompt indexes for each group
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@map("rotation_states")
}
```

---

## 🔌 API Endpoints

All endpoints are prefixed with `/api/reflections` and require authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a new reflection |
| GET | `/` | Get all reflections (paginated) |
| GET | `/:id` | Get a single reflection by ID |
| PUT | `/:id` | Update a reflection |
| DELETE | `/:id` | Delete a reflection |
| GET | `/stats` | Get reflection statistics |
| GET | `/rotation-state` | Get prompt rotation state |
| PUT | `/rotation-state` | Update rotation state |

---

## 🎯 Features Implemented

### 1. **CRUD Operations**
- ✅ Create new reflections
- ✅ Read reflections (all or by ID)
- ✅ Update existing reflections
- ✅ Delete reflections
- ✅ Pagination support

### 2. **Rotation State Management**
- ✅ Store and retrieve prompt rotation state
- ✅ Track current group index
- ✅ Track prompt indexes for each group
- ✅ Automatic default state creation

### 3. **Statistics**
- ✅ Total reflection count
- ✅ Reflections grouped by category
- ✅ Recent activity (last 30 days)

### 4. **Security**
- ✅ JWT authentication required
- ✅ User can only access their own reflections
- ✅ Cascade delete on user deletion
- ✅ Input validation

---

## 🧪 Testing

### Using Thunder Client/Postman:
1. Import `reflection-api-collection.json`
2. Set environment variables:
   - `base_url`: `http://localhost:5000`
   - `auth_token`: Your JWT token
3. Test each endpoint

### Manual Testing Example:
```bash
# 1. Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# 2. Create a reflection
curl -X POST http://localhost:5000/api/reflections \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "10/29/2025, 09:55:09 AM",
    "prompt": "Were you confident or doubtful when placing trades?",
    "group": "MINDSET & CONFIDENCE",
    "answer": "I felt confident today..."
  }'

# 3. Get all reflections
curl -X GET http://localhost:5000/api/reflections \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔗 Frontend Integration

### Step 1: Create API Service File
Create `src/api/reflectionService.js` in your frontend:

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reflectionService = {
  // Create a new reflection
  createReflection: async (reflectionData) => {
    const response = await apiClient.post('/reflections', reflectionData);
    return response.data;
  },

  // Get all reflections
  getAllReflections: async (page = 1, limit = 100) => {
    const response = await apiClient.get(`/reflections?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get single reflection
  getReflectionById: async (id) => {
    const response = await apiClient.get(`/reflections/${id}`);
    return response.data;
  },

  // Update reflection
  updateReflection: async (id, updateData) => {
    const response = await apiClient.put(`/reflections/${id}`, updateData);
    return response.data;
  },

  // Delete reflection
  deleteReflection: async (id) => {
    const response = await apiClient.delete(`/reflections/${id}`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await apiClient.get('/reflections/stats');
    return response.data;
  },

  // Get rotation state
  getRotationState: async () => {
    const response = await apiClient.get('/reflections/rotation-state');
    return response.data;
  },

  // Update rotation state
  updateRotationState: async (rotationData) => {
    const response = await apiClient.put('/reflections/rotation-state', rotationData);
    return response.data;
  },
};
```

### Step 2: Update Reflections Component
Modify your `Reflections.jsx` to use the API:

```javascript
import React, { useState, useEffect } from 'react';
import { reflectionService } from '../../api/reflectionService';
import { toast } from 'react-hot-toast'; // or your preferred toast library

const Reflections = () => {
  const [reflection, setReflection] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentGroup, setCurrentGroup] = useState('');
  const [pastReflections, setPastReflections] = useState([]);
  const [rotationState, setRotationState] = useState({
    currentGroupIndex: 0,
    promptIndexes: [0, 0, 0, 0],
  });
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState(null);

  // Load reflections and rotation state from API on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load reflections
      const reflectionsResponse = await reflectionService.getAllReflections();
      setPastReflections(reflectionsResponse.data);

      // Load rotation state
      const rotationResponse = await reflectionService.getRotationState();
      setRotationState(rotationResponse.data);
      
      // Also sync to localStorage as backup
      localStorage.setItem('ledger_reflections', JSON.stringify(reflectionsResponse.data));
      localStorage.setItem('ledger_prompt_rotation', JSON.stringify(rotationResponse.data));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load reflections');
      
      // Fallback to localStorage if API fails
      const savedReflections = localStorage.getItem('ledger_reflections');
      const savedRotation = localStorage.getItem('ledger_prompt_rotation');
      
      if (savedReflections) setPastReflections(JSON.parse(savedReflections));
      if (savedRotation) setRotationState(JSON.parse(savedRotation));
    } finally {
      setLoading(false);
    }
  };

  // Get current prompt based on rotation state
  useEffect(() => {
    const groupIndex = rotationState.currentGroupIndex;
    const groupName = groupNames[groupIndex];
    const promptIndex = rotationState.promptIndexes[groupIndex];
    const prompt = reflectionPrompts[groupName][promptIndex];

    setCurrentPrompt(prompt);
    setCurrentGroup(groupName);
  }, [rotationState]);

  const handleRefreshPrompt = async () => {
    const nextGroupIndex = (rotationState.currentGroupIndex + 1) % groupNames.length;
    
    const newRotationState = {
      ...rotationState,
      currentGroupIndex: nextGroupIndex,
    };

    try {
      await reflectionService.updateRotationState(newRotationState);
      setRotationState(newRotationState);
      localStorage.setItem('ledger_prompt_rotation', JSON.stringify(newRotationState));
    } catch (error) {
      console.error('Error updating rotation state:', error);
      toast.error('Failed to refresh prompt');
    }
  };

  const handleSaveReflection = async () => {
    if (!reflection.trim()) {
      return;
    }

    setLoading(true);

    const reflectionData = {
      date: new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
      prompt: currentPrompt,
      group: currentGroup,
      answer: reflection,
    };

    try {
      // Save to backend
      const response = await reflectionService.createReflection(reflectionData);
      
      // Update local state
      setPastReflections([response.data, ...pastReflections]);
      
      // Update rotation state
      const currentGroupIndex = rotationState.currentGroupIndex;
      const currentPromptIndex = rotationState.promptIndexes[currentGroupIndex];
      const totalPromptsInGroup = reflectionPrompts[groupNames[currentGroupIndex]].length;
      const nextPromptIndex = (currentPromptIndex + 1) % totalPromptsInGroup;
      
      const newPromptIndexes = [...rotationState.promptIndexes];
      newPromptIndexes[currentGroupIndex] = nextPromptIndex;
      
      const nextGroupIndex = (currentGroupIndex + 1) % groupNames.length;
      
      const newRotationState = {
        currentGroupIndex: nextGroupIndex,
        promptIndexes: newPromptIndexes,
      };

      await reflectionService.updateRotationState(newRotationState);
      setRotationState(newRotationState);
      
      // Update localStorage as backup
      localStorage.setItem('ledger_reflections', JSON.stringify([response.data, ...pastReflections]));
      localStorage.setItem('ledger_prompt_rotation', JSON.stringify(newRotationState));
      
      // Clear input
      setReflection('');
      toast.success('Reflection saved successfully!');
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast.error('Failed to save reflection');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReflection = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reflection?')) {
      return;
    }

    try {
      await reflectionService.deleteReflection(id);
      setPastReflections(pastReflections.filter((r) => r.id !== id));
      toast.success('Reflection deleted');
    } catch (error) {
      console.error('Error deleting reflection:', error);
      toast.error('Failed to delete reflection');
    }
  };

  // Rest of your component code...
  
  return (
    // Your JSX with loading states
    <div>
      {loading && <LoadingSpinner />}
      {/* Rest of your component */}
    </div>
  );
};

export default Reflections;
```

---

## 🚀 Next Steps

### 1. **Start the Server**
```bash
cd "d:\Office\mern\client work\therellwalker_backend"
npm start
```

### 2. **Test the Endpoints**
- Use Thunder Client or Postman
- Import the collection: `reflection-api-collection.json`
- Test all CRUD operations

### 3. **Frontend Integration**
- Create `src/api/reflectionService.js` in your React app
- Update your `Reflections.jsx` component
- Add loading states and error handling
- Add toast notifications for user feedback

### 4. **Optional Enhancements**
- [ ] Add search functionality
- [ ] Add filtering by group/date
- [ ] Add export to PDF/CSV
- [ ] Add reflection streaks/analytics
- [ ] Add reminders/notifications

---

## 📝 Notes

- All reflections are user-specific (isolated by JWT userId)
- Rotation state is automatically created if it doesn't exist
- LocalStorage serves as a backup/cache mechanism
- Database includes cascade delete on user deletion
- All endpoints include proper error handling and validation

---

## 🐛 Troubleshooting

### Common Issues:

1. **"Reflection not found"**
   - Ensure you're using the correct reflection ID
   - Verify user owns the reflection

2. **"Unauthorized"**
   - Check JWT token is valid
   - Ensure token is included in Authorization header

3. **Migration errors**
   - Run: `npx prisma migrate dev`
   - Generate client: `npx prisma generate`

---

## 📞 Support

For any issues or questions, refer to:
- `REFLECTION_API_DOCUMENTATION.md` - Complete API reference
- `reflection-api-collection.json` - Testing collection
- Backend logs for detailed error messages

---

**Implementation Date:** October 29, 2025  
**Status:** ✅ Complete and Ready for Testing
