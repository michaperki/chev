
// src/services/auth.ts
import { store } from '../store/store'; // Import the Redux store
import { connectUser } from '../slices/user'; // Import the Redux action

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    // Request the user's MetaMask accounts
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const walletAddress = accounts[0]; // Get the first account (default account)
    const message = `Login to VirtualLabs`; // Message to sign

    // Request the user to sign the message using MetaMask
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, walletAddress],
    });

    // Send the wallet address, signature, and message to the backend API
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

    // Dispatch the Redux action to update the user's state
    store.dispatch(
      connectUser({
        walletAddress,     // Store the wallet address
        accessToken: data.accessToken, // Store the access token returned from the backend
      })
    );

    return data; // Return the data for further use if needed
  } catch (error) {
    console.error("MetaMask connection failed", error);
    throw error;
  }
}

