import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Package, CreditCard } from 'lucide-react';

type EnrollmentFormProps = {
  programName: string;
  amountCents: number;
  currency?: string;
  onSuccess?: (enrollment: any) => void;
  onCancel?: () => void;
};

export default function EnrollmentForm({ 
  programName, 
  amountCents, 
  currency = 'USD',
  onSuccess,
  onCancel 
}: EnrollmentFormProps) {
  const [formData, setFormData] = useState({
    childName: '',
    parentEmail: '',
    childAge: '',
    package: '8',
    mobileNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amountCents / 100);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form data
      if (!formData.childName.trim()) {
        throw new Error('Please enter your child\'s name');
      }
      if (!formData.parentEmail.trim()) {
        throw new Error('Please enter parent email');
      }
      if (!formData.childAge) {
        throw new Error('Please select child\'s age');
      }
      if (!formData.mobileNumber.trim()) {
        throw new Error('Please enter mobile number');
      }

      // Create enrollment data
      const enrollmentData = {
        ...formData,
        programName,
        amountCents,
        currency,
        timestamp: new Date().toISOString()
      };

      // Store enrollment data in session storage
      sessionStorage.setItem('enrollmentData', JSON.stringify(enrollmentData));

      // Call success callback to close form and proceed
      onSuccess?.(enrollmentData);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Enroll in {programName}</h3>
            <button 
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Course Details</h4>
            <p className="text-lg font-medium text-blue-600 mb-2">{programName}</p>
            <p className="text-sm text-gray-600">Total Amount: {formatAmount}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Child's Name
              </label>
              <input 
                type="text" 
                required
                value={formData.childName}
                onChange={(e) => handleInputChange('childName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your child's full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Parent Email
              </label>
              <input 
                type="email" 
                required
                value={formData.parentEmail}
                onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Child's Age
              </label>
              <select 
                required
                value={formData.childAge}
                onChange={(e) => handleInputChange('childAge', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select age</option>
                {[4,5,6,7,8,9,10,11,12].map(age => (
                  <option key={age} value={age}>{age} years old</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Session Package
              </label>
              <select 
                required
                value={formData.package}
                onChange={(e) => handleInputChange('package', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="8">8 Sessions (use within 30 days) - {formatAmount}</option>
                <option value="16">16 Sessions (use within 60 days) - 10% OFF</option>
                <option value="24">24 Sessions (use within 90 days) - 20% OFF</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Sessions must be used within the package validity period.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Mobile Number
              </label>
              <input 
                type="tel" 
                required
                value={formData.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 flex items-center justify-center ${
                  isSubmitting 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                } text-white py-3 rounded-lg font-medium transition-colors`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                                 ) : (
                   <>
                     <CreditCard className="h-5 w-5 mr-2" />
                     Continue to Payment
                   </>
                 )}
              </button>
            </div>

            <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
              <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure payment powered by Square
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
