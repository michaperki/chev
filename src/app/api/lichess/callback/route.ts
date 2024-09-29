
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'; // To access cookies

const prisma = new PrismaClient();
const clientId = process.env.NEXT_PUBLIC_LICHESS_CLIENT_ID!;
const clientSecret = process.env.NEXT_PUBLIC_LICHESS_CLIENT_SECRET!;
const redirectUri = process.env.NEXT_PUBLIC_LICHESS_REDIRECT_URI!;

async function getLichessToken(authCode: string, verifier: string) {
  const tokenResponse = await fetch('https://lichess.org/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: authCode,
      code_verifier: verifier,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  return tokenResponse.json();
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code'); // Authorization code from Lichess
  const verifier = cookies().get('lichess_code_verifier')?.value; // Fetch verifier from cookies

  // Log the values to ensure we're getting them correctly
  console.log("Received code from Lichess:", code);
  console.log("Received verifier from cookies:", verifier);

  if (!code || !verifier) {
    return NextResponse.json({ success: false, message: 'Missing code or verifier' }, { status: 400 });
  }

  try {
    const tokenData = await getLichessToken(code, verifier);

    if (!tokenData.access_token) {
      return NextResponse.json({ success: false, message: 'Failed to get access token' }, { status: 400 });
    }

    // Fetch Lichess user information using the access token
    const userResponse = await fetch('https://lichess.org/api/account', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const lichessUserData = await userResponse.json();

    console.log("Received Lichess user data:", lichessUserData);

    // Retrieve the connected wallet from cookies (or Redux)
    const walletAddress = cookies().get('wallet_address')?.value; // Replace with correct method of getting wallet address

    if (!walletAddress) {
      return NextResponse.json({ success: false, message: 'Wallet address not found' }, { status: 400 });
    }

    // Find the user by wallet address and update the Lichess information
    const user = await prisma.user.update({
      where: { wallet: walletAddress }, // Find the user by wallet address
      data: {
        lichessId: lichessUserData.id,
        lichessUsername: lichessUserData.username,
        lichessAccessToken: tokenData.access_token,
      },
    });

    // If the user doesn't exist, we should not create a new user because they must have logged in via their wallet first
    if (!user) {
      return NextResponse.json({ success: false, message: 'User with connected wallet not found' }, { status: 404 });
    }

    // Redirect to the desired page after successful login
    const redirectUrl = `${url.origin}/dashboard`; // Use absolute URL
    return NextResponse.redirect(redirectUrl); // Adjust the redirect URL as needed
  } catch (error) {
    console.error('Error during Lichess callback:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

