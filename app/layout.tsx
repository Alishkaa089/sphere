import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/navigation/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import SplashScreen from "@/components/SplashScreen";
import { GoogleOAuthProvider } from "@react-oauth/google";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

// A temporary Google Client ID for development purposes
const GOOGLE_CLIENT_ID = "629516123194-8ib2e5fa1t0oasll19j3f35hemguqd84.apps.googleusercontent.com"; 

export const metadata: Metadata = {
  title: "Valorum — The Future of Space",
  description:
    "Valorum is a premium SaaS platform for property and transport management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased bg-[#0a0a09] text-slate-100 selection:bg-[#006B8A]/30`}
        suppressHydrationWarning
      >
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            <LanguageProvider>
              <div className="flex flex-col min-h-screen">
                <SplashScreen>
                  <Navbar />
                  <main className="flex-grow">{children}</main>
                </SplashScreen>
              </div>
            </LanguageProvider>
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
