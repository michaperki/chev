
"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { connectWallet } from "../../services/auth";
import SessionBalance from "../SessionBalance";
import { connectUser } from "../../slices/user";
import { updateSession } from "../../slices/session";

const Header: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const session = useSelector((state: RootState) => state.session);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      const data = await connectWallet();

      console.log("Connected to wallet:", data);

      // Dispatch Redux actions to store user and session data
      dispatch(
        connectUser({
          walletAddress: data.session.creator,
          userId: data.userId,
          playerId: data.playerId,
        })
      );

      dispatch(
        updateSession({
          sessionId: data.sessionId,
          balance: data.session.balance,
          status: data.session.status,
        })
      );

      setError(null); // Clear errors if connection is successful
    } catch (err) {
      setError("Error connecting to wallet");
      console.error("Error connecting to wallet:", err);
    }
  };

  return (
    <header className="flex justify-between items-center w-full p-4 bg-gray-800 text-white">
      {/* Conditionally render connect button or session details */}
      {!user.connected ? (
        <button
          onClick={handleConnectWallet}  // Connect wallet only when the button is clicked
          className="bg-blue-500 text-white p-2"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center space-x-4">
          <p>Connected as: {user.walletAddress}</p>
          <div className="flex items-center space-x-2">
            <p>Session ID: {session.sessionId}</p>
            <p>Player ID: {user.playerId}</p>
          </div>
          <SessionBalance /> {/* Show session balance when connected */}
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </header>
  );
};

export default Header;

