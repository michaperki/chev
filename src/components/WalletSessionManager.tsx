
"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { connectWallet } from "../services/auth";
import { connectUser } from "../slices/user";
import { updateSession } from "../slices/session";

const WalletSessionManager: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Only connect if no user is connected
    if (!user.connected) {
      const handleConnectWallet = async () => {
        try {
          const data = await connectWallet();
          // Dispatch the user and session data to Redux
          dispatch(
            connectUser({
              walletAddress: data.walletAddress,
              userId: data.userId,
              virtualUserId: data.user,
            })
          );
          dispatch(
            updateSession({
              virtualSessionId: data.sessionId,
              balance: data.session.balance,
              status: data.session.status,
            })
          );
        } catch (error) {
          console.error("MetaMask connection failed", error);
        }
      };

      // Trigger connection logic
      handleConnectWallet();
    }
  }, [user.connected, dispatch]);

  return null; // This component handles connection, no UI needed
};

export default WalletSessionManager;

