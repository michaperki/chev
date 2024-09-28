
// src/components/ClientProvider.tsx
"use client"; // Ensure this is a Client Component

import { Provider } from "react-redux";
import { store } from "../store/store";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
