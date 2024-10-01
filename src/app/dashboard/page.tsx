// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectUser, setLichessData } from "../../slices/user"; // Redux actions
import { updateSession } from "../../slices/session";
import { updateParticipant } from "../../slices/participant";
import DepositForm from "../../components/DepositForm";
import ReduxStateDisplay from "../../components/ReduxStateDisplay";
import Cookies from "js-cookie";
import { addPlayerToQueue } from "../../externalServices/matchmaking/queue"; // Matchmaking queue
import WagerConfirmationModal from "../../components/Matchmaking/WagerConfirmationModal"; // Wager confirmation component
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const walletAddress = useSelector((state: any) => state.user.walletAddress);
  const [wagerAmount, setWagerAmount] = useState<number>(0); // Wager amount state
  const [matchInfo, setMatchInfo] = useState<any>(null); // Store match info after matchmaking
  const [matchmakingStatus, setMatchmakingStatus] = useState<string>(''); // Matchmaking status
  
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
              playerId: data.playerId,
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

  // Handler to join the matchmaking queue
  const handleJoinQueue = () => {
    if (!walletAddress || wagerAmount <= 0) {
      alert("Please connect your wallet and enter a valid wager amount.");
      return;
    }

    const match = addPlayerToQueue(walletAddress, wagerAmount);
    if (match) {
      setMatchInfo(match);
      setMatchmakingStatus('Match found, awaiting wager confirmation');
    } else {
      setMatchmakingStatus('Added to queue, waiting for a match...');
    }
  };

  // Handle wager confirmation
  const handleConfirmWager = () => {
    fetch('/api/matchmaking/wager/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matchId: `${matchInfo.player1.walletAddress}-${matchInfo.player2.walletAddress}`,
        walletAddress,
        wagerAmount,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMatchmakingStatus('Wager confirmed, redirecting to game...');
          router.push(`/game/${data.bet.matchId}`); // Redirect to the game page
        }
      })
      .catch((error) => {
        console.error("Error confirming wager:", error);
        setMatchmakingStatus('Error confirming wager');
      });
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>This is the dashboard after a successful Lichess login.</p>

      <ReduxStateDisplay /> {/* Display the Redux state */}
      <DepositForm /> {/* Display the DepositForm component */}

      {/* Matchmaking form */}
      <div>
        <h2>Enter Matchmaking</h2>
        <input
          type="number"
          placeholder="Enter wager amount"
          value={wagerAmount}
          onChange={(e) => setWagerAmount(Number(e.target.value))}
        />
        <button onClick={handleJoinQueue}>Join Queue</button>
        <p>{matchmakingStatus}</p>
      </div>

      {/* Wager Confirmation Modal */}
      {matchInfo && (
        <WagerConfirmationModal
          matchInfo={matchInfo}
          onConfirm={handleConfirmWager}
        />
      )}
    </div>
  );
};

export default Dashboard;

