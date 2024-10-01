
"use client"; // Ensure this runs on the client-side

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const LichessCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchLichessToken = async (code: string, verifier: string) => {
      try {
        const response = await fetch("/api/user/lichess/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, verifier }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Lichess token received:", data);
          router.push("/dashboard"); // Redirect after success
        } else {
          setError(data.message || "Failed to exchange Lichess token");
        }
      } catch (err) {
        setError("Error during Lichess token exchange");
        console.error(err);
      }
    };

    const code = searchParams.get("code");
    const verifier = localStorage.getItem("lichess_code_verifier");

    if (code && verifier) {
      fetchLichessToken(code, verifier);
    } else {
      setError("Missing authorization code or verifier");
    }
  }, [router, searchParams]);

  return (
    <div>
      {error ? <p className="text-red-500">{error}</p> : <p>Loading...</p>}
    </div>
  );
};

export default LichessCallback;
