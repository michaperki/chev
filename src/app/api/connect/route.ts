
import { authenticateWithVirtualLabs } from './authenticateUser';
import { createPlayerInVirtualLabs } from './playerManagement';
import { checkAndCreateSession } from './sessionManagement';
import { upsertUserAndToken } from './userManagement'; // Import this

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Return the userId, playerId, and sessionId to the client
    return NextResponse.json({
      success: true,
      userId: user.id,
      playerId: player._id,    // Return the player _id from Virtual Labs
      sessionId: session._id,  // Return the session _id from Virtual Labs
      session,
    });
  } catch (error) {
    console.error('Error during connection:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

