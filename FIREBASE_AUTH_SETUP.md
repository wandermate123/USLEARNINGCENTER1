# Firebase Authentication Setup Guide

This guide will help you set up real Firebase authentication with Gmail integration for your US Learning Centre application.

## Prerequisites

1. A Google account
2. Node.js and npm installed
3. Your React application ready

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "us-learning-centre")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:

### Email/Password Authentication
1. Click on "Email/Password"
2. Toggle "Enable" to ON
3. Optionally enable "Email link (passwordless sign-in)"
4. Click "Save"

### Google Authentication
1. Click on "Google"
2. Toggle "Enable" to ON
3. Add your project support email
4. Click "Save"

## Step 3: Configure Google OAuth

1. In the Google provider settings, you'll see a "Web SDK configuration" section
2. Note down the "Web client ID" and "Web client secret" (you'll need these later)
3. Add your domain to the "Authorized domains" list:
   - For development: `localhost`
   - For production: your actual domain

## Step 4: Get Firebase Configuration

1. In Firebase console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "US Learning Centre Web")
6. Copy the Firebase configuration object

## Step 5: Set Up Environment Variables

Create a `.env` file in your project root (if it doesn't exist) and add your Firebase configuration:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here

# Disable demo mode when Firebase is configured
VITE_DEMO_AUTH=false
```

## Step 6: Install Firebase Dependencies

Run the following command in your project directory:

```bash
npm install firebase
```

## Step 7: Configure Google OAuth Consent Screen

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to "APIs & Services" > "OAuth consent screen"
4. Choose "External" user type
5. Fill in the required information:
   - App name: "US Learning Centre"
   - User support email: your email
   - Developer contact information: your email
6. Add scopes:
   - `email`
   - `profile`
   - `openid`
7. Add test users (your email addresses for testing)
8. Save and continue

## Step 8: Create OAuth 2.0 Credentials

1. In Google Cloud Console, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - `http://localhost:3000` (if using different port)
   - Your production domain
5. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - Your production domain
6. Click "Create"
7. Copy the Client ID and Client Secret

## Step 9: Update Firebase Google Provider

In your Firebase Authentication settings:
1. Go back to "Authentication" > "Sign-in method" > "Google"
2. Update the "Web client ID" and "Web client secret" with the values from Step 8
3. Save the changes

## Step 10: Test the Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your login page
3. Test both email/password registration and Google sign-in
4. Check the Firebase console to see if users are being created

## Step 11: Security Rules (Optional but Recommended)

In Firebase console, go to "Firestore Database" > "Rules" and add basic security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read course data
    match /courses/{courseId} {
      allow read: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **"popup_closed_by_user" error**: This usually means the popup was blocked. Make sure to allow popups for your domain.

2. **"auth/unauthorized-domain" error**: Add your domain to the authorized domains list in Firebase Authentication settings.

3. **"auth/invalid-api-key" error**: Check that your environment variables are correctly set and the API key is valid.

4. **Google sign-in not working**: Ensure your OAuth consent screen is properly configured and the credentials are correct.

### Development vs Production:

- For development: Use `localhost` in authorized domains
- For production: Add your actual domain
- Update environment variables for production deployment

## Additional Features

### User Profile Management

You can extend the authentication to include user profiles:

```typescript
// In your AuthContext, add user profile management
const updateUserProfile = async (displayName: string, photoURL?: string) => {
  if (auth?.currentUser) {
    await updateProfile(auth.currentUser, {
      displayName,
      photoURL
    });
  }
};
```

### Email Verification

Enable email verification in Firebase and implement it in your app:

```typescript
const sendEmailVerification = async () => {
  if (auth?.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};
```

### Password Reset

Implement password reset functionality:

```typescript
const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};
```

## Security Best Practices

1. **Never expose API keys in client-side code** - Use environment variables
2. **Implement proper error handling** - Don't expose sensitive information in error messages
3. **Use HTTPS in production** - Firebase requires secure connections
4. **Implement rate limiting** - Consider using Firebase Functions for additional security
5. **Regular security audits** - Monitor your Firebase console for suspicious activity

## Next Steps

Once authentication is working:

1. Set up user roles and permissions
2. Implement user profile management
3. Add course enrollment functionality
4. Set up payment integration
5. Implement admin dashboard features

Your Firebase authentication is now ready to use! The application will automatically switch from demo mode to real Firebase authentication when the environment variables are properly configured.
