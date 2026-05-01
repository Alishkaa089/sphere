"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, X, Loader2 } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { loginUser, socialLogin, checkSocialUser } from "@/lib/actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAccountSelector, setShowAccountSelector] = useState(false); 
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [socialData, setSocialData] = useState<{ email: string; avatar?: string } | null>(null);
  const [fullName, setFullName] = useState("");
  const [socialLoading, setSocialLoading] = useState(false);

  const saveUserToLocal = (user: any) => {
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", user.name || "");
    localStorage.setItem("userRole", user.role || "user");
    localStorage.setItem("userPlan", user.plan || "BASIC");
    localStorage.setItem("userAvatar", user.avatar || "");
    localStorage.setItem("userLoggedIn", "true");
    
    window.dispatchEvent(new Event("avatarChanged"));
    window.dispatchEvent(new Event("roleChanged"));
    window.dispatchEvent(new Event("planChanged"));
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setSocialLoading(true);
      setError("");
      try {
        
        const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        
        if (!userInfo.email) throw new Error("Email tapılmadı");

        const res = await checkSocialUser(userInfo.email);
        
        if (res.exists && res.user) {
          saveUserToLocal(res.user);
          router.push("/");
        } else {
          
          setSocialData({ 
             email: userInfo.email, 
             avatar: userInfo.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name || "User")}&background=004E64&color=fff` 
          });
          setFullName(userInfo.name || ""); 
          setShowSocialModal(true);
        }
      } catch (err) {
        console.error("Google login error:", err);
        setError("Google ilə giriş zamanı xəta baş verdi.");
      } finally {
        setSocialLoading(false);
      }
    },
    onError: () => {
      setError("Google pop-up pəncərəsi açıla bilmədi.");
    }
  });

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !socialData) return;

    setSocialLoading(true);
    try {
      const res = await socialLogin({
        email: socialData.email,
        name: fullName,
        avatar: socialData.avatar
      });

      if (res.error) {
        setError(res.error);
        setShowSocialModal(false);
      } else if (res.success && res.user) {
        saveUserToLocal(res.user);
        router.push("/");
      }
    } catch (err) {
      setError("Giriş zamanı xəta baş verdi.");
    } finally {
      setSocialLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Bütün xanaları doldurun.");
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser({ email, password });

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      if (res.success && res.user) {
        saveUserToLocal(res.user);
        router.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Giriş zamanı xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#004E64]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#004E64]/10 blur-[150px] rounded-full pointer-events-none" />

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
               Valorum<span className="text-[#006B8A]">.</span>
             </h1>
          </Link>
          <p className="text-slate-400 font-medium">Bütün ehtiyaclarınız bir məkanda idarə olunur.</p>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 sm:rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <h2 className="text-2xl font-black text-white mb-6">Xoş Gəlmisiniz</h2>

          <div className="space-y-4 mb-8">
            <button 
              onClick={() => handleGoogleLogin()}
              className="w-full py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-3 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google ilə davam et
            </button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] font-black text-slate-600"><span className="bg-transparent px-4">və ya email ilə</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" /> E-Mail Ünvanı
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@Valorum.com"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#006B8A] focus:ring-1 focus:ring-[#006B8A] transition-all font-medium"
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
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#006B8A] focus:ring-1 focus:ring-[#006B8A] transition-all font-medium"
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
                <Link href="/forgot-password" className="text-sm font-bold text-[#00A3CC] hover:text-[#7FD4E8] transition-colors">Şifrəni unutmusunuz?</Link>
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
              className="w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#004E64] to-[#00394A] hover:from-[#006B8A] hover:to-[#004E64] text-white shadow-xl shadow-[#006B8A]/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>Daxil Ol <LogIn className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-slate-400 font-medium text-sm">
              Hələ də Valorum hesabınız yoxdur?{" "}
              <Link href="/register" className="text-white font-bold hover:text-[#00A3CC] transition-colors">
                Buradan Qeydiyyatdan Keçin
              </Link>
            </p>
          </div>

        </div>
      </motion.div>

      <AnimatePresence>
        {showSocialModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 w-full max-w-sm relative shadow-2xl"
            >
              <button onClick={() => setShowSocialModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-[#006B8A]/30 overflow-hidden">
                  <img src={socialData?.avatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-black text-white">Neredeyse Hazır!</h3>
                <p className="text-slate-400 text-sm mt-1">{socialData?.email}</p>
              </div>

              <form onSubmit={handleSocialSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Adınız və Soyadınız</label>
                  <input 
                    autoFocus
                    required
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ali Məmmədov"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#006B8A] transition-all"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={socialLoading}
                  className="w-full py-4 rounded-xl font-black bg-gradient-to-r from-[#004E64] to-[#006B8A] text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {socialLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Girişi Tamamla"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
