
"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { connectWallet } from "../../services/auth";
import { useSelector, useDispatch } from "react-redux";
import { setLichessData } from "../../slices/user"; // Redux action to store Lichess token
import { initiateLichessLogin, fetchLichessToken } from "../../services/lichessAuth";

const Header = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const dispatch = useDispatch();

  // Access wallet and Lichess token from Redux
  const reduxWalletAddress = useSelector((state: any) => state.user.walletAddress);
  const lichessToken = useSelector((state: any) => state.user.lichessAccessToken);

  useEffect(() => {
    console.log("Redux Wallet Address:", reduxWalletAddress);
    console.log("Lichess Token:", lichessToken);

    let storedWalletAddress = reduxWalletAddress;

    if (!storedWalletAddress) {
      // If Redux doesn't have the wallet, try fetching it from cookies
      storedWalletAddress = Cookies.get("wallet_address");
    }

    if (storedWalletAddress) {
      setWalletConnected(true);
      setWalletAddress(storedWalletAddress); // Set the wallet address

      // If we have the wallet but no Lichess token in Redux, check the backend
      if (!lichessToken) {
        fetchLichessToken(storedWalletAddress).then((token) => {
          if (token) {
            dispatch(setLichessData({ lichessAccessToken: token })); // Update Redux with the Lichess token
          }
        });
      }
    }
  }, [reduxWalletAddress, lichessToken, dispatch]);

  const handleConnectWallet = async () => {
    try {
      const data = await connectWallet(); // Connect the wallet and update Redux

      if (data) {
        Cookies.set("wallet_address", data.session.creator); // Store wallet in cookies
        setWalletConnected(true);
        setWalletAddress(data.session.creator); // Update state
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
            onClick={initiateLichessLogin} // Triggers Lichess login flow
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

