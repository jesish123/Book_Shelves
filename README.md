# Book Shelves - Full Stack Book Management Application

A comprehensive full-stack web application for managing your personal book collection, tracking reading progress, and sharing book recommendations with other readers.

## 📖 About Book Shelves

Book Shelves is a modern book management platform that allows users to:

- **Track Reading Progress**: Organize books into categories - Want to Read, Currently Reading, and Finished
- **Rate & Review**: Rate books on a 5-star scale and write detailed reviews
- **Manage Collections**: Build and maintain your personal library with detailed book information
- **Share & Collaborate**: Share books with other users and see their reading progress and reviews
- **AI-Powered Summaries**: Get intelligent book summaries using Google Gemini API
- **Admin Dashboard**: Comprehensive admin panel for managing users, books, and system statistics

## 🏗️ System Architecture

Book Shelves is built using the **MERN Stack**:

- **Frontend**: React with Vite, Tailwind CSS for styling
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) & Google OAuth 2.0
- **AI Integration**: Google Gemini API for book summaries

### Technology Stack

```
Frontend:
├── React 18+
├── React Router DOM
├── Axios for HTTP requests
├── Tailwind CSS for styling
└── Vite (build tool)

Backend:
├── Node.js
├── Express.js
├── MongoDB + Mongoose
├── JWT Authentication
├── Google OAuth 2.0
├── Google Generative AI (Gemini)
└── Nodemailer for email services

Database:
└── MongoDB (Cloud or Local)
```

## 🚀 Features

### For Regular Users

- **User Authentication**
  - Register with email
  - Login with email/password or Google OAuth
  - Password reset via email
  - Secure JWT token-based sessions

- **Book Management**
  - Add books to your collection
  - Track book status (Want to Read, Reading, Finished)
  - Rate books (1-5 stars)
  - Write and edit reviews
  - View book details and metadata
  - Upload book files

- **Social Features**
  - View other users' book collections
  - See ratings and reviews from community
  - Browse book library across all users
  - Collaborate on shared book collections

- **AI Features**
  - Generate intelligent book summaries using AI
  - View book descriptions and metadata

### For Admin Users

- **User Management**
  - View all registered users
  - Monitor user activity and statistics
  - Delete user accounts (cannot delete other admins)
  - Access user overview and analytics

- **Book Management**
  - View all books in the system
  - Upload and manage book files
  - Monitor book status and availability
  - View system-wide book statistics

- **Dashboard Analytics**
  - Total users count
  - Total books in system
  - User overview with book counts
  - System statistics and insights

## 📋 Project Structure

```
Book_Shelves/
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   │   ├── AddBookModal.jsx
│   │   │   ├── BookCard.jsx
│   │   │   ├── BookForm.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SideBar.jsx
│   │   │   └── ...
│   │   ├── pages/                # Page components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── BookDetails.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LibraryPage.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ...
│   │   ├── layouts/              # Layout components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js             # MongoDB connection
│   │   │   ├── passport.js       # Google OAuth config
│   │   │   └── password.js
│   │   ├── controllers/
│   │   │   ├── AuthController.js
│   │   │   ├── bookController.js
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   ├── bookModel.js
│   │   │   └── UserModal.js
│   │   ├── routes/
│   │   │   ├── AuthRoutes.js
│   │   │   ├── booksRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middlewares/
│   │   │   ├── Authorization.js
│   │   │   ├── Validator.js
│   │   │   └── VerifyToken.js
│   │   ├── services/
│   │   │   └── GeminiService.js  # AI integration
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env                      # Environment variables
│   └── scripts/                  # Utility scripts
│       ├── dedupeBooks.js
│       └── listBooks.js
│
└── README.md
```

## 🔐 Admin Credentials

### How to Create an Admin User

Since Book Shelves doesn't come with a pre-configured admin account, follow these steps to create one:

#### Option 1: Create Admin via Database (Recommended for Setup)

1. Connect to your MongoDB database using MongoDB Compass or MongoDB Atlas
2. Navigate to the `Workshop_4` database and `users` collection
3. Insert a new document with admin role:

```json
{
  "first_name": "Admin",
  "last_name": "User",
  "email": "admin@bookshelves.local",
  "password": "$2a$10$YOUR_HASHED_PASSWORD_HERE",
  "role": "admin",
  "status": "online",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

**Note**: The password must be hashed using bcrypt. You can use an online bcrypt generator or Node.js to hash it:

```bash
# Using Node.js
const bcrypt = require('bcryptjs');
bcrypt.hash('your_admin_password', 10, (err, hash) => {
  console.log(hash);
});
```

#### Option 2: Create Admin via Registration + Database Edit

1. Register a new user through the application
2. Connect to MongoDB and find the user document
3. Update the user's role from `"user"` to `"admin"`:

```json
{
  "_id": "user_id_here",
  "role": "admin"
}
```

**Use this account to:**
- Access the Admin Dashboard
- Manage all users and books
- View system analytics
- Upload books

> ⚠️ **IMPORTANT - Security Recommendations**:
> - **Change default password** immediately after first login
> - **Create a new strong password** (min 12 characters with mixed case, numbers, symbols)
> - Do **NOT use simple passwords** in production
> - Store credentials securely (password manager)
> - Never share admin credentials via email or chat
> - Use environment variables for sensitive data in code
> - Regularly audit admin account activity

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas cloud)
- npm or yarn package manager
- Git

### Backend Setup

1. **Navigate to backend directory**

```bash
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the backend directory with the following variables:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Workshop_4

# JWT
JWT_SECRET=your_secret_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# AI Service
GEMINI_API_KEY=your_gemini_api_key
```

4. **Start the backend server**

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env.local` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

4. **Start the development server**

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Authentication Routes (`/auth`)

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with code
- `GET /auth/google` - Google OAuth login
- `GET /auth/google/callback` - Google OAuth callback

### User Routes (`/api/users`)

- `GET /api/users` - Get all users (admin only)
- `GET /api/users/me` - Get current user profile
- `DELETE /api/users/:id` - Delete a user (admin only)
- `PATCH /api/users/me/password` - Update password

### Book Routes (`/api/books`)

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book details
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book
- `GET /api/books/admin/users-overview` - Admin: Get users overview
- `POST /api/books/upload` - Admin: Upload book file

## 🔄 User Roles & Permissions

### Regular User
- View personal book collection
- Add/edit/delete own books
- Rate and review books
- View other users' public books
- Update own profile and password
- Access user dashboard

### Admin User
- All regular user permissions
- View all users in the system
- Delete user accounts
- View admin dashboard
- Access system-wide analytics
- Upload book files
- Manage books globally
- View users overview with statistics

## 🗄️ Database Models

### User Model

```javascript
{
  first_name: String,
  last_name: String,
  email: String (unique),
  password: String,
  role: String (enum: ['user', 'admin']),
  status: String (enum: ['online', 'offline']),
  googleId: String,
  resetCode: String,
  resetCodeExpiry: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Book Model

```javascript
{
  title: String,
  author: String,
  genre: String,
  description: String,
  isbn: String,
  coverUrl: String,
  fileUrl: String,
  status: String (enum: ['want', 'reading', 'finished']),
  rating: Number (0-5),
  review: String,
  userId: ObjectId,
  stockQuantity: Number,
  shelfLocation: String,
  availabilityStatus: String (enum: ['active', 'out of stock', 'archived', 'pending']),
  members: Array, // Collaborative users
  createdAt: Date,
  updatedAt: Date
}
```

## 📧 Email Configuration

Book Shelves uses Nodemailer for password reset emails. To configure:

1. **Gmail Setup**:
   - Enable 2-factor authentication on your Gmail account
   - Generate an [App Password](https://support.google.com/accounts/answer/185833)
   - Use the 16-character app password in `EMAIL_PASS`

2. **Update `.env`**:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password
```

## 🤖 AI Integration

Book Shelves integrates with Google Generative AI (Gemini) for intelligent book summaries.

### Setup

1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `.env`:

```env
GEMINI_API_KEY=your_key_here
```

## 🚀 Deployment

### Frontend Deployment (Netlify)

Book Shelves frontend is configured for deployment on Netlify with all necessary configuration files included.

#### Netlify Setup Steps:

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the repository containing Book Shelves

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
   - Base directory: `frontend`

3. **Set Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add `VITE_API_URL` = your Render backend URL (e.g., `https://bookshelves-api.onrender.com`)

4. **Configure Redirects**
   - The `_redirects` and `_headers` files handle routing and security headers
   - Netlify automatically processes these files

5. **Deploy**
   - Push changes to your Git repository
   - Netlify automatically builds and deploys
   - Your site will be live at `https://your-site-name.netlify.app`

**Netlify Configuration Files:**
- `netlify.toml` - Main Netlify configuration
- `_redirects` - URL redirect rules
- `_headers` - HTTP security headers

---

### Backend Deployment (Render)

Deploy the Node.js Express backend to Render with zero-downtime deployments.

#### Render Setup Steps:

1. **Prepare Backend**
   - Ensure `backend/package.json` has `start` script: `node server.js`
   - Backend should handle `PORT` environment variable
   - Ensure all dependencies are listed in `package.json`

2. **Create Render Service**
   - Go to [Render](https://render.com)
   - Click "New Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - **Name**: `bookshelves-api` (or your choice)
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `node backend/server.js`
   - **Plan**: Free or Starter (as needed)

4. **Set Environment Variables**
   - Go to Environment tab and add:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Workshop_4
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=https://your-site-name.netlify.app
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://bookshelves-api.onrender.com/auth/google/callback
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Your backend will be available at `https://bookshelves-api.onrender.com`

#### Important Notes for Render:

- **Cold Starts**: Free tier services go to sleep after 15 minutes of inactivity. First request may take 30 seconds.
- **Logs**: Check Render logs if deployment fails
- **Auto-Deploy**: Enable auto-deploy from Git to update on every push
- **Custom Domain**: Add a custom domain in Settings if desired

---

### Production Environment Variables Checklist

Before deploying, ensure these are configured on Render:

✅ `MONGO_URI` - MongoDB Atlas connection string  
✅ `JWT_SECRET` - Strong random string (min 32 characters)  
✅ `FRONTEND_URL` - Your Netlify domain  
✅ `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Console  
✅ `GOOGLE_CALLBACK_URL` - Your Render backend callback URL  
✅ `EMAIL_*` - Gmail SMTP credentials  
✅ `GEMINI_API_KEY` - Google Generative AI key  

---

### Post-Deployment Steps

1. **Test the Application**
   - Visit your Netlify frontend URL
   - Test registration and login
   - Test admin login with: `admin@admin.com` / `admin123`
   - Verify API connection works

2. **Update OAuth Callback URLs**
   - Google Console: Add Render backend URL to authorized redirect URIs
   - Format: `https://your-backend-url.onrender.com/auth/google/callback`

3. **Monitor Logs**
   - Render: Check backend logs for any errors
   - Netlify: Check build logs and runtime logs
   - Browser console: Check for any client-side errors

4. **Security Checklist**
   - Never commit `.env` to Git
   - Use strong passwords in production
   - Enable HTTPS (both Netlify and Render do this by default)
   - Regularly update dependencies

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database name matches (Workshop_4)

### Google OAuth Issues

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Check `GOOGLE_CALLBACK_URL` matches Google Console settings

### Email Not Sending

- Verify Gmail App Password (not regular password)
- Check EMAIL_SECURE setting (false for port 587, true for 465)
- Verify sender email is enabled

### Admin Access Denied

- Ensure your user's `role` field is set to `"admin"` in MongoDB
- Clear browser storage and re-login
- Check JWT token hasn't expired

## 📝 Available Scripts

### Backend

```bash
npm run dev   # Start development server with auto-reload
npm start     # Start production server
```

### Frontend

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
npm run lint   # Run ESLint
```

### Utility Scripts

```bash
node scripts/listBooks.js    # List all books in database
node scripts/dedupeBooks.js  # Remove duplicate books
```

## 🤝 Contributing

Contributions are welcome! Please follow the project guidelines:

- Use functional React components
- Use async/await for asynchronous operations
- Keep components small and reusable
- Write meaningful variable/function names
- Handle errors properly
- Don't commit `.env` files

## 📄 License

ISC License

## 📞 Support

For issues and questions:
1. Check existing documentation
2. Review troubleshooting section
3. Check browser console for errors
4. Verify all environment variables are set correctly

## 🎯 Future Enhancements

- Mobile app (React Native)
- Book recommendations engine
- Social reading clubs
- Advanced search and filtering
- Book wishlist sharing
- Reading statistics and insights
- Export reading history
- API documentation with Swagger
- Unit and integration tests

---

**Happy Reading with Book Shelves!** 📚✨
