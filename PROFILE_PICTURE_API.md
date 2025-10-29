# Profile Picture Upload API

## Overview
This feature allows users to upload and update their profile pictures. The images are stored on the server and accessed via a public URL.

## Configuration

### Environment Variables
Add this to your `.env` file:
```env
BASE_URL=https://backend-therellwalker.mtscorporate.com
```

## API Endpoint

### Update User Profile (with Profile Picture)

**Endpoint:** `PUT /api/users/:id`

**Authentication:** Required (Bearer Token)

**Content-Type:** `multipart/form-data`

**Parameters:**
- `:id` - User ID (must match authenticated user's ID)

**Form Fields:**
- `profilePic` (file, optional) - Image file (jpeg, jpg, png, gif, webp)
- `fname` (string, optional) - First name
- `lname` (string, optional) - Last name
- `email` (string, optional) - Email address
- `password` (string, optional) - New password

**File Restrictions:**
- Max file size: 5MB
- Allowed formats: JPEG, JPG, PNG, GIF, WEBP

## Usage Examples

### Using Postman

1. Set method to `PUT`
2. URL: `https://backend-therellwalker.mtscorporate.com/api/users/{userId}`
3. Headers:
   - `Authorization: Bearer {your-token}`
4. Body:
   - Select `form-data`
   - Add key `profilePic` with type `File`, select your image
   - Add other optional fields (fname, lname, etc.)

### Using cURL

```bash
curl -X PUT https://backend-therellwalker.mtscorporate.com/api/users/{userId} \
  -H "Authorization: Bearer {your-token}" \
  -F "profilePic=@/path/to/image.jpg" \
  -F "fname=John" \
  -F "lname=Doe"
```

### Using JavaScript (Fetch)

```javascript
const formData = new FormData();
formData.append('profilePic', fileInput.files[0]);
formData.append('fname', 'John');
formData.append('lname', 'Doe');

fetch(`https://backend-therellwalker.mtscorporate.com/api/users/${userId}`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### Using Axios

```javascript
const formData = new FormData();
formData.append('profilePic', file);
formData.append('fname', 'John');

axios.put(`https://backend-therellwalker.mtscorporate.com/api/users/${userId}`, formData, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "profilePic": "https://backend-therellwalker.mtscorporate.com/uploads/profiles/profile-uuid-1234567890.jpg",
    "isVerified": true,
    "createdAt": "2025-10-29T00:00:00.000Z",
    "updatedAt": "2025-10-29T00:00:00.000Z"
  }
}
```

### Error Responses

**Invalid File Type:**
```json
{
  "success": false,
  "message": "Only image files are allowed (jpeg, jpg, png, gif, webp)"
}
```

**File Too Large:**
```json
{
  "success": false,
  "message": "File too large"
}
```

**Unauthorized:**
```json
{
  "success": false,
  "message": "You can only update your own profile"
}
```

## Profile Picture URL Format

Uploaded profile pictures are accessible via:
```
https://backend-therellwalker.mtscorporate.com/uploads/profiles/{filename}
```

Example:
```
https://backend-therellwalker.mtscorporate.com/uploads/profiles/profile-123e4567-1698765432-987654321.jpg
```

## Google OAuth Integration

When users sign up or sign in with Google, their Google profile picture is automatically saved to the `profilePic` field.

## Storage

- Profile pictures are stored in: `uploads/profiles/`
- Filename format: `profile-{userId}-{timestamp}-{random}.{ext}`
- This ensures unique filenames and prevents overwriting

## Notes

- Users can only update their own profile pictures
- Old profile pictures are not automatically deleted when a new one is uploaded
- The `profilePic` field can also be updated with an external URL (without file upload)
