// src/services/participant.ts
export async function createParticipant(userId: string, playerId: string, sessionId: string, sessionBalance: number) {
  console.log("Creating or fetching participant for playerId:", playerId, "sessionId:", sessionId);
  console.log("userId:", userId);
  console.log("sessionBalance:", sessionBalance);
  
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
