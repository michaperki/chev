
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const LichessLoginCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchLichessToken = async (code: string, verifier: string) => {
      try {
        // Log the code and verifier being sent to the backend
        console.log("Sending code to backend:", code);
        console.log("Sending verifier to backend:", verifier);

        const response = await fetch("/api/lichess/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, verifier }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Lichess token received:", data);
          // Redirect to success page
          router.push("/success");
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
    const verifier = localStorage.getItem("lichess_code_verifier");

    // Log the code and verifier to ensure they are correctly retrieved
    console.log("Received code from URL:", code);
    console.log("Retrieved verifier from localStorage:", verifier);

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

