import { NextResponse } from 'next/server';

// src/app/api/participant/[sessionId]/route.ts
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;

export async function GET(request: Request, { params }: { params: { sessionId: string } }) {
  const { sessionId } = params;

  try {
    // Fetch participant details using the sessionId
    const participantResponse = await fetch(`${VIRTUAL_LABS_API_URL}/getParticipant/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const participantData = await participantResponse.json();

    if (!participantResponse.ok) {
      throw new Error(participantData.message || 'Failed to fetch participant details');
    }

    return NextResponse.json({ success: true, participant: participantData });
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
