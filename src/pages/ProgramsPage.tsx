import React, { useState } from 'react';
import { Check, ArrowRight, User, Clock, Video, BookOpen, CreditCard, Shield } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EnrollmentForm from '../components/EnrollmentForm';
import SquarePaymentLink from '../components/SquarePaymentLink';
import { getQuoteDemo } from '../lib/pricing';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProgramsPage() {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<any>(null);
  const [selectedSessions, setSelectedSessions] = useState<number>(8);
  const [promoCode, setPromoCode] = useState<string>('');
  const [quoteCents, setQuoteCents] = useState<number>(100);
  const [quoteCurrency, setQuoteCurrency] = useState<string>('USD');
  const [quoteLoading, setQuoteLoading] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const programs = [
    {
      id: 'level1',
      name: 'Level 1 - Beginner',
      price: 'Contact for Rates',
      period: '',
      description: 'Perfect for English and Maths beginners aged 4-8',
      features: [
        'Live Zoom sessions twice per week',
        '45-minute interactive sessions',
        'Basic phonics and vocabulary building',
        'Small group learning (max 6 students)',
        'Progress tracking dashboard',
        'Zoom link provided after payment'
      ],
      color: 'blue'
    },
    {
      id: 'level2',
      name: 'Level 2 - Intermediate',
      price: 'Contact for Rates',
      period: '',
      description: 'For intermediate English and Maths learners aged 6-10',
      features: [
        'Live Zoom sessions twice per week',
        '45-minute interactive sessions',
        'Reading, writing, and speaking focus',
        'Grammar and sentence structure',
        'Small group learning (max 6 students)',
        'Progress tracking dashboard',
        'Zoom link provided after payment'
      ],
      color: 'green',
      popular: true
    },
    {
      id: 'level3',
      name: 'Level 3 - Advanced',
      price: 'Contact for Rates',
      period: '',
      description: 'For advanced English and Maths learners aged 8-12',
      features: [
        'Live Zoom sessions twice per week',
        '45-minute interactive sessions',
        'Advanced grammar and comprehension',
        'Creative writing workshops',
        'Public speaking and presentation skills',
        'Small group learning (max 6 students)',
        'Progress tracking dashboard',
        'Zoom link provided after payment'
      ],
      color: 'purple'
    }
  ];

  const handleEnrollmentSuccess = (enrollment: any) => {
    setEnrollmentData(enrollment);
    setShowEnrollmentForm(false);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (payment: any) => {
    setShowPaymentForm(false);
    navigate('/student/dashboard');
  };

  async function refreshQuote() {
    setQuoteLoading(true);
    try {
      const level = selectedPlan || 'level1';
      const quote = await getQuoteDemo({ level, sessions: selectedSessions, promoCode });
      setQuoteCents(quote.totalCents);
      setQuoteCurrency(quote.currency);
    } catch (error) {
      console.error('Error getting quote:', error);
      setQuoteCents(100); // fallback to $1.00
      setQuoteCurrency('USD');
    } finally {
      setQuoteLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Choose Your Child's English & Maths Level
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Select the perfect level for your child's English and Maths learning journey. Sessions in each package must be used within 30, 60, or 90 days respectively. All sessions are live and interactive via Zoom.
              </p>
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {programs.map((program) => (
                <div 
                  key={program.id}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    program.popular ? 'ring-2 ring-green-500 scale-105' : ''
                  }`}
                >
                  {program.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`p-8 ${program.popular ? 'pt-12' : ''}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{program.name}</h3>
                    <p className="text-gray-600 mb-6">{program.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-2xl font-bold text-gray-900">{program.price}</span>
                      <span className="text-gray-600 ml-2">{program.period}</span>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {program.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={async () => {
                        try {
                          setSelectedPlan(program.id);
                          setShowEnrollmentForm(true);
                          await refreshQuote();
                        } catch (error) {
                          console.error('Error opening enrollment form:', error);
                          // Still show the form even if quote fails
                          setSelectedPlan(program.id);
                          setShowEnrollmentForm(true);
                        }
                      }}
                      className={`w-full py-3 px-4 rounded-full font-medium transition-colors ${
                        program.color === 'green' 
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : program.color === 'purple'
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Enroll in This Level
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Session Packages Section — removed */}

        {/* Meet the Teacher Section */}
        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="/images/teacher-new.jpg"
                  alt="Teacher Sujata Sangwan"
                  className="rounded-2xl shadow-lg w-full max-w-md mx-auto"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Meet Your Expert Teacher
                </h2>
                <h3 className="text-xl font-semibold text-blue-600 mb-4">
                  Sujata Sangwan
                </h3>
                <p className="text-gray-600 mb-6">
                  M.S, M.Ed. and Ed.S from 🇺🇸 USA. 25 years experience with guaranteed results in improving test scores.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Expert in teaching interventional English and Maths</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Expert in online teaching</span>
                  </div>
                  <div className="flex items-center">
                    <Video className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">Expert in teaching thousands of students in the last 25 years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment Form Modal */}
        {showEnrollmentForm && (
          <EnrollmentForm
            programName={programs.find(p => p.id === selectedPlan)?.name || 'Course'}
            amountCents={quoteCents}
            currency={quoteCurrency}
            onSuccess={handleEnrollmentSuccess}
            onCancel={() => setShowEnrollmentForm(false)}
          />
        )}

        {/* Payment Form Modal */}
        {showPaymentForm && enrollmentData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Complete Payment</h3>
                  <button 
                    onClick={() => setShowPaymentForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Enrollment Details</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Student:</strong> {enrollmentData.childName}</p>
                    <p><strong>Program:</strong> {enrollmentData.programName}</p>
                    <p><strong>Package:</strong> {enrollmentData.package} Sessions</p>
                    <p><strong>Email:</strong> {enrollmentData.parentEmail}</p>
                  </div>
                </div>

                {!isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">Please sign in to proceed with payment.</div>
                    <button
                      type="button"
                      onClick={() => navigate('/student/login')}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Sign in to Continue
                    </button>
                  </div>
                ) : (
                  <SquarePaymentLink
                    amountCents={quoteCents}
                    currency={quoteCurrency}
                    onSuccess={handlePaymentSuccess}
                    description={`Payment for ${enrollmentData.programName} enrollment`}
                    enrollmentData={enrollmentData}
                  />
                )}

                <div className="flex items-center text-sm text-gray-600 mt-4">
                  <Shield className="h-4 w-4 mr-2" />
                  Your payment information is secure and encrypted
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}