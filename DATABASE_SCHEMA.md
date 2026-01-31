# Database Schema Documentation

This document describes the MongoDB database schema used in the Entertainment Web App.

---

## Collections

The application uses two main collections:
1. **users** - Stores user account information
2. **bookmarks** - Stores bookmarked movies and TV shows

---

## User Collection

**Collection Name:** `users`

**Schema:**
```javascript
{
  email: String (required, unique, lowercase, validated),
  password: String (required, minlength: 6, hashed),
  name: String (optional, trimmed),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Fields Description:

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `email` | String | Yes | Yes | User's email address (used for login) |
| `password` | String | Yes | No | Hashed password using bcrypt (10 rounds) |
| `name` | String | No | No | User's display name (optional) |
| `createdAt` | Date | Auto | No | Timestamp when user was created |
| `updatedAt` | Date | Auto | No | Timestamp when user was last updated |

### Indexes:
- `email` - Unique index for fast lookups and duplicate prevention

### Example Document:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "user@example.com",
  "password": "$2a$10$hashedpassword...",
  "name": "John Doe",
  "createdAt": ISODate("2024-01-15T10:00:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:00:00.000Z")
}
```

### Security Features:
- Password is hashed using bcrypt before saving
- Password hashing uses 10 salt rounds
- Password is never returned in API responses

---

## Bookmark Collection

**Collection Name:** `bookmarks`

**Schema:**
```javascript
{
  user: ObjectId (required, references User),
  contentId: Number (required, TMDB ID),
  contentType: String (required, enum: ["movie", "tv"]),
  title: String (required, trimmed),
  posterPath: String (optional),
  releaseDate: String (optional),
  notes: String (optional, maxlength: 500),
  watchStatus: String (optional, enum: ["planned", "watching", "completed"], default: "planned"),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Fields Description:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user` | ObjectId | Yes | Reference to User who created the bookmark |
| `contentId` | Number | Yes | TMDB API content ID (movie or TV show ID) |
| `contentType` | String | Yes | Type of content: "movie" or "tv" |
| `title` | String | Yes | Title of the movie or TV show |
| `posterPath` | String | No | Poster image path from TMDB API |
| `releaseDate` | String | No | Release date (movies) or first air date (TV shows) |
| `notes` | String | No | User's personal notes (max 500 characters) |
| `watchStatus` | String | No | Watch status: "planned", "watching", or "completed" (default: "planned") |
| `createdAt` | Date | Auto | Timestamp when bookmark was created |
| `updatedAt` | Date | Auto | Timestamp when bookmark was last updated |

### Indexes:
- Compound unique index on `(user, contentId, contentType)` - Prevents duplicate bookmarks for the same user and content

### Example Document:
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "user": ObjectId("507f1f77bcf86cd799439011"),
  "contentId": 603,
  "contentType": "movie",
  "title": "The Matrix",
  "posterPath": "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  "releaseDate": "1999-03-31",
  "notes": "Great sci-fi movie with mind-bending concepts!",
  "watchStatus": "completed",
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T11:00:00.000Z")
}
```

### Constraints:
- One user cannot bookmark the same content (same contentId + contentType) twice
- Watch status must be one of: "planned", "watching", or "completed"
- Content type must be either "movie" or "tv"
- Notes are limited to 500 characters

---

## Relationships

### User to Bookmarks (One-to-Many)
- One user can have many bookmarks
- Each bookmark belongs to exactly one user
- Bookmark deletion cascades (user deletion would need manual bookmark cleanup)

---

## Data Validation

### User Model:
- Email must be a valid email format (regex validation)
- Email is automatically converted to lowercase
- Password must be at least 6 characters long
- Password is automatically hashed before saving

### Bookmark Model:
- Content type must be either "movie" or "tv"
- Watch status must be one of: "planned", "watching", "completed"
- Notes cannot exceed 500 characters
- Unique constraint prevents duplicate bookmarks per user

---

## Database Connection

- **Database Name:** `entertainment-app` (default, configurable via MONGODB_URI)
- **Connection:** MongoDB connection string format: `mongodb://localhost:27017/entertainment-app`
- **ORM:** Mongoose (MongoDB object modeling for Node.js)

---

## Migration Notes

This schema is designed to be flexible and can be extended in the future:
- Additional user fields (avatar, preferences, etc.)
- Additional bookmark fields (rating, tags, etc.)
- Additional collections (reviews, watchlists, etc.)



