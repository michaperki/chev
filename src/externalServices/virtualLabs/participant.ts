
import { getAccessTokenForUser } from '@/repositories/user'; // New file for Prisma DB logic

const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;

export async function createOrFetchParticipant(playerId: string, sessionId: string, sessionBalance: number, userId: number) {
  console.log(`Creating or fetching participant for player ID: ${playerId} and session ID: ${sessionId}`);

  try {
    // Get bearer token using a helper function (decoupling Prisma logic)
    const bearerToken = await getAccessTokenForUser(userId);

    if (!bearerToken) {
      throw new Error('User or token not found');
    }

    // Call the createParticipant endpoint in Virtual Labs
    const participantResponse = await fetch(`${VIRTUAL_LABS_API_URL}/participant/createParticipant`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        _playerId: playerId,
        _sessionId: sessionId,
        sessionBalance,
        active: true,
      }),
    });

    const participantData = await participantResponse.json();

    if (!participantResponse.ok) {
      throw new Error(participantData.message || 'Failed to create participant');
    }

    console.log(`Participant created or retrieved successfully: ${JSON.stringify(participantData)}`);

    return {
      _id: participantData._id,  // Participant ID
      balance: participantData.sessionBalance,
      ...participantData,
    };
  } catch (error) {
    console.error('Error creating participant:', error);
    throw error;
  }
}

