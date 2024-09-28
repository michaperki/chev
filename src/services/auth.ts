
// src/services/auth.ts
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

    // Send the wallet address, signature, and message to your API
    const response = await fetch('/api/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress, signature, message }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("MetaMask connection failed", error);
    throw error;
  }
}

