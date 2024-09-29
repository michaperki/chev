
"use client"; // Add this to ensure it's a client-side component

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import DepositForm from "./DepositForm";

const SessionBalance: React.FC = () => {
  const session = useSelector((state: RootState) => state.session); // Fetch session from Redux

  if (!session) {
    return <p>No session found</p>;
  }

  return (
    <div>
      <p>Balance: {session.balance}</p>
      <p>Status: {session.status}</p>
      <DepositForm />
    </div>
  );
};

export default SessionBalance;

