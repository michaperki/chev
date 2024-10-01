
import { NextResponse } from 'next/server';
import { createBet } from '../../../../externalServices/virtualLabs/bet';

const confirmations = {};

export async function POST(request: Request) {
  const { matchId, walletAddress, wagerAmount } = await request.json();

  if (!confirmations[matchId]) {
    confirmations[matchId] = { player1: null, player2: null };
  }

  if (!confirmations[matchId].player1) {
    confirmations[matchId].player1 = { walletAddress, wagerAmount };
  } else if (!confirmations[matchId].player2) {
    confirmations[matchId].player2 = { walletAddress, wagerAmount };
  }

  if (confirmations[matchId].player1 && confirmations[matchId].player2) {
    const { player1, player2 } = confirmations[matchId];
    const bet = await createBet(player1, player2, player1.wagerAmount);
    return NextResponse.json({ success: true, bet });
  }

  return NextResponse.json({ success: true, message: 'Waiting for other player to confirm' });
}
