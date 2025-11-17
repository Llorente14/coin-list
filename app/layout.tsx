import type { Metadata } from "next";
import "./globals.css";
import BootstrapClient from "./components/BootstrapClient";

export const metadata: Metadata = {
  title: "Coin Wishlist App",
  description: "Aplikasi wishlist untuk cryptocurrency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}
