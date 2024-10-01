
import { useEffect, useState } from 'react';
import ChessGround from 'chessground';
import 'chessground/dist/chessground.css';

export default function GamePage({ params }: { params: { matchId: string } }) {
  const [match, setMatch] = useState(null);
  const [game, setGame] = useState(null);

  useEffect(() => {
    async function fetchMatchData() {
      const res = await fetch(`/api/game/${params.matchId}`);
      const data = await res.json();
      setMatch(data);
    }

    fetchMatchData();
  }, [params.matchId]);

  useEffect(() => {
    if (match) {
      const board = ChessGround(document.getElementById('chessboard'), {
        orientation: 'white', // For simplicity, could make dynamic later
        turnColor: 'white',
      });
      setGame(board);
    }
  }, [match]);

  return (
    <div>
      <h1>Match {params.matchId}</h1>
      <div id="chessboard" style={{ width: '500px', height: '500px' }}></div>
    </div>
  );
}
