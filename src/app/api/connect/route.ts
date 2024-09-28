
// src/app/api/connect/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;

export async function POST(request: Request) {
  const { walletAddress, signature, message } = await request.json();

  if (!walletAddress || !signature || !message) {
    return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Send walletAddress, signature, and message to Virtual Labs endpoint
    const virtualLabsResponse = await fetch(`${VIRTUAL_LABS_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wallet: walletAddress,
        message,
        signature,
      }),
    });

    const virtualLabsData = await virtualLabsResponse.json();

    if (!virtualLabsResponse.ok) {
      throw new Error(virtualLabsData.message || 'Failed to authenticate with Virtual Labs');
    }

    const { accessToken } = virtualLabsData;

    // Find or create the user by wallet address
    const user = await prisma.user.upsert({
      where: { wallet: walletAddress },
      update: {}, // No need to update the user data
      create: { wallet: walletAddress },
    });

    // Check if the token for the user exists using the relation
    const existingToken = await prisma.token.findFirst({
      where: {
        user: {
          id: user.id, // Reference the user relation
        },
      },
    });

    if (existingToken) {
      // Token exists, update it
      await prisma.token.update({
        where: { id: existingToken.id },
        data: { accessToken },
      });
    } else {
      // Token does not exist, create a new one
      await prisma.token.create({
        data: {
          accessToken,
          userId: user.id,
        },
      });
    }

    // Return success to the frontend
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error during Virtual Labs authentication:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

