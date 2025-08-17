import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, User, LogOut, HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = React.useState(false);
  const { isAuthenticated, user, userProfile, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const helpMenuRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside menus to close them
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (helpMenuRef.current && !helpMenuRef.current.contains(event.target as Node)) {
        setIsHelpMenuOpen(false);
      }
    }

    if (isUserMenuOpen || isHelpMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isHelpMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserDisplayName = () => {
    if (userProfile?.name) return userProfile.name;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent ? 'bg-transparent' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className={`h-8 w-8 ${transparent ? 'text-white' : 'text-blue-600'}`} />
            <div className="flex flex-col">
              <span className={`text-xl font-bold ${transparent ? 'text-white' : 'text-gray-900'}`}>
                US LEARNING CENTRE
              </span>
              <span className={`text-sm font-medium ${transparent ? 'text-white/80' : 'text-gray-600'}`}>
                USAcademy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                transparent ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/programs" 
              className={`text-sm font-medium transition-colors ${
                transparent ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Programs
            </Link>
            
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    transparent 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{getUserDisplayName()}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/student/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/student/login" 
                className={`text-sm font-medium transition-colors ${
                  transparent ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Student Login
              </Link>
            )}
            
            {/* Help Menu */}
            <div className="relative" ref={helpMenuRef}>
              <button
                onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  transparent 
                    ? 'text-white hover:bg-white/10' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Help</span>
              </button>
              
              {isHelpMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Contact & Support</p>
                  </div>
                  <a
                    href="https://wa.me/919253285350"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsHelpMenuOpen(false)}
                  >
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span>WhatsApp: +91 92532 85350</span>
                  </a>
                  <a
                    href="tel:+919253285350"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsHelpMenuOpen(false)}
                  >
                    <Phone className="h-4 w-4 text-blue-600" />
                    <span>Call: +91 92532 85350</span>
                  </a>
                  <a
                    href="mailto:uslearningcenter1@gmail.com"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    onClick={() => setIsHelpMenuOpen(false)}
                  >
                    <Mail className="h-4 w-4 text-red-600" />
                    <span>Email: uslearningcenter1@gmail.com</span>
                  </a>
                </div>
              )}
            </div>
            
            <Link 
              to="/programs" 
              className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-600 transition-colors"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 ${transparent ? 'text-white' : 'text-gray-700'}`}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Home</Link>
              <Link to="/programs" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Programs</Link>
              
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link to="/student/dashboard" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Dashboard</Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link to="/student/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Student Login</Link>
              )}
              
              <div className="px-3 py-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-900 mb-2">Contact & Support</p>
                <a
                  href="https://wa.me/919253285350"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4 text-green-600" />
                  <span>WhatsApp: +91 92532 85350</span>
                </a>
                <a
                  href="tel:+919253285350"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center space-x-2"
                >
                  <Phone className="h-4 w-4 text-blue-600" />
                  <span>Call: +91 92532 85350</span>
                </a>
                <a
                  href="mailto:uslearningcenter1@gmail.com"
                  className="block px-3 py-2 text-gray-700 hover:text-blue-600 flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4 text-red-600" />
                  <span>Email: uslearningcenter1@gmail.com</span>
                </a>
              </div>
              
              <Link to="/programs" className="block px-3 py-2 bg-yellow-500 text-white rounded-md ml-3 mr-3 text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}