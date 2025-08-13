# Square Payment Integration Guide

## Current Status
✅ Square SDK is already installed and configured  
✅ Backend API endpoint is implemented  
✅ Frontend payment component is ready  
✅ Integration in Programs page is complete  

## Steps to Complete Integration

### Step 1: Square Developer Account Setup

1. **Create Square Developer Account**
   - Go to [Square Developer Dashboard](https://developer.squareup.com/)
   - Sign up for a Square Developer account
   - Create a new application

2. **Get Your Credentials**
   - **Application ID**: Found in your Square Developer Dashboard
   - **Access Token**: Generate from the Developer Dashboard
   - **Location ID**: Create a location in your Square Dashboard

### Step 2: Environment Configuration

Create a `.env` file in your project root with these values:

```env
# Square (frontend)
VITE_SQUARE_APP_ID=your_square_application_id_here
VITE_SQUARE_LOCATION_ID=your_square_location_id_here
VITE_SQUARE_ENVIRONMENT=sandbox

# Square (backend)
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_LOCATION_ID=your_square_location_id_here
SQUARE_ENVIRONMENT=sandbox
PORT=3001

# Firebase (existing)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
```

### Step 3: Test the Integration

1. **Start the servers:**
   ```bash
   npm run dev:all
   ```

2. **Test in Sandbox Mode:**
   - Navigate to your Programs page
   - The payment form should load with Square's card input
   - Use Square's test card numbers:
     - **Visa**: 4111 1111 1111 1111
     - **Mastercard**: 5555 5555 5555 4444
     - **Expiry**: Any future date
     - **CVV**: Any 3 digits

### Step 4: Production Deployment

1. **Update Environment Variables:**
   - Change `VITE_SQUARE_ENVIRONMENT` to `production`
   - Change `SQUARE_ENVIRONMENT` to `production`
   - Use production credentials from Square

2. **Deploy Backend:**
   - Deploy your Express server with the Square API endpoint
   - Ensure environment variables are set on your hosting platform

3. **Deploy Frontend:**
   - Build and deploy your React app
   - Ensure environment variables are available during build

## How It Works

### Backend (server/index.mjs)
- Receives payment requests from frontend
- Uses Square SDK to create payments
- Handles idempotency and error handling
- Returns payment results to frontend

### Frontend (src/components/SquarePayment.tsx)
- Loads Square Web SDK
- Renders secure card input form
- Tokenizes card data (never stores card details)
- Sends token to backend for processing
- Handles success/error states

### Integration Points
- **ProgramsPage.tsx**: Uses SquarePayment component for course purchases
- **Authentication**: Requires user login before payment
- **Mock Mode**: Available for testing without real payments

## Security Features

✅ **PCI Compliance**: Card data never touches your server  
✅ **Tokenization**: Square handles sensitive card information  
✅ **Idempotency**: Prevents duplicate charges  
✅ **Environment Separation**: Sandbox vs Production  
✅ **CORS Protection**: Server validates request origins  

## Testing

### Sandbox Testing
- Use Square's test card numbers
- No real charges are made
- Perfect for development and testing

### Production Testing
- Use real cards for small amounts
- Monitor Square Dashboard for transactions
- Test error scenarios

## Troubleshooting

### Common Issues:
1. **"Square is not configured"**: Check environment variables
2. **"Failed to load Square SDK"**: Check internet connection
3. **"Payment failed"**: Check Square credentials and location ID
4. **CORS errors**: Ensure server is running on correct port

### Debug Mode:
Set `VITE_ENABLE_MOCK_PAYMENTS=true` in your `.env` to use mock payments for testing.

## Next Steps

1. **Complete Square Developer Account setup**
2. **Add your credentials to .env file**
3. **Test with sandbox environment**
4. **Deploy to production when ready**

Your Square integration is already well-implemented! Just add your credentials and you're ready to accept payments.
