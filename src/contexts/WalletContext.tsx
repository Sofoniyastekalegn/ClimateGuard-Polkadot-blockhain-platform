import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { web3Accounts, web3Enable, web3FromAddress } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

interface WalletContextType {
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  selectAccount: (account: InjectedAccountWithMeta) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem('selectedWalletAddress');
    if (savedAddress && accounts.length > 0) {
      const account = accounts.find(acc => acc.address === savedAddress);
      if (account) {
        setSelectedAccount(account);
        setIsConnected(true);
      }
    }
  }, [accounts]);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const extensions = await web3Enable('ClimateGuard');

      if (extensions.length === 0) {
        alert('No Polkadot extension found. Please install SubWallet or Polkadot.js extension.');
        setIsConnecting(false);
        return;
      }

      const allAccounts = await web3Accounts();

      if (allAccounts.length === 0) {
        alert('No accounts found. Please create an account in your wallet extension.');
        setIsConnecting(false);
        return;
      }

      setAccounts(allAccounts);

      if (allAccounts.length > 0 && !selectedAccount) {
        setSelectedAccount(allAccounts[0]);
        localStorage.setItem('selectedWalletAddress', allAccounts[0].address);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setSelectedAccount(null);
    setAccounts([]);
    setIsConnected(false);
    localStorage.removeItem('selectedWalletAddress');
  };

  const selectAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
    localStorage.setItem('selectedWalletAddress', account.address);
    setIsConnected(true);
  };

  return (
    <WalletContext.Provider
      value={{
        accounts,
        selectedAccount,
        isConnected,
        isConnecting,
        connectWallet,
        disconnectWallet,
        selectAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
