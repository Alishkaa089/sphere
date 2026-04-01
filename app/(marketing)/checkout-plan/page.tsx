"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { upgradeUserPlan } from "@/lib/actions";
import { useLanguage } from "@/context/LanguageContext";

export default function CheckoutPlanPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("userLoggedIn") !== "true") {
      window.location.href = "/register";
    }
  }, []);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^A-Za-zƏəŞşÇçĞğÜüÖöİı\s]/g, "");
    setCardName(val);
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length >= 2) {
      let month = parseInt(val.substring(0, 2), 10);
      if (month > 12) month = 12;
      if (month === 0 && val.length > 1) val = "01" + val.substring(2);
      else val = month.toString().padStart(2, "0") + val.substring(2);
    }
    if (val.length > 2) {
      val = val.substring(0, 2) + "/" + val.substring(2, 4);
    }
    setExpiry(val);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").substring(0, 3);
    setCvv(val);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cardNumber.replace(/\s/g, "").length !== 16) return;
    if (expiry.length !== 5) return;
    if (cvv.length !== 3) return;

    setIsProcessing(true);
    
    const userEmail = localStorage.getItem("userEmail") || "";
    if (userEmail) {
      const res = await upgradeUserPlan(userEmail, "PRO");
      if (res.success) {
         localStorage.setItem("userPlan", "PRO");
         window.dispatchEvent(new Event("planChanged"));
         setIsSuccess(true);
         setTimeout(() => {
           router.push("/partnership");
         }, 3000);
      } else {
         alert(t.toast_error);
         setIsProcessing(false);
      }
    } else {
      setIsProcessing(false);
      router.push("/login");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl font-black text-white text-center mb-4">
          {t.upgrade_success}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-emerald-400 font-medium text-lg text-center max-w-sm">
          {t.checkout_success_desc.replace("{title}", "Valorum PRO")}
        </motion.p>
      </div>
    );
  }

  const isFormValid = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) return false;
    if (expiry.length !== 5) return false;
    if (cvv.length !== 3) return false;
    if (cardName.trim().length <= 2) return false;
    const year = parseInt(expiry.split('/')[1] || "0", 10);
    if (year < 25) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-[#0a0a09] flex py-20 px-4 items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#004E64]/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#006B8A]/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        
        {/* Payment Form */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <Lock className="w-6 h-6 text-[#00A3CC]" />
            <h2 className="text-2xl font-black text-white">{t.checkout_title}</h2>
          </div>

          <form onSubmit={handlePay} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.checkout_card_name}</label>
                <input required type="text" autoComplete="off" value={cardName} onChange={handleNameChange} placeholder={t.checkout_card_name_ph} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors placeholder:text-slate-600" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.checkout_card_num}</label>
                <div className="relative">
                  <CreditCard className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input required type="text" autoComplete="off" value={cardNumber} onChange={handleCardChange} placeholder="0000 0000 0000 0000" className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors tracking-widest placeholder:text-slate-600" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.checkout_exp}</label>
                  <input required type="text" autoComplete="off" value={expiry} onChange={handleExpiryChange} placeholder={t.checkout_exp_ph || "AA/İİ"} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors placeholder:text-slate-600" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.checkout_cvv}</label>
                  <div className="relative">
                    <input required autoComplete="one-time-code" type={showCvv ? "text" : "password"} value={cvv} onChange={handleCvvChange} placeholder="***" className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors placeholder:text-slate-600" />
                    <button type="button" onClick={() => setShowCvv(!showCvv)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                      {showCvv ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button disabled={isProcessing || !isFormValid()} type="submit" className="w-full mt-8 py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#004E64] to-[#006B8A] hover:from-[#006B8A] hover:to-[#00A3CC] text-white shadow-xl shadow-[#004E64]/30 disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? t.checkout_processing : `${t.checkout_pay} - $199`}
            </button>
            <p className="text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 mt-4">
              <ShieldCheck className="w-4 h-4 text-slate-400"/> {t.checkout_secure_stripe}
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="relative h-48 w-full bg-gradient-to-bl from-[#006B8A] to-[#00394A] flex items-center justify-center">
            <div className="text-5xl font-black text-white" style={{ fontFamily: "'Grailga', serif" }}>{t.plan_pro}</div>
            <div className="absolute inset-0 bg-gradient-to-t from-[rgb(10,10,9)] to-transparent" />
          </div>
          
          <div className="p-8 pt-0 flex-1 flex flex-col mt-[-20px] relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-zinc-800 text-white border border-white/10 shadow-lg`}>
                {t.checkout_summary_details}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Valorum {t.plan_pro}</h3>
            <p className="text-slate-400 font-medium mb-6 text-sm">30 {t.checkout_days}</p>
            
            <div className="bg-black/50 rounded-2xl p-5 border border-white/5 space-y-4 flex-1">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-400">Limit</span>
                <span className="text-white">50 {t.word_product}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-400">Önplana Çıxarma</span>
                <span className="text-white">Aktiv</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-400">Analitika Dəstəyi</span>
                <span className="text-white">Genişləndirilmiş</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center text-xl font-black text-white">
                <span>{t.checkout_summary_final}</span>
                <span className="text-emerald-400">$199</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
