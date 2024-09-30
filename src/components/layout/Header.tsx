
"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { connectWallet } from "@/services/auth";
import { initiateLichessLogin } from "@/externalServices/lichess/lichessAuth";
import { useSelector, useDispatch } from "react-redux";
import { setLichessData, connectUser } from "@/slices/user";

const Header = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const dispatch = useDispatch();

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
      setWalletAddress(storedWalletAddress);

      // Update the wallet in Redux if it's not already there
      if (!reduxWalletAddress) {
        dispatch(connectUser({ walletAddress: storedWalletAddress }));
      }

      // If wallet is connected but Lichess token isn't in Redux, fetch from backend
      if (!lichessToken) {
        fetch(`/api/lichess/token?walletAddress=${storedWalletAddress}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.lichessToken) {
              dispatch(setLichessData({ lichessAccessToken: data.lichessToken }));
            }
          })
          .catch((error) => console.error("Failed to fetch Lichess token:", error));
      }
    }
  }, [reduxWalletAddress, lichessToken, dispatch]);

  const handleConnectWallet = async () => {
    try {
      const data = await connectWallet();
      if (data) {
        Cookies.set("wallet_address", data.session.creator);
        setWalletConnected(true);
        setWalletAddress(data.session.creator);
        dispatch(connectUser({ walletAddress: data.session.creator }));
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
            onClick={initiateLichessLogin}
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

