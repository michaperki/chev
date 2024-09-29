
export async function depositIntoSession(walletAddress: string, sessionId: string, depositAmount: number) {
  console.log("Depositing into session", walletAddress, sessionId, depositAmount);

  const response = await fetch('/api/session/deposit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ walletAddress, sessionId, depositAmount }), // Use walletAddress instead of userId or playerId
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to deposit into session');
  }

  return data;
}

