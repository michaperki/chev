
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;

export async function resolveBet(matchId: string, result: string) {
  const response = await fetch(`${VIRTUAL_LABS_API_URL}/bet/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matchId, result }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to resolve bet');
  }

  return data;
}
