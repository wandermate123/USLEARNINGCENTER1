import React, { useState } from 'react';
import { CreditCard, ExternalLink, Loader } from 'lucide-react';

type SquareHostedCheckoutProps = {
  amountCents: number;
  currency?: string;
  onSuccess?: (payment: unknown) => void;
  onError?: (message: string) => void;
  description?: string;
  enrollmentData?: any;
};

export default function SquareHostedCheckout({ 
  amountCents, 
  currency = 'USD', 
  onSuccess, 
  onError, 
  description,
  enrollmentData 
}: SquareHostedCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const appId = import.meta.env.VITE_SQUARE_APP_ID as string | undefined;
  const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID as string | undefined;
  const env = (import.meta.env.VITE_SQUARE_ENVIRONMENT as string | undefined) || 'sandbox';

  const formatAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amountCents / 100);

  const handleOpenCheckout = async () => {
    if (!appId || !locationId) {
      setErrorMessage('Payment system not configured');
      onError?.('Payment system not configured');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Create a unique order ID
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create the Square checkout URL
      const baseUrl = env === 'production' 
        ? 'https://checkout.squareup.com' 
        : 'https://checkout.squareupsandbox.com';
      
      const checkoutUrl = `${baseUrl}/pay/${appId}`;
      
      // Prepare checkout data
      const checkoutData = {
        amount: amountCents,
        currency: currency.toUpperCase(),
        orderId: orderId,
        description: description || 'Course Enrollment',
        customerEmail: enrollmentData?.parentEmail,
        customerName: enrollmentData?.childName,
        // Add any additional metadata
        metadata: {
          programName: enrollmentData?.programName,
          package: enrollmentData?.package,
          childAge: enrollmentData?.childAge,
          mobileNumber: enrollmentData?.mobileNumber
        }
      };

      // Store checkout data in session storage for verification
      sessionStorage.setItem('squareCheckoutData', JSON.stringify(checkoutData));
      sessionStorage.setItem('squareOrderId', orderId);

      // Open Square's hosted checkout in a new window
      const checkoutWindow = window.open(
        checkoutUrl,
        'square-checkout',
        'width=500,height=700,scrollbars=yes,resizable=yes'
      );

      if (!checkoutWindow) {
        throw new Error('Please allow popups to complete payment');
      }

      // Listen for messages from the checkout window
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== baseUrl) return;

        if (event.data.type === 'square-checkout-complete') {
          const paymentData = event.data.payment;
          checkoutWindow.close();
          onSuccess?.(paymentData);
        } else if (event.data.type === 'square-checkout-cancel') {
          checkoutWindow.close();
          setErrorMessage('Payment was cancelled');
          onError?.('Payment was cancelled');
        }
      };

      window.addEventListener('message', handleMessage);

      // Fallback: Check for payment completion every 2 seconds
      const checkInterval = setInterval(() => {
        if (checkoutWindow.closed) {
          clearInterval(checkInterval);
          // Check if payment was successful by calling our backend
          checkPaymentStatus(orderId);
        }
      }, 2000);

    } catch (err: any) {
      setErrorMessage(err.message);
      onError?.(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async (orderId: string) => {
    try {
      // Call your backend to check payment status
      const response = await fetch(`http://localhost:5073/api/payments/status/${orderId}`);
      if (response.ok) {
        const paymentData = await response.json();
        onSuccess?.(paymentData);
      }
    } catch (error) {
      console.log('Payment status check failed, but payment may have been successful');
    }
  };

  return (
    <div className="space-y-4">
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
        <h4 className="text-sm font-medium text-blue-800 mb-2">Available Payment Methods</h4>
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
            Cash App Pay
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Bank Transfers
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            Buy Now, Pay Later
          </div>
        </div>
      </div>

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

      <button
        type="button"
        onClick={handleOpenCheckout}
        disabled={isLoading}
        className={`w-full flex items-center justify-center ${
          isLoading 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
        } text-white py-3 rounded-lg font-medium transition-colors`}
      >
        {isLoading ? (
          <>
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Opening Payment...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pay {formatAmount} with Square
            <ExternalLink className="h-4 w-4 ml-2" />
          </>
        )}
      </button>

      <div className="text-center text-xs text-gray-500 space-y-1">
        <div className="flex items-center justify-center">
          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Secure payment powered by Square
        </div>
        <p>You'll be redirected to Square's secure payment page</p>
      </div>
    </div>
  );
}
