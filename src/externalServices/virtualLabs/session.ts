
// src/app/api/connect/sessionManagement.ts
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;
const ROLLUP_ID = process.env.ROLLUP_ID;
const TUSA_TOKEN = process.env.TUSA_TOKEN;

export async function checkAndCreateSession(walletAddress: string, accessToken: string) {
  console.log("Checking for existing sessions...");
  // Step 1: Check for existing sessions
  const sessionResponse = await fetch(`${VIRTUAL_LABS_API_URL}/session/getSessions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const sessionData = await sessionResponse.json();

  if (!sessionResponse.ok) {
    throw new Error(sessionData.message || 'Failed to retrieve sessions from Virtual Labs');
  }

  // Step 2: Check if any sessions exist for the user
  const userSessions = sessionData.sessions || [];
  if (userSessions.length > 0) {
    console.log('Session already exists for the user:', userSessions);
    return userSessions[0]; // Return the first existing session
  }
  console.log("No existing sessions found.");

  // Step 3: If no sessions exist, create a new session
  const createSessionResponse = await fetch(`${VIRTUAL_LABS_API_URL}/session/createSession`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rollupId: ROLLUP_ID,
      user: walletAddress,
      token: TUSA_TOKEN,
      depositAmount: "0"
    }),
  });

  const createSessionData = await createSessionResponse.json();

  if (!createSessionResponse.ok) {
    throw new Error(createSessionData.message || 'Failed to create session in Virtual Labs');
  }

  return createSessionData;
}
