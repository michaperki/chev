
// src/services/session.ts

export async function depositIntoSession(userId: string, walletAddress: string, sessionId: string, depositAmount: number) {
  console.log("depositing into session", userId, walletAddress, sessionId, depositAmount);

  // Step 1: Deposit into the session
  const depositResponse = await fetch('/api/session/deposit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, walletAddress, sessionId, depositAmount }),
  });

  const depositData = await depositResponse.json();
  
  if (!depositResponse.ok) {
    throw new Error(depositData.message || 'Failed to deposit into session');
  }

  return depositData;
}

export async function createParticipant(userId: string, playerId: string, sessionId: string, sessionBalance: number) {
  console.log("Creating or fetching participant for playerId:", playerId, "sessionId:", sessionId);
  
  const response = await fetch('/api/participant/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,        // Send userId to the backend to retrieve bearer token
      playerId,
      sessionId,
      sessionBalance,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create or fetch participant');
  }

  return data;
}
