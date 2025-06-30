import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Clock, CreditCard, Award, ArrowRight, CheckCircle, Star } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: 'Quick Approval',
      description: 'Get loan approval in minutes with our streamlined digital process'
    },
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Bank-grade security with encrypted data transmission and storage'
    },
    {
      icon: CreditCard,
      title: 'Competitive Rates',
      description: 'Best-in-market interest rates and flexible repayment options'
    },
    {
      icon: Award,
      title: 'Trusted Service',
      description: 'Licensed NBFC with years of experience in precious metal financing'
    }
  ];

  const benefits = [
    'No hidden charges or processing fees',
    'Instant loan amount calculation',
    'Flexible tenure options up to 12 months',
    'Quick gold evaluation by certified experts',
    'Doorstep pickup and delivery service',
    'Digital KYC verification'
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Unlock the Value of Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600"> Gold & Silver</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Get instant loans against your precious metals with our secure, 
                digital-first platform. Quick approval, competitive rates, and hassle-free process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/customer/register">
                  <Button size="lg" icon={ArrowRight} iconPosition="right" className="min-w-48">
                    Get Started Now
                  </Button>
                </Link>
                <Link to="/customer/login">
                  <Button variant="outline" size="lg" className="min-w-48">
                    Existing Customer
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Loan Calculator</h3>
                  <p className="text-gray-600">Estimate your loan amount</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gold Weight (grams)</label>
                    <input 
                      type="number" 
                      placeholder="Enter weight" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      defaultValue="10"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gold Purity</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                      <option>22K Gold</option>
                      <option>18K Gold</option>
                      <option>Silver</option>
                    </select>
                  </div>
                  
                  <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700">Estimated Loan Amount:</span>
                      <span className="text-2xl font-bold text-primary-600">₹45,000</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      *Based on current market rates
                    </div>
                  </div>
                  
                  <Button fullWidth size="lg">
                    Apply for Loan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Star Finance?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of gold loans with our innovative platform designed for speed, security, and convenience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300" hover>
                <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Transparent Process, 
                <span className="text-primary-600"> Zero Surprises</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our commitment to transparency means you'll always know exactly what to expect. 
                No hidden fees, no complicated terms - just straightforward lending.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">Customer Satisfaction</h3>
                    <p className="text-gray-600">Based on 10,000+ reviews</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary-600">4.8</div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-primary-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Loan Approval Speed</span>
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-200 rounded-full h-2 w-32">
                        <div className="bg-green-500 h-2 rounded-full w-28"></div>
                      </div>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Customer Service</span>
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-200 rounded-full h-2 w-32">
                        <div className="bg-green-500 h-2 rounded-full w-30"></div>
                      </div>
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Overall Experience</span>
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-200 rounded-full h-2 w-32">
                        <div className="bg-green-500 h-2 rounded-full w-29"></div>
                      </div>
                      <span className="text-sm font-medium">89%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Your Gold Loan?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have chosen Star Finance for their precious metal financing needs.
          </p>
          <Link to="/customer/register">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl px-8 py-4 text-lg font-semibold"
            >
              Start Your Application
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;