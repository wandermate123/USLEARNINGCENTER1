# Quick Firebase Setup

## 1. Install Dependencies

```bash
npm install firebase
```

## 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Email/Password and Google providers
4. Get your Firebase config from Project Settings

## 3. Set Up Environment Variables

Copy `env.example` to `.env` and fill in your Firebase values:

```bash
cp env.example .env
```

Then edit `.env` with your actual Firebase configuration.

## 4. Test the Application

```bash
npm run dev
```

Visit `http://localhost:5173/student/register` to test the new authentication system.

## Demo Mode

The app currently runs in demo mode. To switch to real Firebase authentication:

1. Set up Firebase as described above
2. Set `VITE_DEMO_AUTH=false` in your `.env` file
3. Restart the development server

## Routes

- `/student/register` - New user registration
- `/student/login` - Existing user login
- `/student/dashboard` - Student dashboard (protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard (protected)
