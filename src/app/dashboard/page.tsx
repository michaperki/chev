
// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectUser, setLichessData } from "../../slices/user"; // Import the Redux actions
import { updateSession } from "../../slices/session";
import { updateParticipant } from "../../slices/participant";
import DepositForm from "../../components/DepositForm";
import ReduxStateDisplay from "../../components/ReduxStateDisplay";
import Cookies from "js-cookie";

const Dashboard = () => {
  const dispatch = useDispatch();
  const walletAddress = useSelector((state: any) => state.user.walletAddress);

  useEffect(() => {
    const storedWalletAddress = walletAddress || Cookies.get("wallet_address");

    if (storedWalletAddress) {
      // Call the new route to fetch user data
      fetch(`/api/user/data?walletAddress=${storedWalletAddress}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Update Redux with user, session, and Lichess token data
            dispatch(connectUser({
              walletAddress: data.walletAddress,
              userId: data.userId,
            }));

            dispatch(updateSession({
              sessionId: data.sessionId,
              balance: data.balance,
              status: 'Active', // Assuming the session is active after fetching
            }));

            dispatch(updateParticipant({
              participantId: data.participantId,
              balance: data.balance,
            }));

            if (data.lichessToken) {
              dispatch(setLichessData({ lichessAccessToken: data.lichessToken }));
            }
          }
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, [walletAddress, dispatch]);

  const reduxState = useSelector((state: any) => state); // Get the entire Redux state

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>This is the dashboard after a successful Lichess login.</p>
      <ReduxStateDisplay /> {/* Display the Redux state */}
      <DepositForm /> {/* Display the DepositForm component */}
    </div>
  );
};

export default Dashboard;

