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
      <body className="bg-[#05070D] text-[#F5F7FF] font-sans antialiased selection:bg-[#2D6BFF] selection:text-white relative min-h-screen">
        {/* Full-screen Cinematic Anime Stadium Background across all pages */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 opacity-40 sm:opacity-45 bg-cover bg-center bg-no-repeat transform scale-100 transition-opacity duration-1000"
          style={{ backgroundImage: "url('/images/hero/apex_anime_sports_cinematic.jpg')" }}
        />
        {/* Anime Atmospheric Glow & Radial Vignette */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#05070D]/70 via-[#05070D]/85 to-[#05070D]" />
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
