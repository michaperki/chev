
// src/components/ConnectionStatus.tsx
"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const ConnectionStatus: React.FC = () => {
  // Select connection status and wallet address from Redux state
  const connected = useSelector((state: RootState) => state.user.connected);
  const walletAddress = useSelector((state: RootState) => state.user.walletAddress);

  return (
    <div className="mt-4">
      {connected ? (
        <p className="text-green-500">Connected to: {walletAddress}</p>
      ) : (
        <p className="text-red-500">Not connected</p>
      )}
    </div>
  );
};

export default ConnectionStatus;
