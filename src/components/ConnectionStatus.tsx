// src/components/ConnectionStatus.tsx
"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ConnectionStatus: React.FC = () => {
  const connected = useSelector((state: RootState) => state.user.connected);
  const walletAddress = useSelector((state: RootState) => state.user.walletAddress);
  const userId = useSelector((state: RootState) => state.user.userId); // Access userId from Redux

  return (
    <div className="mt-4">
      {connected ? (
        <div>
          <p className="text-green-500">Connected to: {walletAddress}</p>
          <p className="text-blue-500">User ID: {userId}</p> {/* Display userId */}
        </div>
      ) : (
        <p className="text-red-500">Not connected</p>
      )}
    </div>
  );
};

export default ConnectionStatus;

