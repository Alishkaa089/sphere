"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Bütün xanaları doldurun.");
      return;
    }

    setLoading(true);

    // Simulate Network Request
    setTimeout(() => {
      // Very basic local-storage auth validation
      const savedEmail = localStorage.getItem("userEmail") || "test@sphere.com";
      const savedPass = localStorage.getItem("userPassword") || "password123";

      if (email === "Adminyekdi@gmail.com" && password === "Admin123") {
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userAvatar", "https://ui-avatars.com/api/?name=Admin&background=dc2626&color=fff");
        window.dispatchEvent(new Event("avatarChanged"));
        window.dispatchEvent(new Event("roleChanged"));
        router.push("/profile");
      } else if (email === savedEmail && password === savedPass) {
        localStorage.setItem("userLoggedIn", "true");
        window.dispatchEvent(new Event("avatarChanged")); // Sync Navbars
        router.push("/profile");
      } else if (email === "test@sphere.com" && password === "password123") {
        // Fallback generic login for testers
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("userEmail", "test@sphere.com");
        localStorage.setItem("userPassword", "password123");
        window.dispatchEvent(new Event("avatarChanged"));
        router.push("/profile");
      } else {
        setError("Email və ya şifrə yanlışdır. Davam etmək üçün 'test@sphere.com' / 'password123' istifadə edə bilərsiniz.");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Abstract Glowing Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Top Left Navigation Back */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Ana Səhifəyə Qayıt</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/">
             <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-lg mb-2 inline-block">
               Sphere<span className="text-blue-500">.</span>
             </h1>
          </Link>
          <p className="text-slate-400 font-medium">Bütün ehtiyaclarınız bir məkanda idarə olunur.</p>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 sm:rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <h2 className="text-2xl font-black text-white mb-6">Xoş Gəlmisiniz</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" /> E-Mail Ünvanı
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@sphere.com"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Parol
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link href="#" className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">Şifrəni unutmusunuz?</Link>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200 font-medium">{error}</p>
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>Daxil Ol <LogIn className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-slate-400 font-medium text-sm">
              Hələ də Sphere hesabınız yoxdur?{" "}
              <Link href="/register" className="text-white font-bold hover:text-blue-400 transition-colors">
                Buradan Qeydiyyatdan Keçin
              </Link>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
