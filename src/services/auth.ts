
// src/services/auth.ts
import { store } from '../store/store';
import { connectUser } from '../slices/user';
import { updateSession } from '../slices/session';

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const walletAddress = accounts[0];
    const message = `Login to VirtualLabs`;

    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, walletAddress],
    });

    const response = await fetch('/api/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress, signature, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to connect');
    }

    console.log("Connected to wallet:", data);

    // Store userId and playerId in Redux
    store.dispatch(connectUser({
      walletAddress: data.session.creator,
      userId: data.userId, // Store local userId (from Prisma)
      playerId: data.playerId, // Store Virtual Labs playerId
    }));

    // Store session data in Redux
    store.dispatch(updateSession({
      sessionId: data.sessionId,
      balance: data.session.balance,
      status: data.session.status,
    }));

    return data;
  } catch (error) {
    console.error("MetaMask connection failed", error);
    throw error;
  }
}

