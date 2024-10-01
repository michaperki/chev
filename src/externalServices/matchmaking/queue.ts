
const matchmakingQueue: { walletAddress: string, wagerAmount: number }[] = [];

export function addPlayerToQueue(walletAddress: string, wagerAmount: number) {
  matchmakingQueue.push({ walletAddress, wagerAmount });
  console.log(`Player added to queue: ${walletAddress} with wager ${wagerAmount}`);
  return findMatch();
}

export function findMatch() {
  if (matchmakingQueue.length >= 2) {
    const [player1, player2] = matchmakingQueue.splice(0, 2);
    console.log(`Match found: ${player1.walletAddress} vs ${player2.walletAddress}`);
    return { player1, player2 };
  }
  console.log('Waiting for more players...');
  return null;
}
