import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/navigation/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import SplashScreen from "@/components/SplashScreen";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sphere — The Future of Space",
  description:
    "Sphere is a premium SaaS platform for property and transport management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${outfit.variable} font-sans antialiased bg-[#0a0a09] text-slate-100 selection:bg-indigo-500/30`}
      >
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
      </body>
    </html>
  );
}
