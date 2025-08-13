# 🔧 **CORS Configuration for Production**

## **What is CORS?**

CORS (Cross-Origin Resource Sharing) is a security feature that controls which domains can access your API. For production, you need to configure it to allow only your specific domain.

---

## 📋 **Step 1: Identify Your Production Domain**

### **What's Your Domain?**
- **Custom Domain**: `https://yourdomain.com`
- **Subdomain**: `https://www.yourdomain.com`
- **Platform Domain**: `https://your-app.vercel.app` (if using Vercel)
- **Cloud Domain**: `https://your-app.netlify.app` (if using Netlify)

### **Examples:**
- `https://uslearningcentre.com`
- `https://www.uslearningcentre.com`
- `https://myapp.vercel.app`
- `https://myapp.netlify.app`

---

## 🔧 **Step 2: Update CORS Configuration**

### **In `server/index.mjs`, update the allowedOrigins array:**

```javascript
const allowedOrigins = [
  // Development (keep these)
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://localhost:5178',
  
  // Production domains (replace with your actual domain)
  'https://your-actual-domain.com',
  'https://www.your-actual-domain.com',
  
  // Examples:
  // 'https://uslearningcentre.com',
  // 'https://www.uslearningcentre.com',
  // 'https://myapp.vercel.app',
  // 'https://myapp.netlify.app'
];
```

---

## 🌐 **Step 3: Common Domain Patterns**

### **For Different Hosting Platforms:**

#### **Vercel:**
```javascript
'https://your-app.vercel.app',
'https://your-app-git-main-yourusername.vercel.app'
```

#### **Netlify:**
```javascript
'https://your-app.netlify.app',
'https://your-custom-domain.com'
```

#### **Railway:**
```javascript
'https://your-app.railway.app'
```

#### **Heroku:**
```javascript
'https://your-app.herokuapp.com',
'https://your-custom-domain.com'
```

#### **Custom Domain:**
```javascript
'https://yourdomain.com',
'https://www.yourdomain.com',
'https://api.yourdomain.com'
```

---

## 🔒 **Step 4: Security Best Practices**

### **✅ Do's:**
- ✅ **Use HTTPS only** for production domains
- ✅ **Include both www and non-www** versions
- ✅ **Keep localhost** for development
- ✅ **Test thoroughly** before deploying

### **❌ Don'ts:**
- ❌ **Don't use wildcards** like `*` in production
- ❌ **Don't include HTTP** (only HTTPS)
- ❌ **Don't forget to restart** the server after changes
- ❌ **Don't expose sensitive** information in CORS headers

---

## 🧪 **Step 5: Testing CORS Configuration**

### **Test Your Configuration:**

1. **Start your server:**
   ```bash
   npm run dev:all
   ```

2. **Check the health endpoint:**
   ```bash
   curl http://localhost:5073/api/health
   ```

3. **Test from your frontend:**
   - Open browser console
   - Try to make a request to your API
   - Check for CORS errors

### **Common CORS Errors:**

#### **Error: "Access to fetch at 'http://localhost:5073/api/payments' from origin 'https://yourdomain.com' has been blocked by CORS policy"**

**Solution:** Add your domain to the allowedOrigins array.

#### **Error: "No 'Access-Control-Allow-Origin' header is present"**

**Solution:** Check that your server is running and CORS is properly configured.

---

## 🔄 **Step 6: Environment-Specific Configuration**

### **Development vs Production:**

```javascript
const isDevelopment = process.env.NODE_ENV === 'development';

const allowedOrigins = isDevelopment 
  ? [
      // Development origins
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178'
    ]
  : [
      // Production origins only
      'https://yourdomain.com',
      'https://www.yourdomain.com'
    ];
```

---

## 🚀 **Step 7: Deployment Checklist**

### **Before Deploying:**

- [ ] **Updated allowedOrigins** with your actual domain
- [ ] **Removed placeholder domains** like `yourdomain.com`
- [ ] **Added both www and non-www** versions
- [ ] **Tested locally** with your domain
- [ ] **Restarted server** after changes
- [ ] **Checked browser console** for CORS errors

### **After Deploying:**

- [ ] **Test payment flow** from your production domain
- [ ] **Check server logs** for CORS errors
- [ ] **Monitor for blocked requests**
- [ ] **Verify HTTPS** is working

---

## 🐛 **Step 8: Troubleshooting**

### **CORS Still Not Working?**

1. **Check your domain format:**
   ```javascript
   // Correct
   'https://yourdomain.com'
   
   // Wrong
   'http://yourdomain.com'  // Missing HTTPS
   'yourdomain.com'         // Missing protocol
   ```

2. **Verify server restart:**
   ```bash
   # Stop the server
   Ctrl+C
   
   # Start again
   npm run dev:all
   ```

3. **Check browser console:**
   - Open Developer Tools (F12)
   - Go to Console tab
   - Look for CORS errors

4. **Test with curl:**
   ```bash
   curl -H "Origin: https://yourdomain.com" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        http://localhost:5073/api/payments
   ```

---

## 📝 **Example Configuration**

### **Complete CORS Configuration:**

```javascript
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.startsWith('http://localhost:')) return callback(null, true);
    
    // Production domains
    const allowedOrigins = [
      'https://uslearningcenter-1.vercel.app',  // Your Vercel domain
      'https://uslearningcentre.com',
      'https://www.uslearningcentre.com'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}));
```

---

## 🎯 **Quick Reference**

### **Your Domain:** `https://yourdomain.com`

**Add to allowedOrigins:**
```javascript
'https://yourdomain.com',
'https://www.yourdomain.com'
```

### **Your Domain:** `https://myapp.vercel.app`

**Add to allowedOrigins:**
```javascript
'https://myapp.vercel.app'
```

### **Your Domain:** `https://myapp.netlify.app`

**Add to allowedOrigins:**
```javascript
'https://myapp.netlify.app'
```

---

## ✅ **You're Ready!**

Once you've updated the CORS configuration:

1. **Replace the placeholder domains** with your actual domain
2. **Restart your server**
3. **Test the payment flow**
4. **Deploy to production**

**Your Square payment integration will work seamlessly with your production domain!** 🚀
