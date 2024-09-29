
// src/app/api/participant/create/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;

export async function POST(request: Request) {
  const { playerId, sessionId, sessionBalance, userId } = await request.json();
  console.log(`Creating or fetching participant for player ID: ${playerId} and session ID: ${sessionId}`);

  if (!playerId || !sessionId || !sessionBalance || !userId) {
    return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Step 1: Retrieve the access token from the database using the user ID
    const userWithToken = await prisma.user.findUnique({
      where: { id: userId },
      include: { tokens: true },
    });

    if (!userWithToken || !userWithToken.tokens[0]?.accessToken) {
      return NextResponse.json({ success: false, message: 'User or token not found' }, { status: 404 });
    }

    const bearerToken = userWithToken.tokens[0].accessToken;

    // Step 2: Call the createParticipant endpoint
    const participantResponse = await fetch(`${VIRTUAL_LABS_API_URL}/participant/createParticipant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _playerId: playerId,
        _sessionId: sessionId,
        sessionBalance: sessionBalance,
        active: true,
      }),
    });

    // Step 3: Check if the request was successful
    const participantData = await participantResponse.json();

    if (!participantResponse.ok) {
      console.error(`Error creating participant: ${participantData.message || participantData}`);
      return NextResponse.json({ success: false, message: participantData.message || 'Failed to create participant' }, { status: participantResponse.status });
    }

    // Step 4: Return the participant data
    console.log(`Participant created or retrieved successfully: ${JSON.stringify(participantData)}`);
    return NextResponse.json({ 
      success: true, 
      participant: { 
        _id: participantData._id, // This is the ID we need
        balance: participantData.sessionBalance, 
        ...participantData 
      } 
    });

  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

