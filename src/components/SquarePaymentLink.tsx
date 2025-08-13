import React, { useState } from 'react';
import { CreditCard, ExternalLink, Loader, CheckCircle, AlertCircle } from 'lucide-react';

type SquarePaymentLinkProps = {
  amountCents: number;
  currency?: string;
  onSuccess?: (payment: unknown) => void;
  onError?: (message: string) => void;
  description?: string;
  enrollmentData?: any;
};

export default function SquarePaymentLink({ 
  amountCents, 
  currency = 'USD', 
  onSuccess, 
  onError, 
  description,
  enrollmentData 
}: SquarePaymentLinkProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  const formatAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amountCents / 100);

  const createPaymentLink = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Use production URL when in production, localhost for development
      const apiUrl = import.meta.env.PROD 
        ? 'https://uslearningcenter-1.vercel.app/api' // Your Vercel domain
        : 'http://localhost:5073/api';
        
      // Create payment link through our backend
      const response = await fetch(`${apiUrl}/payment-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountCents,
          currency: currency.toUpperCase(),
          description: description || 'Course Enrollment',
          customerEmail: enrollmentData?.parentEmail,
          customerName: enrollmentData?.childName,
          metadata: {
            programName: enrollmentData?.programName,
            package: enrollmentData?.package,
            childAge: enrollmentData?.childAge,
            mobileNumber: enrollmentData?.mobileNumber
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment link');
      }

      const data = await response.json();
      setPaymentLink(data.paymentLink);
      
      // Try to open the payment link in a new window/tab
      try {
        const newWindow = window.open(data.paymentLink, '_blank');
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          // If popup was blocked or failed, show fallback
          setShowFallback(true);
        }
      } catch (error) {
        // If there's an error opening the window, show fallback
        setShowFallback(true);
      }
      
    } catch (err: any) {
      setErrorMessage(err.message);
      onError?.(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    onSuccess?.({ status: 'success', message: 'Payment completed successfully' });
  };

  const handleFallbackPayment = () => {
    // Redirect to a simple payment page or show embedded form
    setShowFallback(false);
    // For now, just mark as success
    handlePaymentSuccess();
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

      {showFallback && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <h4 className="font-medium text-yellow-800">Payment Link Unavailable</h4>
              <p className="text-sm text-yellow-600">Square's hosted checkout is not available. Please use the alternative payment method.</p>
            </div>
          </div>
        </div>
      )}

      {paymentLink && !showFallback ? (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <div>
                <h4 className="font-medium text-green-800">Payment Link Created</h4>
                <p className="text-sm text-green-600">Click the button below to complete your payment</p>
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={() => window.open(paymentLink, '_blank')}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Complete Payment on Square
            <ExternalLink className="h-4 w-4 ml-2" />
          </button>
          
          <button
            type="button"
            onClick={handlePaymentSuccess}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors"
          >
            I've Completed Payment
          </button>
        </div>
      ) : showFallback ? (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleFallbackPayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            Continue with Alternative Payment
          </button>
          
          <button
            type="button"
            onClick={() => setShowFallback(false)}
            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={createPaymentLink}
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
              Creating Payment Link...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Pay {formatAmount} with Square
              <ExternalLink className="h-4 w-4 ml-2" />
            </>
          )}
        </button>
      )}

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
