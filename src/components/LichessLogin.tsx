
"use client";

const generateCodeVerifier = () => {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ("0" + dec.toString(16)).substr(-2)).join("");
};

const base64URLEncode = (str: ArrayBuffer) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str) as any))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const sha256 = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  return window.crypto.subtle.digest("SHA-256", data);
};

const generateCodeChallenge = async (verifier: string) => {
  const hashed = await sha256(verifier);
  return base64URLEncode(hashed);
};

const LichessLogin: React.FC = () => {
  const handleLichessLogin = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Log the generated code verifier and challenge
    console.log("Code Verifier:", codeVerifier);
    console.log("Code Challenge:", codeChallenge);

    // Save the code verifier in localStorage
    localStorage.setItem("lichess_code_verifier", codeVerifier);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.NEXT_PUBLIC_LICHESS_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_LICHESS_REDIRECT_URI!,
      scope: "preference:read",
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
    });

    // Log the full URL for the Lichess OAuth request
    console.log("Redirecting to:", `https://lichess.org/oauth?${params.toString()}`);

    // Redirect to Lichess for authentication
    window.location.href = `https://lichess.org/oauth?${params.toString()}`;
  };

  return (
    <button onClick={handleLichessLogin} className="bg-blue-500 text-white p-2">
      Connect Lichess Account
    </button>
  );
};

export default LichessLogin;

