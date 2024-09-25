import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // without a title, warpcast won't validate your frame
  title: "frames.js starter",
  description: "...",
  // add more meta tags here
  // other: {
  //   'fc:frame': 'vNext',
  //   'fc:frame:image': [`${process.env.NEXT_PUBLIC_VERCEL_URL}/next.svg`],
  // }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
