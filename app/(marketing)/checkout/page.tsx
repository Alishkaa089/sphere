"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { createOrder } from "../../../lib/actions";
import { useLanguage } from "@/context/LanguageContext";

function CheckoutContent() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);

  useEffect(() => {
    if (localStorage.getItem("userLoggedIn") !== "true") {
      router.push("/register");
      return;
    }

    const stored = localStorage.getItem("pendingCheckout");
    if (stored) {
      try {
        setPendingData(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing checkout data", e);
      }
    }
  }, [router]);

  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  if (!pendingData) {
    return <div className="min-h-screen bg-[#0a0a09] flex items-center justify-center text-white font-black uppercase tracking-widest">{t.nav_login_prompt ? "..." : "Yüklənir..."}</div>;
  }

  const isSale = pendingData.transactionType === "sale";
  const totalRaw = pendingData.totalCost;

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

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.replace(/\s/g, "").length !== 16) return;
    if (expiry.length !== 5) return;
    if (cvv.length !== 3) return;

    setIsProcessing(true);
    const userEmail = localStorage.getItem("userEmail") || "";

    if (userEmail) {
      createOrder({
        productId: pendingData.productId,
        title: pendingData.title,
        type: isSale ? "Satınalma" : "İcarə",
        totalPrice: totalRaw,
        startDate: pendingData.startDate,
        endDate: pendingData.endDate
      }, userEmail).then(res => {
        if (res.success) {
           setIsSuccess(true);
           localStorage.removeItem("pendingCheckout");
           // For rentals, we might still want to keep local record for UI sync
           if (!isSale) {
              let reserved = [];
              const storedRes = localStorage.getItem(`reserved_${pendingData.productId}`);
              if (storedRes) reserved = JSON.parse(storedRes);
              reserved.push({ start: pendingData.startDate, end: pendingData.endDate });
              localStorage.setItem(`reserved_${pendingData.productId}`, JSON.stringify(reserved));
           }
           setTimeout(() => {
             router.push("/profile");
           }, 4000);
        } else {
           alert(t.toast_error);
           setIsProcessing(false);
        }
      }).catch(() => {
         setIsProcessing(false);
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl font-black text-white text-center mb-4">
          {t.checkout_success}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-emerald-400 font-medium text-lg text-center max-w-sm">
          {t.checkout_success_desc.replace("{title}", pendingData.title)}
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
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#004E64]/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <Lock className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{t.checkout_title}</h2>
          </div>

          <form onSubmit={handlePay} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.checkout_card_name}</label>
                <input required type="text" autoComplete="off" value={cardName} onChange={handleNameChange} placeholder={t.checkout_card_name_ph} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors placeholder:text-slate-600 font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.checkout_card_num}</label>
                <div className="relative">
                  <CreditCard className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input required type="text" autoComplete="off" value={cardNumber} onChange={handleCardChange} placeholder="0000 0000 0000 0000" className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors tracking-widest placeholder:text-slate-600 font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.checkout_exp}</label>
                  <input required type="text" autoComplete="off" value={expiry} onChange={handleExpiryChange} placeholder={t.checkout_exp_ph || "MM/YY"} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors placeholder:text-slate-600 font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.checkout_cvv}</label>
                  <div className="relative">
                    <input required autoComplete="one-time-code" type={showCvv ? "text" : "password"} value={cvv} onChange={handleCvvChange} placeholder="***" className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors placeholder:text-slate-600 font-bold" />
                    <button type="button" onClick={() => setShowCvv(!showCvv)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                      {showCvv ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button disabled={isProcessing || !isFormValid()} type="submit" className="w-full mt-8 py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#004E64] to-[#00394A] hover:from-[#006B8A] hover:to-[#004E64] text-white shadow-xl shadow-[#006B8A]/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? t.checkout_processing : `${t.checkout_pay} - $${totalRaw.toLocaleString()}`}
            </button>
            <p className="text-center text-[10px] font-black text-slate-600 flex items-center justify-center gap-1.5 mt-4 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-slate-500"/> {t.checkout_secure_standard}
            </p>
          </form>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="relative h-48 w-full">
            <img src={pendingData.image} alt="Product" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a09] to-transparent" />
          </div>
          <div className="p-8 pt-0 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3 mt-[-20px] relative z-10">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-zinc-800 text-white border border-white/10 shadow-lg">
                {t.checkout_summary_final}
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{pendingData.title}</h3>
            <div className="bg-black/50 rounded-2xl p-5 border border-white/5 space-y-4 flex-1">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-500">{t.checkout_catalog_type}</span>
                <span className="text-white">{isSale ? t.checkout_sale_excl : t.checkout_rent_temp}</span>
              </div>
              {!isSale && (
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                  <span className="text-slate-500">{t.checkout_daily_price}</span>
                  <span className="text-white">${pendingData.price.toLocaleString()} {t.checkout_per_day}</span>
                </div>
              )}
              {!isSale && pendingData.rentalDays > 0 && (
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                  <span className="text-slate-500">{t.checkout_duration}</span>
                  <span className="text-white">{pendingData.rentalDays} {t.checkout_days}</span>
                </div>
              )}
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-center text-xl font-black text-white">
                <span className="uppercase tracking-tighter text-sm">{t.checkout_total_pay}</span>
                <span className="text-[#00A3CC]">${totalRaw.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a09]" />}>
      <CheckoutContent />
    </Suspense>
  );
}
