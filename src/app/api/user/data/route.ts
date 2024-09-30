
// src/app/api/user/data.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { checkAndCreateSession } from '../../../../services/virtualLabs/session';
import { checkAndReturnLichessToken } from '../../../../services/lichess';
import { createOrFetchParticipant } from '../../../../services/virtualLabs/participant';
import { createPlayerInVirtualLabs } from '../../../../services/virtualLabs/player'; // Import player management logic

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const walletAddress = url.searchParams.get('walletAddress'); // Get wallet address from query

  if (!walletAddress) {
    return NextResponse.json({ success: false, message: 'Missing wallet address' }, { status: 400 });
  }

  try {
    // Step 1: Get the user from the database
    const user = await prisma.user.findUnique({
      where: { wallet: walletAddress },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Step 2: Retrieve the access token from the tokens table
    const tokenRecord = await prisma.token.findFirst({
      where: { userId: user.id },
      select: { accessToken: true },
    });
    const accessToken = tokenRecord?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ success: false, message: 'Access token not found' }, { status: 404 });
    }

    // Step 4: Fetch or create the session using Virtual Labs API
    const session = await checkAndCreateSession(walletAddress, accessToken);
    
    if (!session || !session._id || !session.balance) {
      return NextResponse.json({ success: false, message: 'Session creation failed' }, { status: 500 });
    }

    // Step 3: Create or fetch the player in Virtual Labs
    const player = await createPlayerInVirtualLabs(walletAddress, accessToken);
    if (!player || !player._id) {
      return NextResponse.json({ success: false, message: 'Player creation failed' }, { status: 500 });
    }

    // Step 5: Fetch or create the participant using playerId and sessionId
    const participant = await createOrFetchParticipant(player._id, session._id, session.balance, user.id);

    // Step 6: Check if Lichess token exists
    const lichessToken = await checkAndReturnLichessToken(walletAddress);

    console.log('Session:', session);
    console.log('Lichess token:', lichessToken);
    console.log('User:', user);
    console.log('Participant:', participant);

    // Step 7: Return the user data including session, participant, and Lichess token
    return NextResponse.json({
      success: true,
      walletAddress,
      userId: user.id,
      sessionId: session._id,
      participantId: participant._id,
      balance: session.balance,
      lichessToken,
    });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

