
// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "../components/ClientProvider"; // Import the ClientProvider

// Metadata remains on the server-side
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
    <html lang="en">
      <body>
        <ClientProvider>{children}</ClientProvider> {/* Wrap children with ClientProvider */}
      </body>
    </html>
  );
}

