import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Real-Time Voice AI Agent | Sub-Second Latency Starter",
  description: "Next.js 15 Voice AI Agent with sub-second turnaround and dynamic audio visualization.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090b10] text-gray-100 antialiased selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  );
}
