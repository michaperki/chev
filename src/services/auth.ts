
// src/services/auth.ts
import { store } from '../store';
import { connectUser, setLichessData } from '../slices/user';
import Cookies from "js-cookie"; // Import js-cookie for reading cookies
import { updateSession } from '../slices/session';

// Function to connect wallet (as it already exists)
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

    const response = await fetch('/api/user/connect', {
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

    // Save wallet address in cookies
    Cookies.set("wallet_address", data.session.creator); 

    // Store user data in Redux
    store.dispatch(connectUser({
      walletAddress: data.session.creator,
      userId: data.userId, 
      playerId: data.playerId, 
    }));

    // Store session data in Redux
    store.dispatch(updateSession({
      sessionId: data.sessionId,
      balance: data.session.balance,
      status: data.session.status,
    }));

    // Store Lichess token in Redux if available
    if (data.lichessToken) {
      store.dispatch(setLichessData({
        lichessAccessToken: data.lichessToken,
      }));
    }

    return data;
  } catch (error) {
    console.error("MetaMask connection failed", error);
    throw error;
  }
}

// Function to restore wallet from cookies (call this on app load)
export function restoreWalletFromCookies() {
  const walletAddress = Cookies.get("wallet_address");

  if (walletAddress) {
    // Restore wallet address in Redux if it exists in cookies
    store.dispatch(connectUser({
      walletAddress,
    }));
  }
}

