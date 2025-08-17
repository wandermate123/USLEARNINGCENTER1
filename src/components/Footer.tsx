import React from 'react';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-yellow-500" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">US LEARNING CENTRE</span>
                <span className="text-sm font-medium text-gray-400">USAcademy</span>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering young learners with personalized intervention English teaching. 
              Building confidence in speaking, reading, and writing for children aged 4-12.
            </p>
            <div className="space-y-2">
              <a href="mailto:uslearningcenter1@gmail.com" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="h-4 w-4" />
                <span>uslearningcenter1@gmail.com</span>
              </a>
              <a href="tel:+919253285350" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                <Phone className="h-4 w-4" />
                <span>+91 92532 85350</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/programs" className="text-gray-400 hover:text-white transition-colors">Programs</Link></li>
              <li><Link to="/programs" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              <li><Link to="/admin/login" className="text-gray-400 hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 US LEARNING CENTRE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}