import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { payment, orderId } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Thank you for your payment. Your enrollment has been confirmed.
          </p>

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-600">
                <strong>Order ID:</strong> {orderId}
              </div>
              {payment && (
                <div className="text-sm text-gray-600 mt-1">
                  <strong>Payment ID:</strong> {payment.id || 'N/A'}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate('/student/dashboard')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
            
            <button
              onClick={() => navigate('/programs')}
              className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-medium transition-colors"
            >
              Browse More Programs
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>A confirmation email has been sent to your registered email address.</p>
            <p className="mt-1">If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
