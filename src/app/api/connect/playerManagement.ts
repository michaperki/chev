
// src/app/api/connect/playerManagement.ts
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;
const ROLLUP_ID = process.env.ROLLUP_ID;

export async function createPlayerInVirtualLabs(walletAddress: string, accessToken: string) {
  const createPlayerResponse = await fetch(`${VIRTUAL_LABS_API_URL}/player/cheth/createPlayer`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rollupId: ROLLUP_ID,
      address: walletAddress,
    }),
  });

  const createPlayerData = await createPlayerResponse.json();

  if (!createPlayerResponse.ok) {
    throw new Error(createPlayerData.message || 'Failed to create player in Virtual Labs');
  }

  return createPlayerData;
}
