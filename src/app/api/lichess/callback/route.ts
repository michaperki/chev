
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers'; // To access cookies

const prisma = new PrismaClient();
const clientId = process.env.NEXT_PUBLIC_LICHESS_CLIENT_ID!;
const clientSecret = process.env.NEXT_PUBLIC_LICHESS_CLIENT_SECRET!;
const redirectUri = process.env.NEXT_PUBLIC_LICHESS_REDIRECT_URI!;

// Function to exchange the authorization code for an access token
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

  const tokenData = await tokenResponse.json();
  console.log("Lichess token response:", tokenData);

  return tokenData;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code'); // Authorization code from Lichess
  const verifier = cookies().get('lichess_code_verifier')?.value;

  // Log the code and verifier received
  console.log("Received code from Lichess:", code);
  console.log("Received verifier from cookies:", verifier);

  if (!code || !verifier) {
    return NextResponse.json({ success: false, message: 'Missing code or verifier' }, { status: 400 });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenData = await getLichessToken(code, verifier);

    if (!tokenData.access_token) {
      return NextResponse.json({ success: false, message: 'Failed to get access token' }, { status: 400 });
    }

    // Fetch Lichess user information using the access token
    const userResponse = await fetch('https://lichess.org/api/account', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();
    console.log("Fetched Lichess user data:", userData);

    // Upsert the Lichess user data into your Prisma database
    const user = await prisma.user.upsert({
      where: { lichessId: userData.id },
      update: {
        lichessUsername: userData.username,
        lichessAccessToken: tokenData.access_token,
      },
      create: {
        lichessId: userData.id,
        lichessUsername: userData.username,
        lichessAccessToken: tokenData.access_token,
      },
    });

    console.log("User successfully upserted in the database:", user);

    // Return success response or redirect to a success page
    return NextResponse.redirect(`/success`); // Or wherever you want to redirect after success
  } catch (error) {
    console.error('Error during Lichess callback:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

