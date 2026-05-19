import type { Metadata } from "next";

import { AppProviders } from "@/providers";

import "./globals.css";

export const metadata: Metadata = {
  title: "BookLeaf Support",
  description:
    "Author Support & Communication Portal — operational dashboard for authors and admins.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
