import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Voynich - Secure Encrypted Ephemeral Messaging",
  description:
    "Voynich offers secure, encrypted, and ephemeral messaging. Create temporary chat rooms with end-to-end encryption for private conversations.",
  keywords:
    "Voynich, encrypted messaging, encrypted chat, ephemeral messaging, secure chat, private messaging",
  openGraph: {
    title: "Voynich - Secure Encrypted Ephemeral Messaging",
    description:
      "Create secure, encrypted, and temporary chat rooms with Voynich.",
    url: "https://voynich.chat",
    siteName: "Voynich",
    images: [
      {
        url: "https://voynich.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Voynich Encrypted Messaging",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voynich - Secure Encrypted Ephemeral Messaging",
    description:
      "Create secure, encrypted, and temporary chat rooms with Voynich.",
    images: ["https://voynich.app/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
