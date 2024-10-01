
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;

export async function createBet(player1: any, player2: any, wagerAmount: number) {
  const response = await fetch(`${VIRTUAL_LABS_API_URL}/bet/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      player1,
      player2,
      wagerAmount,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create bet');
  }

  return data;
}
