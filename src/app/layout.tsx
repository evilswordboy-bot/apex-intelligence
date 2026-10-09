import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APEX — Elite Sports Performance & Biomechanical AI",
  description: "Next-generation sports intelligence suite combining browser-based computer vision, acute-to-chronic workload fatigue prevention, and tactical telemetry across Cricket, Football, and Olympic sports.",
  icons: {
    icon: "/branding/favicon.svg",
    shortcut: "/branding/favicon.svg",
    apple: "/branding/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" type="image/svg+xml" href="/branding/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#05070D" />
      </head>
      <body className="bg-[#05070D] text-[#F5F7FF] font-sans antialiased selection:bg-[#2D6BFF] selection:text-white">
        {children}
      </body>
    </html>
  );
}
