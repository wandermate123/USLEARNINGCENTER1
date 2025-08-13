import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SquarePayment from '../components/SquarePayment';

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');
    const description = searchParams.get('description');

    if (orderId && amount && currency) {
      setPaymentData({
        orderId,
        amountCents: parseInt(amount),
        currency,
        description: description || 'Course Enrollment'
      });
    } else {
      // Redirect back if missing data
      navigate('/programs');
    }
  }, [searchParams, navigate]);

  const handlePaymentSuccess = (payment: any) => {
    // Redirect to success page
    navigate('/payment-success', { 
      state: { 
        payment,
        orderId: paymentData?.orderId 
      } 
    });
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // You could show an error message or redirect to error page
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
            <p className="text-gray-600 mt-2">{paymentData.description}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Order ID:</span>
              <span className="text-sm text-gray-900">{paymentData.orderId}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-700">Amount:</span>
              <span className="text-lg font-bold text-gray-900">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: paymentData.currency,
                }).format(paymentData.amountCents / 100)}
              </span>
            </div>
          </div>

          <SquarePayment
            amountCents={paymentData.amountCents}
            currency={paymentData.currency}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
            description={paymentData.description}
          />

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/programs')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Back to Programs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
