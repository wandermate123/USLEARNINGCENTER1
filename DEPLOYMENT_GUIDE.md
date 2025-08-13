# Website Deployment Guide

## 🚨 **Current Issue**
Your domain is showing GoDaddy's default page instead of your React application because:
1. Your app is only running locally (`localhost:5174`)
2. Your domain is not pointing to your application server
3. The app needs to be deployed to a web server

## 🚀 **Deployment Options**

### **Option 1: Deploy to Vercel (Recommended - Free)**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy your app:**
   ```bash
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project or create new
   - Set project name
   - Confirm deployment settings

4. **Get your deployment URL** (e.g., `https://your-app.vercel.app`)

5. **Connect your domain:**
   - In Vercel dashboard, go to your project
   - Settings → Domains
   - Add your custom domain
   - Update DNS settings in GoDaddy

### **Option 2: Deploy to Netlify (Free)**

1. **Build your app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your `dist` folder
   - Or connect your GitHub repository

3. **Connect your domain** in Netlify dashboard

### **Option 3: Deploy to Firebase Hosting**

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting:**
   ```bash
   firebase init hosting
   ```

4. **Build and deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔧 **DNS Configuration**

### **If using Vercel/Netlify:**

1. **Get your deployment URL** from the hosting platform
2. **In GoDaddy DNS settings:**
   - Add CNAME record:
     - Name: `@` or `www`
     - Value: `your-app.vercel.app` (or netlify URL)
   - Or add A record pointing to hosting platform's IP

### **If using Firebase Hosting:**

1. **In Firebase Console:**
   - Go to Hosting → Custom domains
   - Add your domain
   - Follow the DNS configuration instructions

## 📋 **Step-by-Step Vercel Deployment**

### **Step 1: Prepare Your App**
```bash
# Make sure all dependencies are installed
npm install

# Test your app locally
npm run dev
```

### **Step 2: Deploy to Vercel**
```bash
# Deploy (this will guide you through the process)
vercel

# For production deployment
vercel --prod
```

### **Step 3: Configure Domain**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS in GoDaddy as instructed

## 🔒 **Environment Variables for Production**

### **Update Firebase Configuration for Production:**

1. **In Vercel dashboard:**
   - Go to your project → Settings → Environment Variables
   - Add your Firebase environment variables:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyC4fYBblJqGME5wAxzzW16DnrxL6uSDX8I
   VITE_FIREBASE_AUTH_DOMAIN=us-learning-centre-36c33.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=us-learning-centre-36c33
   VITE_FIREBASE_APP_ID=1:52556305026:web:7fe5af80e2ad8ad4a09a9b
   VITE_FIREBASE_STORAGE_BUCKET=us-learning-centre-36c33.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=52556305026
   VITE_FIREBASE_MEASUREMENT_ID=G-NY44PEZ420
   VITE_DEMO_AUTH=false
   ```

2. **Update Firebase Authorized Domains:**
   - Go to Firebase Console → Authentication → Settings
   - Add your production domain to authorized domains

## 🐛 **Troubleshooting**

### **Still seeing GoDaddy page:**
1. **Check DNS propagation** (can take up to 48 hours)
2. **Verify DNS settings** in GoDaddy
3. **Clear browser cache** and try again
4. **Check if domain is properly connected** in hosting platform

### **App not loading:**
1. **Check deployment logs** in hosting platform
2. **Verify environment variables** are set correctly
3. **Check browser console** for errors
4. **Ensure Firebase configuration** is correct for production

### **Authentication not working:**
1. **Update Firebase authorized domains** with your production domain
2. **Check OAuth redirect URIs** include your production domain
3. **Verify environment variables** are set in hosting platform

## 📞 **Quick Fix Steps**

1. **Deploy to Vercel:**
   ```bash
   vercel
   ```

2. **Get your deployment URL**

3. **Update GoDaddy DNS:**
   - Add CNAME record pointing to your Vercel URL

4. **Update Firebase settings:**
   - Add your domain to authorized domains
   - Update OAuth redirect URIs

5. **Wait for DNS propagation** (usually 15-30 minutes)

## 🎯 **Expected Result**

After deployment, your domain should show your React application with:
- Modern registration/login pages
- Firebase authentication working
- Google sign-in functional
- Professional UI matching your design

Your app will be accessible at your custom domain instead of showing GoDaddy's default page.
