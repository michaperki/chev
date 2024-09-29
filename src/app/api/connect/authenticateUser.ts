
// src/app/api/connect/authenticateUser.ts
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;

export async function authenticateWithVirtualLabs(walletAddress: string, signature: string, message: string) {
  const virtualLabsResponse = await fetch(`${VIRTUAL_LABS_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      wallet: walletAddress,
      message,
      signature,
    }),
  });

  const virtualLabsData = await virtualLabsResponse.json();
  if (!virtualLabsResponse.ok) {
    throw new Error(virtualLabsData.message || 'Failed to authenticate with Virtual Labs');
  }

  return virtualLabsData.accessToken;
}
