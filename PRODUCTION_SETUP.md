# 🚀 **Square Production Setup Guide**

## **Moving to Live Payments**

Your Square integration is ready for production! Follow these steps to switch from sandbox to live payments.

---

## 📋 **Step 1: Get Your Square Production Credentials**

### **1.1 Square Dashboard Access**
1. Go to [Square Developer Dashboard](https://developer.squareup.com/apps)
2. Sign in with your Square account
3. Select your application

### **1.2 Production Credentials**
You'll need these from your Square Dashboard:

#### **Backend Credentials:**
- **Production Access Token**: `EAAA...` (starts with EAAA)
- **Production Location ID**: `L...` (starts with L)
- **Environment**: Set to `production`

#### **Frontend Credentials:**
- **Production Application ID**: `sq0idp-...` (starts with sq0idp)
- **Production Location ID**: Same as backend
- **Environment**: Set to `production`

---

## 🔧 **Step 2: Update Environment Variables**

Create a `.env` file in your project root with these values:

```env
# Square Production Configuration
SQUARE_ACCESS_TOKEN=EAAA...your_production_access_token_here
SQUARE_LOCATION_ID=L...your_production_location_id_here
SQUARE_ENVIRONMENT=production

# Frontend Square Configuration
VITE_SQUARE_APP_ID=sq0idp-...your_production_app_id_here
VITE_SQUARE_LOCATION_ID=L...your_production_location_id_here
VITE_SQUARE_ENVIRONMENT=production

# Server Configuration
PORT=5073

# Firebase Configuration (if using)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
```

---

## 🔒 **Step 3: Security Checklist**

### **✅ Environment Variables**
- [ ] All sandbox credentials replaced with production
- [ ] `SQUARE_ENVIRONMENT=production`
- [ ] `VITE_SQUARE_ENVIRONMENT=production`
- [ ] No hardcoded credentials in code

### **✅ Square Dashboard Settings**
- [ ] Application is in "Production" mode
- [ ] Webhook endpoints configured (if needed)
- [ ] Payment methods enabled
- [ ] Location is active

### **✅ Server Security**
- [ ] CORS configured for production domains
- [ ] HTTPS enabled (required for production)
- [ ] Environment variables secured
- [ ] No debug logging in production

---

## 🌐 **Step 4: Production Domain Configuration**

### **Update CORS Settings**
In `server/index.mjs`, update the CORS configuration:

```javascript
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Allow your production domain
    const allowedOrigins = [
      'https://yourdomain.com',
      'https://www.yourdomain.com',
      'http://localhost:5173' // Keep for development
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}));
```

### **Update Frontend URLs**
In your frontend components, update any hardcoded URLs:

```javascript
// Change from
const apiUrl = 'http://localhost:5073';

// To
const apiUrl = process.env.NODE_ENV === 'production' 
  ? 'https://yourdomain.com/api' 
  : 'http://localhost:5073';
```

---

## 🧪 **Step 5: Testing Production Payments**

### **Test with Real Cards**
Use real payment methods for testing:

#### **Credit Cards:**
- **Visa**: `4111 1111 1111 1111`
- **Mastercard**: `5555 5555 5555 4444`
- **American Express**: `3782 822463 10005`
- **Discover**: `6011 1111 1111 1117`

#### **Digital Wallets:**
- **Apple Pay**: Available on iOS devices
- **Google Pay**: Available on Android devices
- **Cash App Pay**: Available with Cash App account

#### **Bank Transfers:**
- **ACH**: Real routing and account numbers

### **Test Scenarios:**
1. **Successful Payment**: Use a valid card
2. **Declined Payment**: Use `4000 0000 0000 0002`
3. **Insufficient Funds**: Use `4000 0000 0000 9995`
4. **Expired Card**: Use `4000 0000 0000 0069`

---

## 📊 **Step 6: Monitoring & Analytics**

### **Square Dashboard Monitoring**
- [ ] Set up payment notifications
- [ ] Monitor transaction history
- [ ] Check for failed payments
- [ ] Review customer data

### **Your Application Monitoring**
- [ ] Payment success/failure logging
- [ ] Error tracking
- [ ] Performance monitoring
- [ ] User analytics

---

## 🚨 **Step 7: Important Production Notes**

### **⚠️ Critical Warnings:**
1. **Real Money**: All payments will be real and charged
2. **No Refunds**: Test carefully - real payments can't be easily reversed
3. **PCI Compliance**: Square handles this, but ensure secure practices
4. **Backup**: Keep sandbox environment for testing

### **✅ Best Practices:**
1. **Start Small**: Test with small amounts first
2. **Monitor Closely**: Watch for errors and issues
3. **Have Support**: Keep Square support contact handy
4. **Document Everything**: Record all changes and configurations

---

## 🔄 **Step 8: Rollback Plan**

If you need to revert to sandbox:

1. **Change Environment Variables:**
   ```env
   SQUARE_ENVIRONMENT=sandbox
   VITE_SQUARE_ENVIRONMENT=sandbox
   ```

2. **Update Credentials:**
   - Use sandbox access token
   - Use sandbox location ID
   - Use sandbox application ID

3. **Restart Servers:**
   ```bash
   npm run dev:all
   ```

---

## 📞 **Support & Troubleshooting**

### **Square Support:**
- **Developer Support**: [Square Developer Support](https://developer.squareup.com/support)
- **Business Support**: [Square Business Support](https://squareup.com/help)

### **Common Issues:**
1. **CORS Errors**: Check domain configuration
2. **Payment Declined**: Verify card details
3. **SDK Loading**: Check app ID and environment
4. **Server Errors**: Check access token and location ID

---

## 🎉 **You're Ready for Production!**

Once you've completed all steps:

1. **Test thoroughly** with small amounts
2. **Monitor closely** for the first few days
3. **Have support contacts** ready
4. **Document any issues** for future reference

**Your learning center is now ready to accept real payments!** 🚀

---

## 📝 **Quick Reference**

### **Environment Variables:**
```env
SQUARE_ACCESS_TOKEN=EAAA...
SQUARE_LOCATION_ID=L...
SQUARE_ENVIRONMENT=production
VITE_SQUARE_APP_ID=sq0idp-...
VITE_SQUARE_LOCATION_ID=L...
VITE_SQUARE_ENVIRONMENT=production
```

### **Test Cards:**
- **Success**: `4111 1111 1111 1111`
- **Declined**: `4000 0000 0000 0002`
- **Insufficient**: `4000 0000 0000 9995`

### **Support:**
- **Square Developer**: https://developer.squareup.com/support
- **Square Business**: https://squareup.com/help
