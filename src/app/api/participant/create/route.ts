
// src/app/api/participant/create/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; // Import Prisma Client
import { createPlayerInVirtualLabs } from '../../../../externalServices/virtualLabs/player'; // Import the refactored function
import { createOrFetchParticipant } from '../../../../externalServices/virtualLabs/participant';

const prisma = new PrismaClient(); // Initialize Prisma Client

export async function POST(request: Request) {
  const { sessionId, sessionBalance, userId } = await request.json();
  console.log('POST request received to create participant');
  console.log(`Session ID: ${sessionId}`);
  console.log(`Session Balance: ${sessionBalance}`);
  console.log(`User ID: ${userId}`);

  if (!sessionId || !sessionBalance || !userId) {
    return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Step 1: Retrieve the walletAddress and accessToken from the user and token tables
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const tokenRecord = await prisma.token.findFirst({
      where: { userId: user.id },
      select: { accessToken: true },
    });

    if (!tokenRecord?.accessToken) {
      return NextResponse.json({ success: false, message: 'Access token not found' }, { status: 404 });
    }

    const walletAddress = user.wallet; // Assuming user has the `wallet` field
    const accessToken = tokenRecord.accessToken;

    console.log(`Wallet address: ${walletAddress}`);
    console.log(`Access token: ${accessToken}`);

    // Step 2: Use the walletAddress and accessToken to create or retrieve the player ID
    const player = await createPlayerInVirtualLabs(walletAddress, accessToken);

    // a string of emoji characters
    console.log(' ✅ ');

    console.log(`Player ID: ${player._id}`);

    // Step 3: Create or fetch the participant using the playerId, sessionId, and sessionBalance
    const participant = await createOrFetchParticipant(player._id, sessionId, sessionBalance, userId);

    return NextResponse.json({ 
      success: true, 
      participant 
    });

  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

