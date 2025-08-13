import { auth, analytics, isFirebaseConfigured } from './firebase';

// Test Firebase configuration
export function testFirebaseConfig() {
  console.log('=== Firebase Configuration Test ===');
  console.log('Firebase configured:', isFirebaseConfigured);
  console.log('Auth instance:', auth ? 'Available' : 'Not available');
  console.log('Analytics instance:', analytics ? 'Available' : 'Not available');
  
  if (auth) {
    console.log('Auth domain:', auth.config.authDomain);
    console.log('Project ID:', auth.config.projectId);
  }
  
  console.log('=== End Test ===');
}

// Call the test function
testFirebaseConfig();
