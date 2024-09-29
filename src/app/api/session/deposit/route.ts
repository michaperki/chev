
// src/app/api/deposit/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const VIRTUAL_LABS_API_URL = process.env.VIRTUAL_LABS_API_URL;

export async function POST(request: Request) {
  console.log('POST request to /deposit received.');
  const { sessionId, walletAddress, depositAmount } = await request.json(); // Update parameter to walletAddress
  console.log('sessionId:', sessionId);
  console.log('walletAddress:', walletAddress); // Log wallet address
  console.log('depositAmount:', depositAmount);

  if (!sessionId || !walletAddress || !depositAmount) {
    return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Retrieve access token for the user from the database using the wallet address
    const userWithToken = await prisma.user.findUnique({
      where: { wallet: walletAddress }, // Use wallet address to find user in Prisma
      include: { tokens: true },
    });

    if (!userWithToken || !userWithToken.tokens[0]?.accessToken) {
      return NextResponse.json({ success: false, message: 'User or token not found' }, { status: 404 });
    }

    const bearerToken = userWithToken.tokens[0].accessToken;

    // Make the request to deposit into the session using the Virtual Labs API
    const depositResponse = await fetch(`${VIRTUAL_LABS_API_URL}/session/depositIntoSession`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        depositAmount,
        user: walletAddress, // Send walletAddress as the user to Virtual Labs
      }),
    });

    const depositData = await depositResponse.json();

    if (!depositResponse.ok) {
      throw new Error(depositData.message || 'Failed to deposit into session');
    }

    return NextResponse.json({ success: true, deposit: depositData });
  } catch (error) {
    console.error('Error during deposit:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

