import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu } from 'lucide-react';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      transparent ? 'bg-transparent' : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className={`h-8 w-8 ${transparent ? 'text-white' : 'text-blue-600'}`} />
            <span className={`text-xl font-bold ${transparent ? 'text-white' : 'text-gray-900'}`}>
              US LEARNING CENTRE
            </span>
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
            <Link 
              to="/student/login" 
              className={`text-sm font-medium transition-colors ${
                transparent ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Student Login
            </Link>
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
              <Link to="/student/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Student Login</Link>
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