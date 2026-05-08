⚠️ Note: Due to regional ISP restrictions on the TMDB API, live data may not load in some locations. 
A demo video is provided to showcase full functionality.

# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

---

## Authentication Endpoints

### 1. Sign Up (Register New User)

**Endpoint:** `POST /api/auth/signup`

**Description:** Register a new user account

**Authentication:** Not required (Public)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // Optional
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Authentication:** Not required (Public)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Bookmark Endpoints

All bookmark endpoints require authentication.

### 3. Create Bookmark

**Endpoint:** `POST /api/bookmarks`

**Description:** Create a new bookmark for a movie or TV show

**Authentication:** Required

**Request Body:**
```json
{
  "contentId": 123,
  "contentType": "movie", // "movie" or "tv"
  "title": "The Matrix",
  "posterPath": "/path/to/poster.jpg", // Optional
  "releaseDate": "1999-03-31", // Optional
  "notes": "Great movie!", // Optional
  "watchStatus": "planned" // "planned", "watching", or "completed" (default: "planned")
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Bookmark created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "contentId": 123,
    "contentType": "movie",
    "title": "The Matrix",
    "posterPath": "/path/to/poster.jpg",
    "releaseDate": "1999-03-31",
    "notes": "Great movie!",
    "watchStatus": "planned",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "This item is already bookmarked"
}
```

---

### 4. Get All Bookmarks

**Endpoint:** `GET /api/bookmarks`

**Description:** Get all bookmarks for the authenticated user

**Authentication:** Required

**Query Parameters (Optional):**
- `contentType`: Filter by content type ("movie" or "tv")
- `watchStatus`: Filter by watch status ("planned", "watching", or "completed")

**Example:**
```
GET /api/bookmarks?contentType=movie&watchStatus=completed
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Bookmarks retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "user": "507f1f77bcf86cd799439011",
      "contentId": 123,
      "contentType": "movie",
      "title": "The Matrix",
      "posterPath": "/path/to/poster.jpg",
      "releaseDate": "1999-03-31",
      "notes": "Great movie!",
      "watchStatus": "completed",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 5. Delete Bookmark

**Endpoint:** `DELETE /api/bookmarks/:id`

**Description:** Delete a bookmark by ID

**Authentication:** Required

**URL Parameters:**
- `id`: Bookmark ID

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Bookmark deleted successfully",
  "data": {}
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Bookmark not found or you do not have permission to delete it"
}
```

---

### 6. Update Bookmark

**Endpoint:** `PUT /api/bookmarks/:id`

**Description:** Update bookmark notes and/or watch status

**Authentication:** Required

**URL Parameters:**
- `id`: Bookmark ID

**Request Body:**
```json
{
  "notes": "Updated notes", // Optional
  "watchStatus": "watching" // Optional: "planned", "watching", or "completed"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Bookmark updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "user": "507f1f77bcf86cd799439011",
    "contentId": 123,
    "contentType": "movie",
    "title": "The Matrix",
    "notes": "Updated notes",
    "watchStatus": "watching",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Bookmark not found or you do not have permission to update it"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common Status Codes:
- `400` - Bad Request (validation errors, duplicate entries)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Health Check

**Endpoint:** `GET /api/health`

**Description:** Check if server is running

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```



