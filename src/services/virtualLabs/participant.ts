
// src/services/virtualLabs/participant.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;

export async function createOrFetchParticipant(playerId: string, sessionId: string, sessionBalance: number, userId: number) {
  console.log(`Creating or fetching participant for player ID: ${playerId} and session ID: ${sessionId}`);

  try {
    // Fetch the user using the correct userId type (integer)
    const userWithToken = await prisma.user.findUnique({
      where: { id: userId }, // Ensure `userId` is an integer
      include: { tokens: true },
    });

    if (!userWithToken || !userWithToken.tokens[0]?.accessToken) {
      throw new Error('User or token not found');
    }

    const bearerToken = userWithToken.tokens[0].accessToken;

    // Call the createParticipant endpoint
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

    const participantData = await participantResponse.json();

    if (!participantResponse.ok) {
      throw new Error(participantData.message || 'Failed to create participant');
    }

    console.log(`Participant created or retrieved successfully: ${JSON.stringify(participantData)}`);

    return {
      _id: participantData._id,  // ID of the participant
      balance: participantData.sessionBalance,
      ...participantData,
    };
  } catch (error) {
    console.error('Error creating participant:', error);
    throw error;
  }
}

