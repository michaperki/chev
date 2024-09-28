
"use client";

import React, { useState } from "react";
import { connectWallet } from "../services/auth";
import ConnectionStatus from "../components/ConnectionStatus";
import { fetchRollupFromBackend } from "../services/rollup"; // Import rollup fetching service

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null); // Track wallet address state
  const [rollupData, setRollupData] = useState<any | null>(null); // Track rollup data state

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      const { success, walletAddress } = await connectWallet();
      if (success) {
        setWalletAddress(walletAddress); // Store wallet address in state
        setError(null); // Clear any previous errors
        // Fetch rollup data after connection
        await handleFetchRollup(walletAddress);
      } else {
        setError("Connection failed");
      }
    } catch (err) {
      setError("An error occurred while connecting to MetaMask");
    }
  };

  // Handle rollup fetching after wallet is connected
  const handleFetchRollup = async (userId: string) => {
    try {
      const data = await fetchRollupFromBackend(userId); // Fetch rollup using backend route
      setRollupData(data.data); // Store rollup data
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Failed to fetch rollup data");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl">Connect your wallet</h1>

      {/* Button to Connect Wallet */}
      <button
        onClick={handleConnectWallet}
        className="bg-blue-500 text-white p-2 mt-4"
      >
        Connect Wallet
      </button>

      {/* Display any error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display the connected wallet address */}
      {walletAddress && (
        <p className="text-green-500 mt-2">Connected as: {walletAddress}</p>
      )}

      {/* Display the connection status */}
      <ConnectionStatus />

      {/* Display rollup data if available */}
      {rollupData && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Rollup Data</h2>
          <pre>{JSON.stringify(rollupData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

