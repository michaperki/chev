
// src/app/api/lichess/token/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address is required' }, { status: 400 });
  }

  try {
    // Query Prisma for the user with the given wallet address
    const user = await prisma.user.findUnique({
      where: { wallet: walletAddress },
    });

    if (user && user.lichessAccessToken) {
      return NextResponse.json({ lichessToken: user.lichessAccessToken }, { status: 200 });
    }

    return NextResponse.json({ message: 'Lichess token not found' }, { status: 404 });
  } catch (error) {
    console.error("Error fetching Lichess token:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

