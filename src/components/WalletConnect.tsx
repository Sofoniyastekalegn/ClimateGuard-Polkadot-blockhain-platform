import { useState, useRef, useEffect } from 'react';
import { Wallet, ChevronDown, LogOut, Check } from 'lucide-react';
import Identicon from '@polkadot/react-identicon';
import { useWallet } from '../contexts/WalletContext';

export default function WalletConnect() {
  const { accounts, selectedAccount, isConnected, isConnecting, connectWallet, disconnectWallet, selectAccount } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <button
        onClick={connectWallet}
        disabled={isConnecting}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet className="w-5 h-5" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 px-4 py-2 bg-white border-2 border-green-500 rounded-lg hover:bg-green-50 transition-all duration-300 shadow-md"
      >
        <Identicon
          value={selectedAccount?.address || ''}
          size={32}
          theme="polkadot"
        />
        <div className="text-left hidden sm:block">
          <div className="text-xs text-gray-500">Connected</div>
          <div className="text-sm font-semibold text-gray-800">
            {selectedAccount?.meta.name || formatAddress(selectedAccount?.address || '')}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in z-50">
          <div className="p-3 bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-600 uppercase mb-1">Your Accounts</div>
            <div className="text-xs text-gray-500">
              {accounts.length} account{accounts.length !== 1 ? 's' : ''} available
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {accounts.map((account) => (
              <button
                key={account.address}
                onClick={() => {
                  selectAccount(account);
                  setShowDropdown(false);
                }}
                className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors ${
                  selectedAccount?.address === account.address ? 'bg-green-50' : ''
                }`}
              >
                <Identicon
                  value={account.address}
                  size={36}
                  theme="polkadot"
                />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-gray-800 text-sm">
                    {account.meta.name}
                  </div>
                  <div className="text-xs text-gray-500 font-mono">
                    {formatAddress(account.address)}
                  </div>
                </div>
                {selectedAccount?.address === account.address && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => {
                disconnectWallet();
                setShowDropdown(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
