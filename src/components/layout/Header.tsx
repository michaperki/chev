
"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { connectWallet } from "../../services/auth";
import { useSelector } from "react-redux";
import router from "next/router";

const Header = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Access wallet and Lichess token from Redux
  const reduxWalletAddress = useSelector((state: any) => state.user.walletAddress);
  const lichessToken = useSelector((state: any) => state.user.lichessAccessToken);

  useEffect(() => {
    let storedWalletAddress = reduxWalletAddress;

    if (!storedWalletAddress) {
      // If Redux doesn't have the wallet, try fetching it from cookies
      storedWalletAddress = Cookies.get("wallet_address");
    }

    if (storedWalletAddress) {
      setWalletConnected(true);
      setWalletAddress(storedWalletAddress); // Set the wallet address
    }

  }, [reduxWalletAddress]);

  const handleConnectWallet = async () => {
    try {
      const data = await connectWallet(); // Assuming this connects and updates Redux

      if (data) {
        // Save to cookies with consistent naming
        Cookies.set("wallet_address", data.session.creator);
        setWalletConnected(true);
        setWalletAddress(data.session.creator); // Update the wallet address state from the backend
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1>My App</h1>
      <div className="flex space-x-4">
        {!walletConnected && (
          <button
            onClick={handleConnectWallet}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
        {walletConnected && <p>Wallet: {walletAddress}</p>}

        {!lichessToken && (
          <button
            onClick={() => router.push("/lichess/login")} // Triggers the Lichess login flow
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Authenticate with Lichess
          </button>
        )}
        {lichessToken && <p>Lichess Connected</p>}
      </div>
    </header>
  );
};

export default Header;

