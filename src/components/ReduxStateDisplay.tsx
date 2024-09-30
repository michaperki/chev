
// src/components/ReduxStateDisplay.tsx
"use client";

import { useSelector } from "react-redux";

const ReduxStateDisplay = () => {
  const user = useSelector((state: any) => state.user);
  const participant = useSelector((state: any) => state.participant);
  const session = useSelector((state: any) => state.session);

  return (
    <div className="p-4 rounded-lg shadow-md mt-4">
      <h2 className="text-xl mb-2">Redux State</h2>

      <h3 className="font-semibold">User Information</h3>
      <p>Wallet Address: {user.walletAddress || "Not Connected"}</p>
      <p>User ID: {user.userId || "N/A"}</p>
      <p>Player ID: {user.playerId || "N/A"}</p>
      <p>Lichess Access Token: {user.lichessAccessToken ? "Token Present" : "N/A"}</p>
      <p>Connected: {user.connected ? "Yes" : "No"}</p>

      <h3 className="font-semibold mt-2">Participant Information</h3>
      <p>Participant ID: {participant.participantId || "N/A"}</p>
      <p>Balance: {participant.balance || "N/A"}</p>

      <h3 className="font-semibold mt-2">Session Information</h3>
      <p>Session ID: {session.sessionId || "N/A"}</p>
      <p>Balance: {session.balance || "N/A"}</p>
      <p>Status: {session.status || "N/A"}</p>
    </div>
  );
};

export default ReduxStateDisplay;
