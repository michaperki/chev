
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "../components/ClientProvider";
import Header from "../components/layout/Header";

export const metadata: Metadata = {
  title: "Chev",
  description: "Chev is a simple and secure chess gambling platform.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientProvider>
          <Header /> {/* Move wallet connection and session logic here */}
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}

