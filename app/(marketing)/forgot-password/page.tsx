"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, AlertCircle, Loader2, CheckCircle, ShieldCheck, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { forgotPassword, verifyResetCode, resetPassword } from "@/lib/actions";

type Step = "email" | "code" | "newPassword" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("E-poçt ünvanını daxil edin.");
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.error) {
        setError(res.error);
      } else {
        setStep("code");
      }
    } catch {
      setError("Xəta baş verdi. Yenidən cəhd edin.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("6 rəqəmli kodu daxil edin.");
      return;
    }
    setLoading(true);
    try {
      const res = await verifyResetCode(email, code);
      if (res.error) {
        setError(res.error);
      } else {
        setStep("newPassword");
      }
    } catch {
      setError("Xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Şifrə ən azı 6 simvol olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Şifrələr uyğun gəlmir.");
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(email, code, newPassword);
      if (res.error) {
        setError(res.error);
      } else {
        setStep("done");
      }
    } catch {
      setError("Xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError("");
    setResendSuccess(false);
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.error) {
        setError(res.error);
      } else {
        setCode("");
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 4000);
      }
    } catch {
      setError("Kod yenidən göndərilə bilmədi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoBackToCode = () => {
    setError("");
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setStep("code");
  };

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#004E64]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#004E64]/10 blur-[150px] rounded-full pointer-events-none" />

      <Link href="/login" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors z-20 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-bold">Girişə Qayıt</span>
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
          <p className="text-slate-400 font-medium">Şifrənizi sıfırlayın</p>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 sm:rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {["email", "code", "newPassword"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                  step === s ? "bg-[#006B8A] text-white scale-110" :
                  ["email", "code", "newPassword"].indexOf(step) > i || step === "done"
                    ? "bg-[#004E64] text-white"
                    : "bg-white/5 text-slate-600"
                }`}>
                  {["email", "code", "newPassword"].indexOf(step) > i || step === "done" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && <div className={`w-8 h-0.5 ${["email", "code", "newPassword"].indexOf(step) > i || step === "done" ? "bg-[#006B8A]" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Email */}
            {step === "email" && (
              <motion.div key="email" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#004E64]/20 border border-[#006B8A]/30 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-[#00A3CC]" />
                  </div>
                  <h2 className="text-2xl font-black text-white">E-poçtunuzu daxil edin</h2>
                  <p className="text-slate-400 text-sm mt-1">Qeydiyyatdan keçdiyiniz e-poçt ünvanını yazın</p>
                </div>

                <form onSubmit={handleSendCode} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> E-Mail Ünvanı
                    </label>
                    <input
                      type="email"
                      autoFocus
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="test@valorum.com"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#006B8A] focus:ring-1 focus:ring-[#006B8A] transition-all font-medium"
                    />
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
                    className="w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#004E64] to-[#00394A] hover:from-[#006B8A] hover:to-[#004E64] text-white shadow-xl shadow-[#006B8A]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Kod Göndər"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Code Verification */}
            {step === "code" && (
              <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#004E64]/20 border border-[#006B8A]/30 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8 text-[#00A3CC]" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Kodu daxil edin</h2>
                  <p className="text-slate-400 text-sm mt-1">
                    <span className="text-[#00A3CC] font-bold">{email}</span> ünvanına 6 rəqəmli kod göndərildi
                  </p>
                </div>

                <form onSubmit={handleVerifyCode} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <KeyRound className="w-4 h-4" /> Təsdiq Kodu
                    </label>
                    <input
                      type="text"
                      autoFocus
                      maxLength={6}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white text-center text-2xl tracking-[0.5em] font-black placeholder:text-slate-700 focus:outline-none focus:border-[#006B8A] focus:ring-1 focus:ring-[#006B8A] transition-all"
                    />
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-200 font-medium">{error}</p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    className="w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#004E64] to-[#00394A] hover:from-[#006B8A] hover:to-[#004E64] text-white shadow-xl shadow-[#006B8A]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Kodu Təsdiqlə"}
                  </button>

                  {resendSuccess && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <p className="text-sm text-emerald-200 font-medium">Yeni kod göndərildi!</p>
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <button type="button" onClick={() => { setStep("email"); setError(""); setCode(""); }} className="text-slate-400 hover:text-white font-bold transition-colors">
                      ← E-poçtu dəyiş
                    </button>
                    <button type="button" onClick={handleResendCode} disabled={loading} className="text-[#00A3CC] hover:text-[#7FD4E8] font-bold transition-colors disabled:opacity-50">
                      Yenidən göndər
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: New Password */}
            {step === "newPassword" && (
              <motion.div key="newPassword" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#004E64]/20 border border-[#006B8A]/30 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-[#00A3CC]" />
                  </div>
                  <h2 className="text-2xl font-black text-white">Yeni şifrə təyin edin</h2>
                  <p className="text-slate-400 text-sm mt-1">Yeni şifrəniz ən azı 6 simvol olmalıdır</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Yeni Şifrə
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        autoFocus
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#006B8A] focus:ring-1 focus:ring-[#006B8A] transition-all font-medium"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> Şifrəni Təsdiqləyin
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#006B8A] focus:ring-1 focus:ring-[#006B8A] transition-all font-medium"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
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
                    className="w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#004E64] to-[#00394A] hover:from-[#006B8A] hover:to-[#004E64] text-white shadow-xl shadow-[#006B8A]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Şifrəni Yenilə"}
                  </button>

                  <div className="flex items-center justify-between text-sm pt-1">
                    <button type="button" onClick={handleGoBackToCode} className="text-slate-400 hover:text-white font-bold transition-colors">
                      ← Kodu dəyiş
                    </button>
                    <button type="button" onClick={async () => { await handleResendCode(); handleGoBackToCode(); }} disabled={loading} className="text-[#00A3CC] hover:text-[#7FD4E8] font-bold transition-colors disabled:opacity-50">
                      Yeni kod al
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Done */}
            {step === "done" && (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Şifrəniz Yeniləndi!</h2>
                <p className="text-slate-400 text-sm mb-8">Yeni şifrənizlə hesabınıza daxil ola bilərsiniz.</p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 py-4 px-8 rounded-xl font-black text-lg bg-gradient-to-r from-[#004E64] to-[#00394A] hover:from-[#006B8A] hover:to-[#004E64] text-white shadow-xl shadow-[#006B8A]/20 transition-all"
                >
                  Daxil Ol
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </div>
  );
}
