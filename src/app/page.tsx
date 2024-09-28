
// src/app/page.tsx
"use client";

import React, { useState } from "react";
import { useAppDispatch } from "../hooks/redux";
import { connectWallet } from "../services/auth";
import { login } from "../slices/user";

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const handleConnectWallet = async () => {
    try {
      const { success, walletAddress } = await connectWallet();
      if (success) {
        dispatch(login(walletAddress));
      } else {
        setError("Connection failed");
      }
    } catch (err) {
      setError("An error occurred while connecting to MetaMask");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl">Connect your wallet</h1>
      <button
        onClick={handleConnectWallet}
        className="bg-blue-500 text-white p-2 mt-4"
      >
        Connect Wallet
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

