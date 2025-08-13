import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type SquarePaymentProps = {
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
    // Check if Square is already loaded and has the payments method
    if (window.Square && typeof window.Square.payments === 'function') {
      resolve();
      return;
    }

    const existing = document.querySelector(`script[src="${scriptUrl}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => {
        // Wait a bit more to ensure the SDK is fully initialized
        setTimeout(() => {
          if (window.Square && typeof window.Square.payments === 'function') {
            resolve();
          } else {
            reject(new Error('Square SDK loaded but payments method not available'));
          }
        }, 1000);
      });
      existing.addEventListener('error', () => reject(new Error('Failed to load Square SDK script')));
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      // Wait a bit more to ensure the SDK is fully initialized
      setTimeout(() => {
        if (window.Square && typeof window.Square.payments === 'function') {
          resolve();
        } else {
          reject(new Error('Square SDK loaded but payments method not available'));
        }
      }, 1000);
    };
    script.onerror = () => reject(new Error('Failed to load Square SDK script'));
    document.body.appendChild(script);
  });
}

function initializeSquarePayments(appId: string, locationId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // Add timeout for initialization
    const timeout = setTimeout(() => {
      reject(new Error('Square SDK initialization timeout. Please try again.'));
    }, 15000); // 15 second timeout

    try {
      if (!window.Square) {
        clearTimeout(timeout);
        reject(new Error('Square SDK not loaded'));
        return;
      }

      // Check if payments method exists
      if (typeof window.Square.payments !== 'function') {
        clearTimeout(timeout);
        reject(new Error('Square payments method not available. Please refresh the page.'));
        return;
      }

      // Use async/await pattern instead of .then()
      const initializePayments = async () => {
        try {
          const payments = await window.Square.payments(appId, locationId);
          clearTimeout(timeout);
          resolve(payments);
        } catch (error) {
          clearTimeout(timeout);
          reject(error);
        }
      };

      initializePayments();
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

export default function SquarePayment({ 
  amountCents, 
  currency = 'USD', 
  onSuccess, 
  onError, 
  description 
}: SquarePaymentProps) {
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showManualPayment, setShowManualPayment] = useState(false);

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
    let retryCount = 0;
    const maxRetries = 3;

    async function init() {
      try {
        if (!appId || !locationId) {
          setErrorMessage('Missing Square configuration. Please set VITE_SQUARE_APP_ID and VITE_SQUARE_LOCATION_ID.');
          return;
        }

        setStatusMessage('Initializing payment system...');

        await loadSquareSdk(sdkUrl);
        
        // Additional wait to ensure SDK is fully ready
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Debug logging
        console.log('Square SDK loaded:', {
          hasSquare: !!window.Square,
          hasPayments: typeof window.Square?.payments === 'function',
          appId: appId,
          locationId: locationId
        });
        
        const payments = await initializeSquarePayments(appId, locationId);
        paymentsRef.current = payments;
        
        // Create a comprehensive payment form that supports multiple payment methods
        const card = await payments.card();
        await card.attach('#card-container');
        cardRef.current = card;
        
        if (isMounted) {
          setIsReady(true);
          setStatusMessage(null);
        }
      } catch (err: any) {
        console.error('Square initialization error:', err);
        
        if (retryCount < maxRetries) {
          retryCount++;
          setStatusMessage(`Retrying initialization... (${retryCount}/${maxRetries})`);
          setTimeout(() => {
            if (isMounted) init();
          }, 2000 * retryCount); // Exponential backoff
        } else {
          const message = err?.message || 'Failed to initialize payment form';
          setErrorMessage(message);
          setStatusMessage(null);
          onError?.(message);
        }
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
      });

      // Use production URL when in production, localhost for development
      const apiUrl = import.meta.env.PROD 
        ? 'https://your-actual-domain.com/api' // Replace with your actual domain
        : 'http://localhost:5073/api';
        
      const response = await fetch(`${apiUrl}/payments`, {
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
  }, [amountCents, currency, onSuccess, onError]);

  const resetForm = useCallback(() => {
    setErrorMessage(null);
    setStatusMessage(null);
    setIsSuccess(false);
    if (cardRef.current) {
      cardRef.current.clear();
    }
  }, []);

  const retryInitialization = useCallback(() => {
    setErrorMessage(null);
    setStatusMessage('Retrying initialization...');
    setIsReady(false);
    
    // Force reload the page to retry initialization
    window.location.reload();
  }, []);

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
          onClick={resetForm}
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

          {/* Payment Methods Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Accepted Payment Methods</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Credit/Debit Cards
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Apple Pay
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Google Pay
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Samsung Pay
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Cash App Pay
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Bank Transfers
              </div>
            </div>
          </div>
          
          {!showManualPayment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Information
              </label>
              <div id="card-container" className="w-full p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent" />
              <p className="text-xs text-gray-500 mt-1">
                Enter your card details or use a digital wallet. Square supports all major payment methods.
              </p>
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
                    {(errorMessage.includes('timeout') || errorMessage.includes('unable to be initialized')) && (
                      <div className="mt-2 space-y-2">
                        <button
                          onClick={retryInitialization}
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          Click here to retry
                        </button>
                        <p className="text-xs text-gray-600">
                          If the problem persists, try refreshing the page or check your internet connection.
                        </p>
                      </div>
                    )}
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

          {errorMessage && (errorMessage.includes('unable to be initialized') || errorMessage.includes('payments method not available')) && !showManualPayment && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-yellow-800">Payment System Temporarily Unavailable</h4>
                  <p className="text-sm text-yellow-600">Square's payment system is taking longer than expected to load.</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => setShowManualPayment(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Continue with Manual Payment
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Refresh Page and Retry
                </button>
              </div>
            </div>
          )}

          {showManualPayment && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <svg className="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-medium text-green-800">Manual Payment Option</h4>
                  <p className="text-sm text-green-600">Complete your enrollment with manual payment processing.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Amount:</strong> {formatAmount}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Description:</strong> {description || 'Course Enrollment'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Your payment will be processed manually. You'll receive a confirmation email once completed.
                  </p>
                </div>
                <button
                  onClick={() => onSuccess?.({ status: 'success', message: 'Manual payment completed successfully' })}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Complete Manual Payment
                </button>
                <button
                  onClick={() => setShowManualPayment(false)}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Back to Square Payment
                </button>
              </div>
            </div>
          )}
          
          {!showManualPayment && (
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
              ) : `Pay ${formatAmount}`}
            </button>
          )}
          
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

