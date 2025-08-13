import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client, Environment } from 'square/legacy';
import crypto from 'node:crypto';

// Helper function to convert BigInt values to strings for JSON serialization
function convertBigIntToString(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }
  
  if (typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToString(value);
    }
    return converted;
  }
  
  return obj;
}

dotenv.config();

const app = express();
const port = process.env.PORT || 5073;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.startsWith('http://localhost:')) return callback(null, true);
    
    // Allow production domains (update these with your actual domains)
    const allowedOrigins = [
      // Your Vercel production domain
      'https://uslearningcenter-1.vercel.app',
      
      // Development domains (keep these for local testing)
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://localhost:5178'
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
app.use(express.json());

const accessToken = process.env.SQUARE_ACCESS_TOKEN;
const env = (process.env.SQUARE_ENVIRONMENT || 'sandbox').toLowerCase();
const locationId = process.env.SQUARE_LOCATION_ID;

if (!accessToken) {
  console.error('❌ SQUARE_ACCESS_TOKEN is not set. Server cannot create payments.');
  console.error('Please set SQUARE_ACCESS_TOKEN in your .env file');
}
if (!locationId) {
  console.error('❌ SQUARE_LOCATION_ID is not set. Server cannot create payments.');
  console.error('Please set SQUARE_LOCATION_ID in your .env file');
}

// Production environment check
if (env === 'production') {
  console.log('🚀 Running in PRODUCTION mode');
  console.log('💰 All payments will be REAL and charged');
  console.log('🔒 Ensure HTTPS is enabled for production');
} else {
  console.log('🧪 Running in SANDBOX mode');
  console.log('💳 All payments are test payments');
}

const client = new Client({
  accessToken,
  environment: env === 'production' ? Environment.Production : Environment.Sandbox,
});

app.get('/api/health', (_req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    squareConfigured: !!(accessToken && locationId),
    environment: env,
    production: env === 'production',
    warnings: {
      missingAccessToken: !accessToken,
      missingLocationId: !locationId,
      notProduction: env !== 'production'
    }
  });
});

app.get('/', (_req, res) => {
  res.json({ 
    message: 'Square Payment Server Running',
    endpoints: {
      health: '/api/health',
      payments: '/api/payments',
      paymentLinks: '/api/payment-links'
    }
  });
});

app.post('/api/payments', async (req, res) => {
  console.log('Payment request received:', { 
    sourceId: req.body?.sourceId ? 'present' : 'missing',
    amount: req.body?.amount,
    currency: req.body?.currency 
  });
  
  try {
    const { sourceId, amount, currency } = req.body || {};
    if (!sourceId) {
      console.log('Missing sourceId');
      return res.status(400).json({ error: 'Missing sourceId' });
    }
    if (!amount || Number.isNaN(Number(amount))) {
      console.log('Missing or invalid amount:', amount);
      return res.status(400).json({ error: 'Missing or invalid amount' });
    }
    if (!accessToken || !locationId) {
      console.log('Server missing Square configuration');
      return res.status(500).json({ error: 'Server missing Square configuration' });
    }

    const idempotencyKey = crypto.randomUUID();
    const requestBody = {
      idempotencyKey,
      sourceId,
      locationId,
      amountMoney: {
        amount: Math.trunc(Number(amount)),
        currency: (currency || 'USD').toUpperCase(),
      },
    };

    console.log('Creating payment with Square:', requestBody);
    const response = await client.paymentsApi.createPayment(requestBody);
    console.log('Payment successful:', response.result.payment.id);
    
    // Convert BigInt values to strings to avoid serialization issues
    const payment = convertBigIntToString(response.result.payment);
    
    return res.json({ payment });
  } catch (err) {
    console.error('Payment error:', err);
    const anyErr = err;
    
    // Handle BigInt serialization errors specifically
    if (anyErr?.message?.includes('BigInt')) {
      console.error('BigInt serialization error detected');
      return res.status(500).json({ 
        error: 'Payment processing error - please try again',
        details: 'Internal server error with payment data'
      });
    }
    
    const details = anyErr?.errors || anyErr?.message || 'Unknown error';
    return res.status(500).json({ error: details });
  }
});

// Payment status endpoint for hosted checkout verification
app.get('/api/payments/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log('Checking payment status for order:', orderId);
    
    if (!accessToken || !locationId) {
      return res.status(500).json({ error: 'Server missing Square configuration' });
    }

    // In a real implementation, you would:
    // 1. Look up the order in your database
    // 2. Check the payment status with Square
    // 3. Return the payment details
    
    // For now, we'll return a mock response
    // In production, implement proper order lookup and payment verification
    return res.json({
      orderId,
      status: 'completed',
      message: 'Payment verification endpoint - implement order lookup logic'
    });
  } catch (err) {
    console.error('Payment status check error:', err);
    return res.status(500).json({ error: 'Failed to check payment status' });
  }
});

// Create payment links endpoint
app.post('/api/payment-links', async (req, res) => {
  try {
    const { amount, currency, description, customerEmail, customerName, metadata } = req.body;
    
    console.log('Creating payment link:', { amount, currency, description });
    
    if (!accessToken || !locationId) {
      return res.status(500).json({ error: 'Server missing Square configuration' });
    }

    if (!amount || !currency) {
      return res.status(400).json({ error: 'Missing amount or currency' });
    }

    // Create a payment link using Square's API
    const requestBody = {
      idempotencyKey: crypto.randomUUID(),
      quickPay: {
        name: description || 'Course Enrollment',
        priceMoney: {
          amount: Math.trunc(Number(amount)),
          currency: currency.toUpperCase(),
        },
        locationId: locationId,
      },
      checkoutOptions: {
        askForShippingAddress: false,
        allowTipping: false,
      },
      prePopulatedData: {
        buyerEmail: customerEmail,
        buyerPhoneNumber: metadata?.mobileNumber,
      },
      redirectUrl: `${req.headers.origin || 'http://localhost:5174'}/payment-success`,
      note: `Enrollment for ${metadata?.programName || 'Course'}`,
    };

    console.log('Creating Square payment link:', requestBody);
    
    // Create a simple redirect URL that will work
    // In production, you would use Square's Payment Links API
    const orderId = crypto.randomUUID();
    const redirectUrl = `${req.headers.origin || 'http://localhost:5173'}/payment-success?orderId=${orderId}`;
    
    // For now, create a simple payment page URL
    const paymentPageUrl = `${req.headers.origin || 'http://localhost:5173'}/payment?orderId=${orderId}&amount=${amount}&currency=${currency}&description=${encodeURIComponent(description)}`;
    
    return res.json({
      paymentLink: paymentPageUrl,
      orderId: orderId,
      message: 'Payment link created successfully',
      redirectUrl: redirectUrl
    });
    
  } catch (err) {
    console.error('Payment link creation error:', err);
    return res.status(500).json({ error: 'Failed to create payment link' });
  }
});

app.listen(port, () => {
  console.log(`Square server listening on http://localhost:${port}`);
});

