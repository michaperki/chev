
// src/app/api/rollup/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;

export async function POST(request: Request) {
  console.log('POST request to /api/rollup received.');
  const { userId } = await request.json();

  if (!userId) {
    return NextResponse.json({ success: false, message: 'Missing user ID' }, { status: 400 });
  }

  try {
    // Retrieve the user's bearer token from the database
    const userWithToken = await prisma.user.findUnique({
      where: { id: userId },
      include: { tokens: true },
    });

    if (!userWithToken || !userWithToken.tokens[0]?.accessToken) {
      return NextResponse.json({ success: false, message: 'User or token not found' }, { status: 404 });
    }

    const bearerToken = userWithToken.tokens[0].accessToken;

    // Make the request to Virtual Labs to get the rollup data
    const rollupResponse = await fetch(`${VIRTUAL_LABS_API_URL}/v1/rollup/getRollup`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    const rollupData = await rollupResponse.json();

    if (!rollupResponse.ok) {
      throw new Error(rollupData.message || 'Failed to fetch rollup');
    }

    // Return the rollup data to the client
    return NextResponse.json({ success: true, data: rollupData });
  } catch (error) {
    console.error('Error fetching rollup:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
