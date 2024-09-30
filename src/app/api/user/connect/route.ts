
import { authenticateWithVirtualLabs } from '../../../services/virtualLabs/user';
import { createPlayerInVirtualLabs } from '../../../services/virtualLabs/player';
import { checkAndCreateSession } from '../../../services/virtualLabs/session';
import { upsertUserAndToken } from '../../../services/user'; // Import this
import { checkAndReturnLichessToken } from '../../../services/lichess';

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { walletAddress, signature, message } = await request.json();

  if (!walletAddress || !signature || !message) {
    return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Authenticate with Virtual Labs and get an access token
    const accessToken = await authenticateWithVirtualLabs(walletAddress, signature, message);
    console.log('Access token received:', accessToken);

    // Upsert user and token
    const user = await upsertUserAndToken(walletAddress, accessToken);
    console.log('User successfully upserted:', user);

    // Create or retrieve player information from Virtual Labs
    const player = await createPlayerInVirtualLabs(walletAddress, accessToken);
    console.log('Player created or retrieved:', player);

    // Check for existing sessions or create one if none exist
    const session = await checkAndCreateSession(walletAddress, accessToken);
    console.log('Session created or retrieved:', session);

    // Check if the user has a Lichess token
    const lichessToken = await checkAndReturnLichessToken(walletAddress);
    console.log('Lichess token:', lichessToken);

    // Return the userId, playerId, sessionId, and lichessToken (if available) to the client
    return NextResponse.json({
      success: true,
      userId: user.id,
      playerId: player._id,    // Return the player _id from Virtual Labs
      sessionId: session._id,  // Return the session _id from Virtual Labs
      session,
      lichessToken,            // Return the Lichess token if available
    });
  } catch (error) {
    console.error('Error during connection:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

