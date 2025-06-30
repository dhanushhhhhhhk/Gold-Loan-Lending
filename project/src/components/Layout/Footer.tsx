import React from 'react';
import { Crown, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-2 rounded-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Star Finance</span>
                <div className="text-sm text-primary-400">Gold & Silver Loans</div>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Trusted partner in the Small and Medium Banking sector, providing secure and quick 
              loan solutions against gold, silver, and platinum deposits.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@starfinance.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>1800-123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Loan Calculator</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Interest Rates</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Branch Locator</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">NBFC Guidelines</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Grievance Redressal</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Star Finance. All rights reserved. | Licensed NBFC | CIN: U65100MH2020PLC123456</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;