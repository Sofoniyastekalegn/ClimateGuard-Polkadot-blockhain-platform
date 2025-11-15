import { useState } from 'react';
import { Globe, Vote, Award, Menu, X, Shield, Database } from 'lucide-react';
import { WalletProvider } from './contexts/WalletContext';
import WalletConnect from './components/WalletConnect';
import Dashboard from './components/Dashboard';
import Voting from './components/Voting';
import Countries from './components/Countries';

type Page = 'dashboard' | 'voting' | 'countries';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'voting':
        return <Voting />;
      case 'countries':
        return <Countries />;
      default:
        return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Globe },
    { id: 'voting' as Page, label: 'Voting', icon: Vote },
    { id: 'countries' as Page, label: 'Countries', icon: Award },
  ];

  return (
    <WalletProvider>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-green-500 to-teal-500 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">ClimateGuard</h1>
                  <p className="text-xs text-gray-500">Polkadot Blockchain Platform</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        currentPage === item.id
                          ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
                <div className="ml-4 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-600">Polkadot</span>
                </div>
                <WalletConnect />
              </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t animate-fade-in">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-300 mb-2 ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              <div className="mt-3 px-4">
                <WalletConnect />
              </div>
            </div>
          )}
        </div>
      </nav>

      <main>{renderPage()}</main>

      <footer className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-3">About ClimateGuard</h3>
              <p className="text-sm text-green-100">
                A blockchain platform making climate action transparent, democratic, and trustworthy. Built for COP30 and beyond.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Key Features</h3>
              <ul className="text-sm text-green-100 space-y-1">
                <li>Transparent climate tracking</li>
                <li>Democratic voting system</li>
                <li>Verified green projects</li>
                <li>Real-time carbon monitoring</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Technology</h3>
              <ul className="text-sm text-green-100 space-y-1">
                <li>Blockchain-secured data</li>
                <li>AI-powered analysis</li>
                <li>Satellite monitoring</li>
                <li>IoT carbon detection</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-green-500">
            <p className="text-sm text-green-100">
              ClimateGuard 2024 - Building a sustainable future through technology
            </p>
          </div>
        </div>
      </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
