
// src/services/rollup.ts
export async function fetchRollupFromBackend(userId: string) {
  const response = await fetch('/api/rollup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch rollup');
  }

  return data;
}
