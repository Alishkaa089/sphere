"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, UserPlus, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/lib/actions";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Bütün xarakteristikaları doldurun.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Keçərli bir E-poçt (Email) daxil etməyiniz mütləqdir.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifrələr eyni deyil.");
      return;
    }

    if (password.length < 8) {
      setError("Şifrə kəmiyyəti minimum 8 simvoldan/rəqəmdən ibarət olmalıdır.");
      return;
    }

    setLoading(true);

    const performRegister = async () => {
      const res = await registerUser({ email, password, name });
      
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      
      if (res.success && res.user) {
        localStorage.setItem("userEmail", res.user.email);
        localStorage.setItem("userName", res.user.name || "");
        localStorage.setItem("userRole", res.user.role);
        localStorage.setItem("userPlan", res.user.plan || "BASIC");
        localStorage.setItem("userAvatar", res.user.avatar || "");
        localStorage.setItem("userLoggedIn", "true");
        window.dispatchEvent(new Event("avatarChanged"));
        window.dispatchEvent(new Event("roleChanged"));
        window.dispatchEvent(new Event("planChanged"));
        router.push("/");
      }
    };
    
    performRegister();
  };

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Abstract Glowing Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#004E64]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Top Left Navigation Back */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Ana Səhifəyə Qayıt</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/">
             <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-lg mb-2 inline-block">
               Valorum<span className="text-[#006B8A]">.</span>
             </h1>
          </Link>
          <p className="text-slate-400 font-medium">Sonsuz qlobal rahatlığa buradan başlayın.</p>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 sm:rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Subtle decoration inside box */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />

          <h2 className="text-2xl font-black text-white mb-6 relative">Yeni Hesab Yaradın</h2>

          <form onSubmit={handleRegister} className="space-y-4 relative">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Ad və Soyad
              </label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value.replace(/\d/g, ""))}
                placeholder="Özünüzü təqdim edin"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#006B8A] focus:ring-1 focus:ring-[#006B8A] transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> E-Mail Ünvanı
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Sizin əlaqə e-poçtunuz"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#006B8A] focus:ring-1 focus:ring-[#006B8A] transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Parol (Şifrə)
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#006B8A] focus:ring-1 focus:ring-[#006B8A] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Parolun Təsdiqi
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifrəni təkrar daxil edin"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#006B8A] focus:ring-1 focus:ring-[#006B8A] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 mt-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200 font-medium">{error}</p>
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#004E64] to-purple-600 hover:from-[#006B8A] hover:to-purple-600 text-white shadow-xl shadow-[#006B8A]/20 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>Hesab Yarat <UserPlus className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6 relative">
            <p className="text-slate-400 font-medium text-sm">
              Artıq hesabınız var?{" "}
              <Link href="/login" className="text-white font-bold hover:text-[#00A3CC] transition-colors">
                Giriş Edin
              </Link>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
