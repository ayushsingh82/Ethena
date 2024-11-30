import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';

// Create a public client
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

// Create a wallet client
export const walletClient = createWalletClient({
  chain: sepolia,
  transport: http()
}); 