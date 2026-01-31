# Quick Start Guide

## Prerequisites

Before running the app, make sure you have:

1. **Node.js** installed (v14 or higher) - [Download](https://nodejs.org/)
2. **MongoDB** running locally OR MongoDB Atlas account
3. **TMDB API Key** - Get free at [TMDB](https://www.themoviedb.org/settings/api)

---

## Step-by-Step Setup

### 1. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally or use MongoDB Atlas (cloud)
- MongoDB will run on `mongodb://localhost:27017` by default

**Option B: MongoDB Atlas (Recommended)**
- Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and get connection string
- Use the connection string in `.env` file

### 2. Get TMDB API Key

1. Go to [TMDB](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key (it's free!)
5. Copy your API key

### 3. Backend Setup

The backend `.env` file already exists. Just make sure it has these values:

```env
MONGODB_URI=mongodb://localhost:27017/entertainment-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
TMDB_API_KEY=your-tmdb-api-key
NODE_ENV=development
```

**To run the backend:**

```powershell
cd backend
npm install  # Only needed once
npm start    # Start server
```

Backend will run on: `http://localhost:5000`

### 4. Frontend Setup

**Create `.env` file in frontend folder:**

```powershell
cd frontend
# Copy the example file
copy .env.example .env
```

**Edit `.env` file with your values:**

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_TMDB_API_KEY=your-tmdb-api-key
REACT_APP_TMDB_BASE_URL=https://api.themoviedb.org/3
REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500
```

**Install dependencies and run:**

```powershell
cd frontend
npm install  # Only needed once (installs all React dependencies)
npm start    # Start development server
```

Frontend will run on: `http://localhost:3000`

---

## Running the Application

### Method 1: Two Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```

### Method 2: Use VS Code Integrated Terminal

1. Open two terminal tabs in VS Code
2. Run backend in first terminal
3. Run frontend in second terminal

---

## Access the App

Once both servers are running:

- **Frontend:** Open browser to `http://localhost:3000`
- **Backend API:** Available at `http://localhost:5000/api`

---

## First Time Setup Checklist

- [ ] MongoDB is running (local or Atlas)
- [ ] Backend `.env` file exists and has correct values
- [ ] Frontend `.env` file created with correct values
- [ ] TMDB API key added to both `.env` files
- [ ] Backend dependencies installed (`npm install` in backend folder)
- [ ] Frontend dependencies installed (`npm install` in frontend folder)
- [ ] Backend server running (`npm start` in backend folder)
- [ ] Frontend server running (`npm start` in frontend folder)

---

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists in `backend/` folder
- Check if port 5000 is already in use

### Frontend won't start
- Make sure you ran `npm install` in `frontend/` folder
- Check if `.env` file exists in `frontend/` folder
- Check if port 3000 is already in use

### Can't connect to backend
- Verify backend is running on port 5000
- Check `REACT_APP_API_URL` in frontend `.env` file
- Make sure CORS is enabled in backend

### TMDB API errors
- Verify your TMDB API key is correct
- Check if API key is added to both `.env` files
- Make sure API key is activated in TMDB dashboard

---

## Default Ports

- **Backend:** 5000
- **Frontend:** 3000
- **MongoDB:** 27017 (if local)

---

## Need Help?

Check the full documentation:
- [README.md](./README.md) - Complete setup instructions
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API endpoints
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - Database structure



