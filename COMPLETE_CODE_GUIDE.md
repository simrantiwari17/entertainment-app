# COMPLETE MERN PROJECT CODE GUIDANCE
(Frontend + Backend + Database + Admin Panel)

**Language:** English + Hinglish (Easy for Beginners)  
**Target Audience:** Students, Beginners, Non-Coders

---

## 1. PROJECT OVERVIEW (Project Kya Hai?)
Yeh ek **Entertainment Web App** hai jaha users **Movies aur TV Series** dekh sakte hain (TMDB API se), unhe **Bookmark** kar sakte hain, aur **Search** kar sakte hain. Isme ek **Admin Panel** bhi hai jaha Admin users ko manage kar sakta hai.

**Tech Stack:**
- **Frontend:** React, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT (JSON Web Tokens)

---

## 2. FRONTEND CODE EXPLANATION (Folder structure & Logic)

**Location:** `c:\entertainment-app\frontend`

### A. Folder Structure Overview
```
src/
├── components/     (Chote reusable parts jaise Navbar, Cards)
├── pages/          (Full screen pages jaise Home, Login)
├── redux/          (Data management - Store & Slices)
├── services/       (API calling logic - Backend & TMDB)
├── App.jsx         (Main Routing file - Raasta dikhane wala)
└── index.js        (Entry Point - Darwaza)
```

### B. File-by-File Explanation

#### 1. `src/index.js` (Entry Point)
Yeh file hamare application ka **Main Darwaza** hai. React yaha se start hota hai.

**Code Logic:**
- `ReactDOM.createRoot`: React app ko HTML ke `root` div me inject karta hai.
- `<Provider store={store}>`: Pure app ko Redux Store (data godown) access deta hai.
- `<App />`: Main App component ko load karta hai.

*Viva One-Liner:* "This is the entry point that renders the React App into the DOM and provides the Redux store."

#### 2. `src/App.jsx` (Routing & Layout)
Yeh file "Traffic Police" ka kaam karti hai. Batati hai ki kaunse URL pe kaunsa Page dikhana hai.

**Code Logic:**
- **Router (BrowserRouter):** Routing enable karta hai.
- **Navbar:** Sabhi pages pe dikhega kyunki `Routes` ke bahar hai.
- **Routes:**
  - Public: `/`, `/login`, `/signup` (Sabke liye open)
  - Protected: `/bookmarks` (Sirf logged-in users ke liye -> `ProtectedRoute` use kiya hai)
  - Admin: `/admin` (Sirf admin ke liye -> `AdminRoute` use kiya hai)

*Viva One-Liner:* "Handles all client-side routing and layout structure, including protecting routes."

#### 3. `src/components/Navbar.jsx`
Website ka header. Yaha se user pages switch kar sakta hai.

**Logic:**
- Links to Home, Movies, TV Series, Bookmarks.
- Shows "Profile" icon for Admin/User dashboard.
- Active link ko highlight karta hai (Colors change hote hain).

#### 4. `src/components/ProtectedRoute.jsx`
Yeh ek "Security Guard" component hai.
- Agar user logged in hai (`token` aur `user` hai) -> To andar jane do (Render children).
- Agar nahi -> Login page pe kick maro (`Navigate to='/login'`).

#### 5. `src/pages/` (Important Pages)
- **Home.jsx:** Trending Movies aur TV shows dikhata hai.
- **Login/Signup.jsx:** Forms user data lene ke liye. Submit pe `services/api.js` call karte hain.
- **Bookmarks.jsx:** User ke saved movies dikhata hai (Backend se lata hai).

#### 6. `src/redux/store.js` & Slices
Redux hamara **Global State Manager** hai (Data ka Godown).
- **authSlice:** User logged in hai ya nahi, token kya hai, store karta hai.
- **bookmarksSlice:** Bookmarks ki list store karta hai taaki baar baar fetch na karna pade.

#### 7. `src/services/`
- **tmdb.js:** TMDB (Movies database) se data lane ke liye functions.
- **api.js:** Hamare khud ke Node.js Backend se baat karne ke liye.
  - `api.interceptors`: Har request ke sath automatic **JWT Token** attach karta hai.

**Hinglish:** Frontend Backend se kaise baat karta hai?
Frontend `api.js` use karke HTTP Request bhejta hai (GET, POST), aur Backend JSON data wapas bhejta hai.

---

## 3. BACKEND CODE EXPLANATION (Server & Logic)

**Location:** `c:\entertainment-app\backend`

### A. Folder Structure Overview
```
src/
├── config/         (Database connection settings)
├── controllers/    (Main logic - Brain of the app)
├── models/         (Database Schema - Structure of data)
├── routes/         (API endpoints - URLs defines here)
├── middleware/     (Security checks like Auth, Admin)
└── server.js       (Main Server File)
```

### B. File-by-File Explanation

#### 1. `src/server.js` (Server Setup)
Yeh Backend ka **Engine** hai.

**Code Logic:**
- `connectDB()`: Database start karta hai.
- `cors()`: Frontend ko allow karta hai backend access karne ke liye (Security).
- `express.json()`: Aane wale data ko JSON format me samajhta hai.
- **Routes:** `/api/auth`, `/api/bookmarks`, `/api/admin` connect karta hai.

*Viva One-Liner:* "Initializes the Express app, connects to MongoDB, and sets up middleware and routes."

#### 2. `src/config/db.js` (Database Connection)
MongoDB Atlas (Cloud DB) se connect karne ka code. Mongoose library use hoti hai.

#### 3. `src/models/` (Data Structure)
- **User.js:** Schema define karta hai ki User kaisa dikhega.
  - Fields: `email`, `password`, `name`, `role` ('user' or 'admin').
  - **Password Hashing:** Save karne se pehle password ko encrypt karta hai (`bcrypt`).
- **Bookmark.js:** Bookmark data store karta hai (`userId`, `movieId`, `title`, etc.).

#### 4. `src/controllers/authController.js` (Auth Logic)
Yaha actual register/login ka kaam hota hai.
- **Signup:**
  1. Check karo email already hai kya?
  2. Naya user create karo.
  3. Token generate karo.
- **Login:**
  1. User dhundo.
  2. Password compare karo (`bcrypt.compare`).
  3. Sahi hai to **JWT Token** generate karke wapas bhejo.

*Viva One-Liner:* "Handles business logic for logging in and registering users, including token generation."

#### 5. `src/middleware/authMiddleware.js`
Yeh Backend ka "Security Guard" hai.
- Har protected route se pehle check karta hai ki Request header me **Token** hai ya nahi.
- Agar Token sahi hai -> `req.user` set karta hai aur aage jane deta hai (`next()`).
- Agar galat hai -> "Unauthorized" error deta hai.

#### 6. `src/routes/`
- **authRoutes.js:** `/signup`, `/login` URL ko Controller se jodta hai.
- **bookmarkRoutes.js:** `/` (Get all), `/` (Create), `/:id` (Delete) routes define karta hai.

---

## 4. ADMIN SIDE EXPLANATION

### Admin Role Kaise Kaam Karta Hai?
Database me `User` model me ek field hai `role`.
- Normal User: `role: "user"`
- Admin: `role: "admin"`

### Admin Creation
Hum code ya database (MongoDB Compass) ke through directly kisi user ka role `"admin"` manually set kar sakte hain pehli baar.

### Admin Powers (What & Why)
- **View All Users:** Admin dekh sakta hai kitne log app use kar rahe hain.
- **Delete User:** Agar koi spam user hai, to Admin usko delete kar sakta hai.
- **View Stats:** Kitne bookmarks hain total.

Protected kyun hai?
`adminMiddleware` check karta hai `if (req.user.role !== 'admin') throw Error`. Isliye normal user access nahi kar sakta.

---

## 5. CRUD EXPLANATION

**CRUD** stands for Create, Read, Update, Delete.

### Why CRUD on Bookmarks but NOT Movies?
Movie data **TMDB API (Third Party)** se aa raha hai. Hum unka data edit/delete nahi kar sakte (Read Only).
Lekin Bookmarks **hamara data** hai (Hamare DB me hai), isliye uspe CRUD possible hai.

### Bookmarks CRUD Flow:
1.  **CREATE (Add Bookmark):**
    -   User clicks bookmark icon.
    -   Frontend sends `POST /api/bookmarks` with movie data.
    -   Backend saves it in MongoDB linked to that User ID.
2.  **READ (View Bookmarks):**
    -   User goes to `/bookmarks` page.
    -   Frontend sends `GET /api/bookmarks`.
    -   Backend finds all bookmarks `where userId == currentUser`.
3.  **UPDATE:** (Not heavily used in this app, but logic exists for updating notes/status).
4.  **DELETE (Remove Bookmark):**
    -   User clicks remove.
    -   Frontend sends `DELETE /api/bookmarks/:id`.
    -   Backend removes that entry from DB.

---

## 6. COMPLETE FLOW EXPLANATION

### A. Signup -> Login -> Protected Route
1.  User fills Signup form -> `authController.signup`.
2.  User milta hai, DB me save hota hai.
3.  Server **JWT Token** banata hai -> Frontend ko bhejta hai.
4.  Frontend token ko `localStorage` me save karta hai.
5.  Ab user `/bookmarks` page pe jata hai.
6.  `api.js` token uthata hai aur Header me lagata hai `Authorization: Bearer xyz...`.
7.  Backend verify karta hai -> Data deta hai.

### B. Admin Delete User Flow
1.  Admin logs in (Role = 'admin').
2.  Goes to Dashboard -> Users List.
3.  Clicks "Delete" button.
4.  Request goes to `DELETE /api/admin/users/:id`.
5.  Middleware checks: "Is this user admin?" -> YES.
6.  Controller finds user by ID and removes from MongoDB.
7.  Success message sent back.

---
**Good Luck for your Project Review/Exam!**
Complete Codebase explained simply.
