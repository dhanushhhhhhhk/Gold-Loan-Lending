import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Crown, Menu, X, LogOut, User, Building2 } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Star Finance</span>
              <div className="text-xs text-primary-600 font-medium">Gold & Silver Loans</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {!user && (
              <>
                <Link 
                  to="/" 
                  className={`text-gray-700 hover:text-primary-600 transition-colors ${isActive('/') ? 'text-primary-600 font-medium' : ''}`}
                >
                  Home
                </Link>
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/customer/login" 
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    <span>Customer Login</span>
                  </Link>
                  <Link 
                    to="/bank/login" 
                    className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Bank Login</span>
                  </Link>
                </div>
              </>
            )}

            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Welcome, <span className="font-medium text-primary-600">{user.name}</span>
                </span>
                <Link 
                  to={user.type === 'customer' ? '/customer/dashboard' : '/bank/dashboard'}
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {!user && (
                <>
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/customer/login" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>Customer Login</span>
                  </Link>
                  <Link 
                    to="/bank/login" 
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Bank Login</span>
                  </Link>
                </>
              )}

              {user && (
                <>
                  <div className="text-gray-700 border-b border-gray-200 pb-2">
                    Welcome, <span className="font-medium text-primary-600">{user.name}</span>
                  </div>
                  <Link 
                    to={user.type === 'customer' ? '/customer/dashboard' : '/bank/dashboard'}
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;