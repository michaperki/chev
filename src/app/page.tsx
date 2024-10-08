
// src/app/page.tsx
import React from "react";
import ReduxStateDisplay from "../components/ReduxStateDisplay";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl">Welcome to Chev</h1>
      <p>Play and win crypto by wagering on chess games!</p>

      {/* Display the Redux state */}
      <ReduxStateDisplay />
    </div>
  );
}

