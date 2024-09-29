
import { NextResponse } from 'next/server';
import crypto from 'crypto';

const clientId = process.env.LICHESS_CLIENT_ID!;
const redirectUri = process.env.LICHESS_REDIRECT_URI!;

// Generate base64 URL-encoded verifier and challenge
const base64URLEncode = (str: Buffer | string) => {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const sha256 = (buffer: Buffer) => crypto.createHash('sha256').update(buffer).digest();

export async function GET(request: Request) {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(sha256(Buffer.from(verifier)));

  const url = new URL(`${request.headers.get('origin')}/api/lichess/callback`);
  
  // Store the verifier in cookies or session for later use
  const response = NextResponse.redirect(`https://lichess.org/oauth?` + new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: url.toString(),
    scope: 'preference:read',
    code_challenge_method: 'S256',
    code_challenge: challenge
  }).toString());

  // Set the verifier in the cookies with `SameSite: Lax` and `HttpOnly` to prevent any issues
  response.cookies.set('lichess_code_verifier', verifier, { httpOnly: true, sameSite: 'Lax', path: '/' });

  return response;
}

