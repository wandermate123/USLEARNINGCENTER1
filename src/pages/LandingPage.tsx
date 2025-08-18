import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, BookOpen, Award, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <Header transparent />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-blue-600 bg-opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Unlock Your Child's<br />
              <span className="text-yellow-400">Full English & Maths Potential</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Personalized Intervention English and Maths Teaching for Ages 4-12
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/programs"
                className="bg-yellow-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center"
              >
                Start Their Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white hover:text-blue-700 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Live Interactive Learning?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our live interactive sessions provide personalized attention and real-time feedback to help children develop strong English and Maths skills with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Live Interactive Sessions</h3>
              <p className="text-gray-600">
                Real-time interaction with qualified teachers through live Zoom sessions. Get instant feedback and personalized attention.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Small Group Learning</h3>
              <p className="text-gray-600">
                Small class sizes ensure every child gets individual attention and can actively participate in discussions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Choose from multiple time slots that fit your family's schedule. Sessions are held twice per week for optimal learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to enroll in live English and Maths classes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Choose Your Level</h3>
              <p className="text-gray-600">
                Select from Level 1 (Beginner), Level 2 (Intermediate), or Level 3 (Advanced) based on your child's current ability
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Select Package</h3>
              <p className="text-gray-600">
                Choose from 8, 16, or 24 session packages with attractive discounts for longer commitments
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Make Payment</h3>
              <p className="text-gray-600">
                Complete secure payment and receive your Zoom link and class schedule immediately
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                4
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Start Learning</h3>
              <p className="text-gray-600">
                Join live sessions twice per week and track your child's progress through our dashboard
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Parents Say
            </h2>
            <p className="text-xl text-gray-600">
              Real success stories from families we've helped
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Emma's confidence in speaking English and solving Maths problems has improved dramatically! The live sessions with real-time feedback made all the difference. She looks forward to every class!"
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face" 
                  alt="Parent" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Parent of Emma, age 7</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The live interactive sessions are amazing! Jake loves the small group setting and his vocabulary and Maths skills have expanded so much. The teacher gives individual attention to each child."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face" 
                  alt="Parent" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium text-gray-900">Michael Chen</p>
                  <p className="text-sm text-gray-600">Parent of Jake, age 9</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Amazing results in just 2 months! Sophia's speaking confidence and Maths problem-solving skills have grown tremendously. The live Zoom classes are engaging and she looks forward to them every week."
              </p>
              <div className="flex items-center">
                <img 
                  src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face" 
                  alt="Parent" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium text-gray-900">Lisa Rodriguez</p>
                  <p className="text-sm text-gray-600">Parent of Sophia, age 6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Child's English & Maths Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of families who have seen remarkable improvements through our live interactive English and Maths classes.
          </p>
          <Link
            to="/programs"
            className="bg-yellow-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 inline-flex items-center"
          >
            Enroll Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}