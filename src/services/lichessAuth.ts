
// src/services/lichessAuth.ts

import Cookies from "js-cookie";

// Generate a code verifier
const generateCodeVerifier = () => {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join("");
};

// Base64 URL encode
const base64URLEncode = (str: ArrayBuffer) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str) as any))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

// SHA-256 hashing
const sha256 = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  return window.crypto.subtle.digest("SHA-256", data);
};

// Generate the code challenge based on the verifier
const generateCodeChallenge = async (verifier: string) => {
  const hashed = await sha256(verifier);
  return base64URLEncode(hashed);
};

// Lichess login flow
export const initiateLichessLogin = async () => {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store the verifier in cookies
    Cookies.set("lichess_code_verifier", codeVerifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_LICHESS_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_LICHESS_REDIRECT_URI!,
      scope: "preference:read",
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    // Redirect to Lichess for authentication
    window.location.href = `https://lichess.org/oauth?${params.toString()}`;
  } catch (error) {
    console.error("Failed to initiate Lichess login:", error);
  }
};

export async function fetchLichessToken(walletAddress: string) {
  try {
    const response = await fetch(`/api/lichess/token?walletAddress=${walletAddress}`);
    const data = await response.json();

    if (response.ok && data.lichessToken) {
      return data.lichessToken;
    }

    return null; // Return null if no token is found
  } catch (error) {
    console.error("Failed to fetch Lichess token:", error);
    return null;
  }
}
