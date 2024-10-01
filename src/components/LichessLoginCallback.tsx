
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setLichessData } from "../slices/user";
import Cookies from "js-cookie";

const LichessLoginCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  
  const walletAddress = useSelector((state: any) => state.user.walletAddress); // Fetch wallet from Redux

  useEffect(() => {
    const fetchLichessToken = async (code: string, verifier: string) => {
      try {
        const response = await fetch("/api/user/lichess/callback", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (response.ok) {
          console.log("Lichess token received:", data);

          // Dispatch Lichess token to Redux
          dispatch(setLichessData({ lichessAccessToken: data.token }));

          // Redirect to dashboard after successful login
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
    const verifier = Cookies.get("lichess_code_verifier");

    if (code && verifier) {
      if (walletAddress) {
        fetchLichessToken(code, verifier); // Fetch token only if walletAddress exists
      } else {
        setError("Missing wallet address");
        setLoading(false);
      }
    } else {
      setError("Missing authorization code or verifier");
      setLoading(false);
    }
  }, [router, searchParams, dispatch, walletAddress]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default LichessLoginCallback;

