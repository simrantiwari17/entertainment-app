# Entertainment Web App

A complete, production-ready MERN stack Entertainment Web App that helps users discover movies and TV series and reduce decision fatigue by allowing them to search, browse, and bookmark content.

## 🎯 Features

- **Browse Content:** View trending movies and TV shows from TMDB API
- **Search:** Search for movies and TV shows
- **Bookmarks:** Save your favorite content with personal notes
- **Watch Status:** Track your watch status (Planned, Watching, Completed)
- **Authentication:** Secure user authentication with JWT
- **Personalized Experience:** Each user has their own bookmarks and preferences

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### External APIs
- **TMDB API** - The Movie Database API for movie/TV show data

---

## 📂 Project Structure

```
entertainment-app/
 ├── backend/
 │   ├── src/
 │   │   ├── config/
 │   │   │   └── database.js          # MongoDB connection
 │   │   ├── controllers/
 │   │   │   ├── authController.js    # Authentication logic
 │   │   │   └── bookmarkController.js # Bookmark CRUD operations
 │   │   ├── middleware/
 │   │   │   ├── auth.js              # JWT authentication middleware
 │   │   │   └── errorHandler.js      # Error handling middleware
 │   │   ├── models/
 │   │   │   ├── User.js              # User model
 │   │   │   └── Bookmark.js          # Bookmark model
 │   │   ├── routes/
 │   │   │   ├── authRoutes.js        # Authentication routes
 │   │   │   └── bookmarkRoutes.js    # Bookmark routes
 │   │   └── server.js                # Express server entry point
 │   ├── .env.example                 # Environment variables example
 │   └── package.json                 # Backend dependencies
 │
 ├── frontend/
 │   ├── src/
 │   │   ├── components/
 │   │   │   ├── Navbar.jsx           # Navigation bar
 │   │   │   ├── ContentCard.jsx      # Movie/TV show card
 │   │   │   └── ProtectedRoute.jsx   # Route protection
 │   │   ├── pages/
 │   │   │   ├── Home.jsx             # Home page (trending)
 │   │   │   ├── Movies.jsx           # Movies listing
 │   │   │   ├── TVSeries.jsx         # TV shows listing
 │   │   │   ├── Search.jsx           # Search page
 │   │   │   ├── Details.jsx          # Movie/TV show details
 │   │   │   ├── Bookmarks.jsx        # User bookmarks
 │   │   │   ├── Login.jsx            # Login page
 │   │   │   └── Signup.jsx           # Signup page
 │   │   ├── redux/
 │   │   │   ├── slices/
 │   │   │   │   ├── authSlice.js     # Authentication state
 │   │   │   │   └── bookmarksSlice.js # Bookmarks state
 │   │   │   └── store.js             # Redux store
 │   │   ├── services/
 │   │   │   ├── api.js               # Backend API calls
 │   │   │   └── tmdb.js              # TMDB API calls
 │   │   ├── App.jsx                  # Main app component
 │   │   ├── index.js                 # App entry point
 │   │   └── index.css                # Global styles
 │   ├── public/
 │   │   └── index.html               # HTML template
 │   ├── .env.example                 # Environment variables example
 │   ├── tailwind.config.js           # Tailwind configuration
 │   ├── postcss.config.js            # PostCSS configuration
 │   └── package.json                 # Frontend dependencies
 │
 ├── API_DOCUMENTATION.md             # API endpoints documentation
 ├── DATABASE_SCHEMA.md               # Database schema documentation
 ├── BEST_PRACTICES.md                # Best practices guide
 └── README.md                        # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **TMDB API Key** (Get one free at [TMDB](https://www.themoviedb.org/settings/api))

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd entertainment-app
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/entertainment-app
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# PORT=5000
# TMDB_API_KEY=your-tmdb-api-key
```

#### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# REACT_APP_API_URL=http://localhost:5000/api
# REACT_APP_TMDB_API_KEY=your-tmdb-api-key
# REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
# REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

---

## 🏃 Running the Application

### Start MongoDB

If using local MongoDB:

```bash
# Windows
mongod

# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud MongoDB) and update `MONGODB_URI` in `.env`.

### Start Backend Server

```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000`

---

## 📝 Environment Variables

### Backend (.env)

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/entertainment-app

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000

# TMDB API Key (optional, can be used in frontend only)
TMDB_API_KEY=your-tmdb-api-key

# Node Environment
NODE_ENV=development
```

### Frontend (.env)

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api

# TMDB API Configuration
REACT_APP_TMDB_API_KEY=your-tmdb-api-key
REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

---

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Bookmarks (Protected - requires authentication)

- `POST /api/bookmarks` - Create bookmark
- `GET /api/bookmarks` - Get all bookmarks
- `DELETE /api/bookmarks/:id` - Delete bookmark
- `PUT /api/bookmarks/:id` - Update bookmark (notes/status)

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API documentation.

---

## 📊 Database Schema

### User Collection
- `email` (unique, required)
- `password` (hashed, required)
- `name` (optional)
- `createdAt`, `updatedAt` (auto-generated)

### Bookmark Collection
- `user` (ObjectId, references User)
- `contentId` (TMDB ID)
- `contentType` ("movie" or "tv")
- `title`, `posterPath`, `releaseDate`
- `notes` (optional, max 500 characters)
- `watchStatus` ("planned", "watching", "completed")
- `createdAt`, `updatedAt` (auto-generated)

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for detailed schema documentation.

---

## 🎨 Pages

1. **Home** (`/`) - Trending movies and TV shows
2. **Movies** (`/movies`) - Popular movies listing
3. **TV Series** (`/tv`) - Popular TV shows listing
4. **Search** (`/search`) - Search for movies/TV shows
5. **Details** (`/movie/:id` or `/tv/:id`) - Content details page
6. **Bookmarks** (`/bookmarks`) - User's bookmarked content (protected)
7. **Login** (`/login`) - User login
8. **Signup** (`/signup`) - User registration

---

## ✨ Key Features

### Differentiator Features Implemented

1. **Bookmark Notes** - Users can add personal notes to bookmarked content
2. **Watch Status** - Track viewing status (Planned, Watching, Completed)
3. **Filtering** - Filter bookmarks by type and watch status

---

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API endpoints documentation
- [Database Schema](./DATABASE_SCHEMA.md) - Database structure and relationships
- [Best Practices](./BEST_PRACTICES.md) - Best practices guide

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication with expiration
- ✅ Protected routes with authentication middleware
- ✅ Input validation on client and server
- ✅ Secure error messages (no sensitive info exposed)
- ✅ CORS configuration for frontend

---

## 🧪 Testing

Tests can be added using:
- **Backend:** Jest, Supertest
- **Frontend:** Jest, React Testing Library

---

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Use process manager (PM2) or containerization (Docker)
3. Deploy to Heroku, AWS, DigitalOcean, etc.

### Frontend Deployment

1. Build production bundle: `npm run build`
2. Deploy `build/` folder to Netlify, Vercel, AWS S3, etc.

---

## 📝 Scripts

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload

### Frontend

- `npm start` - Start development server
- `npm run build` - Build production bundle
- `npm test` - Run tests

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

Built as a capstone project demonstrating full-stack MERN development skills.

---

## 🙏 Acknowledgments

- **TMDB** for providing the movie and TV show API
- **React** and **Node.js** communities for excellent documentation
- **Tailwind CSS** for the utility-first CSS framework

---

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the project maintainer.

---

**Happy Coding! 🎬🍿**



