import type { Metadata } from "next";
import "../styles/globals.css";
import "../styles/globals.css";
import MainLayoutWrapper from "@/components/MainLayoutWrapper";

export const metadata: Metadata = {
  title: "Restaurant Table Reservation",
  description: "WhatsApp-integrated restaurant booking platform"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f9f6f1] text-slate-900">
        <MainLayoutWrapper>{children}</MainLayoutWrapper>
      </body>
    </html>
  );
}

