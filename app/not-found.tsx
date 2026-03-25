"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-[#fafafa]">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <div className="relative z-10 max-w-md mx-auto">
        <h2 className="text-9xl font-black text-slate-200 tracking-tighter mb-4">404</h2>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Page Not Found</h3>
        <p className="text-slate-500 font-medium mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="w-full">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
