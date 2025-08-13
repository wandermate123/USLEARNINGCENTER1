import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4fYBblJqGME5wAxzzW16DnrxL6uSDX8I",
  authDomain: "us-learning-centre-36c33.firebaseapp.com",
  projectId: "us-learning-centre-36c33",
  storageBucket: "us-learning-centre-36c33.firebasestorage.app",
  messagingSenderId: "52556305026",
  appId: "1:52556305026:web:7fe5af80e2ad8ad4a09a9b",
  measurementId: "G-NY44PEZ420"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | undefined;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

try {
  if (isFirebaseConfigured) {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
    
    // Initialize analytics only in browser environment
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
    
    setPersistence(auth, browserLocalPersistence).catch(() => {
      // Non-blocking persistence setup failure (e.g., in private mode)
    });
    
    console.log('Firebase initialized successfully');
  } else {
    console.warn('Firebase not configured. Skipping Firebase initialization.');
  }
} catch (err) {
  console.error('Failed to initialize Firebase:', err);
  app = undefined;
  auth = null;
  analytics = null;
}

export { auth, analytics };
export default app;

