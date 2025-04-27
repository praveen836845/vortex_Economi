// src/main.tsx (or your app's entry point)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { flareTestnet, mainnet, sepolia } from 'wagmi/chains'; // Choose chains you support
import { injected } from 'wagmi/connectors'; // For MetaMask, etc.
// import { walletConnect } from 'wagmi/connectors' // Example for WalletConnect

// --- Import TanStack Query ---
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Create a QueryClient instance
const queryClient = new QueryClient();

// 2. Configure chains and transports for Wagmi config
export const config = createConfig({
  chains: [mainnet, sepolia, flareTestnet], // Add chains relevant to your app
  connectors: [
    injected(), // MetaMask, Brave Wallet, etc.
    // walletConnect({ projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' }), // If using WalletConnect
  ],
  transports: {
    [flareTestnet.id]: http('https://coston2-api.flare.network/ext/C/rpc', {
      timeout: 30_000,
      retryCount: 3
    }), // Use public RPCs or your own (e.g., via Alchemy/Infura)

    [mainnet.id]: http(),
    [sepolia.id]: http(), // Use public RPCs or your own (e.g., via Alchemy/Infura)
  },
});

// 3. Render the App, wrapped in BOTH providers
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}> {/* Wagmi context */}
      <QueryClientProvider client={queryClient}> {/* TanStack Query context */}
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);