import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // without a title, warpcast won't validate your frame
  title: "frames.js starter",
  description: "...",
  // add more meta tags here
  other: {
    'fc:frame': 'https://static.displate.com/857x1200/displate/2023-02-22/fd7b9f64dba3cc0af23a4af3585c617f_64aae34bedd367448ea2dc235558300a.jpg',
    'fc:frame:image': 'https://static.displate.com/857x1200/displate/2023-02-22/fd7b9f64dba3cc0af23a4af3585c617f_64aae34bedd367448ea2dc235558300a.jpg',
  }
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
