
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie"; // Import js-cookie

const LichessLoginCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchLichessToken = async (code: string, verifier: string) => {
      try {
        // Add more logging for debugging purposes
        console.log("Sending code to backend:", code);
        console.log("Sending verifier to backend:", verifier);

        const response = await fetch("/api/lichess/callback", {
          method: "GET", // Correct method for retrieving query params
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Lichess token received:", data);
          router.push("/dashboard");
        } else {
          setError(data.message || "Failed to exchange Lichess token");
        }
      } catch (err) {
        setError("Error during Lichess token exchange");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const code = searchParams.get("code");
    const verifier = Cookies.get("lichess_code_verifier"); // Retrieve verifier from cookies

    console.log("Received code from URL:", code);
    console.log("Retrieved verifier from cookies:", verifier);

    if (code && verifier) {
      fetchLichessToken(code, verifier);
    } else {
      setError("Missing authorization code or verifier");
      setLoading(false);
    }
  }, [router, searchParams]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LichessLoginCallback;

