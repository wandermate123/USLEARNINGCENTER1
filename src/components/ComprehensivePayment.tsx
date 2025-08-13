import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type PaymentMethod = 'card' | 'applePay' | 'googlePay' | 'cashApp' | 'ach';

type ComprehensivePaymentProps = {
  amountCents: number;
  currency?: string;
  onSuccess?: (payment: unknown) => void;
  onError?: (message: string) => void;
  description?: string;
};

declare global {
  interface Window {
    Square?: any;
  }
}

function loadSquareSdk(scriptUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Square) {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[src="${scriptUrl}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Square SDK script')));
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Square SDK script'));
    document.body.appendChild(script);
  });
}

export default function ComprehensivePayment({ 
  amountCents, 
  currency = 'USD', 
  onSuccess, 
  onError, 
  description 
}: ComprehensivePaymentProps) {
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [availableMethods, setAvailableMethods] = useState<PaymentMethod[]>(['card']);

  const appId = import.meta.env.VITE_SQUARE_APP_ID as string | undefined;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID as string | undefined;
  const env = (import.meta.env.VITE_SQUARE_ENVIRONMENT as string | undefined) || 'sandbox';

  const cardRef = useRef<any>(null);
  const paymentsRef = useRef<any>(null);

  const sdkUrl = useMemo(() => {
    const base = env === 'production' ? 'https://web.squarecdn.com/v1/square.js' : 'https://sandbox.web.squarecdn.com/v1/square.js';
    return base;
  }, [env]);

  const formatAmount = useMemo(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amountCents / 100);
  }, [amountCents, currency]);

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        if (!appId || !locationId) {
          setErrorMessage('Missing Square configuration. Please set VITE_SQUARE_APP_ID and VITE_SQUARE_LOCATION_ID.');
          return;
        }

        await loadSquareSdk(sdkUrl);
        if (!window.Square) {
          throw new Error('Square SDK not available on window');
        }

        const payments = await window.Square.payments(appId, locationId);
        paymentsRef.current = payments;
        
        // Check available payment methods
        const methods: PaymentMethod[] = ['card'];
        
        try {
          const applePay = await payments.applePay();
          if (applePay) methods.push('applePay');
        } catch (e) {
          // Apple Pay not available
        }
        
        try {
          const googlePay = await payments.googlePay();
          if (googlePay) methods.push('googlePay');
        } catch (e) {
          // Google Pay not available
        }
        
        try {
          const cashApp = await payments.cashAppPay();
          if (cashApp) methods.push('cashApp');
        } catch (e) {
          // Cash App Pay not available
        }
        
        try {
          const ach = await payments.ach();
          if (ach) methods.push('ach');
        } catch (e) {
          // ACH not available
        }
        
        setAvailableMethods(methods);
        
        // Initialize card payment by default
        const card = await payments.card();
        await card.attach('#card-container');
        cardRef.current = card;
        
        if (isMounted) setIsReady(true);
      } catch (err: any) {
        const message = err?.message || 'Failed to initialize payment form';
        setErrorMessage(message);
        onError?.(message);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, [appId, locationId, sdkUrl, onError]);

  const handlePay = useCallback(async () => {
    if (!cardRef.current) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage('Processing payment...');
    setIsSuccess(false);
    
    try {
      const result = await cardRef.current.tokenize();
      if (result.status !== 'OK') {
        throw new Error(result.errors?.[0]?.message || 'Payment tokenization failed');
      }

      console.log('Sending payment request:', {
        sourceId: result.token,
        amount: amountCents,
        currency,
        method: selectedMethod
      });

      const response = await fetch('http://localhost:5073/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceId: result.token,
          amount: amountCents,
          currency,
        }),
      });

      console.log('Payment response status:', response.status);

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        console.error('Payment error response:', errBody);
        
        if (response.status === 404) {
          throw new Error('Payment server not found. Please check if the server is running on port 5073.');
        }
        
        throw new Error(errBody?.error || `Payment failed (${response.status})`);
      }

      const body = await response.json();
      setStatusMessage('Payment successful!');
      setIsSuccess(true);
      onSuccess?.(body?.payment || body);
    } catch (err: any) {
      const message = err?.message || 'Payment failed';
      setErrorMessage(message);
      setStatusMessage(null);
      setIsSuccess(false);
      onError?.(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [amountCents, currency, onSuccess, onError, selectedMethod]);

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'card':
        return '💳';
      case 'applePay':
        return '🍎';
      case 'googlePay':
        return '🤖';
      case 'cashApp':
        return '💚';
      case 'ach':
        return '🏦';
      default:
        return '💳';
    }
  };

  const getMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'card':
        return 'Credit/Debit Card';
      case 'applePay':
        return 'Apple Pay';
      case 'googlePay':
        return 'Google Pay';
      case 'cashApp':
        return 'Cash App Pay';
      case 'ach':
        return 'Bank Transfer';
      default:
        return 'Card';
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Payment Successful!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your payment of {formatAmount} has been processed successfully.</p>
                {description && <p className="mt-1">{description}</p>}
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Make Another Payment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(!appId || !locationId) ? (
        <div className="text-red-600 text-sm">
          Square is not configured. Set VITE_SQUARE_APP_ID and VITE_SQUARE_LOCATION_ID.
        </div>
      ) : (
        <>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Amount:</span>
              <span className="text-lg font-bold text-gray-900">{formatAmount}</span>
            </div>
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedMethod(method)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    selectedMethod === method
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getMethodIcon(method)}</span>
                    <span className="text-sm font-medium">{getMethodName(method)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Payment Form */}
          {selectedMethod === 'card' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div id="card-container" className="w-full p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent" />
              <p className="text-xs text-gray-500 mt-1">
                Enter your card details. We accept Visa, Mastercard, American Express, and Discover.
              </p>
            </div>
          )}

          {selectedMethod === 'applePay' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🍎</span>
                <div>
                  <h4 className="font-medium text-blue-800">Apple Pay</h4>
                  <p className="text-sm text-blue-600">Apple Pay will be available on supported devices.</p>
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'googlePay' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🤖</span>
                <div>
                  <h4 className="font-medium text-blue-800">Google Pay</h4>
                  <p className="text-sm text-blue-600">Google Pay will be available on supported devices.</p>
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'cashApp' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">💚</span>
                <div>
                  <h4 className="font-medium text-green-800">Cash App Pay</h4>
                  <p className="text-sm text-green-600">Pay with your Cash App balance or linked card.</p>
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'ach' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏦</span>
                <div>
                  <h4 className="font-medium text-purple-800">Bank Transfer (ACH)</h4>
                  <p className="text-sm text-purple-600">Pay directly from your bank account.</p>
                </div>
              </div>
            </div>
          )}
          
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {statusMessage && !errorMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">{statusMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          <button
            type="button"
            onClick={handlePay}
            disabled={!isReady || isSubmitting}
            className={`w-full ${
              isReady && !isSubmitting 
                ? 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2' 
                : 'bg-gray-300 cursor-not-allowed'
            } text-white py-3 rounded-lg font-medium transition-colors`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : `Pay ${formatAmount} with ${getMethodName(selectedMethod)}`}
          </button>
          
          <div className="flex items-center justify-center text-xs text-gray-500">
            <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure payment powered by Square
          </div>
        </>
      )}
    </div>
  );
}
