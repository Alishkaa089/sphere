"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { generateProperties, generateVehicles } from "@/utils/mockData";
import { CreditCard, ShieldCheck, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const id = searchParams?.get("id");
  const type = searchParams?.get("type"); 
  const start = searchParams?.get("start");
  const end = searchParams?.get("end");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("userLoggedIn") !== "true") {
      window.location.href = "/register";
    }
  }, []);

  // Form States
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [showCvv, setShowCvv] = useState(false);

  const product = useMemo(() => {
    if (type === "property") return generateProperties().find(p => p.id === id);
    if (type === "transport") return generateVehicles().find(v => v.id === id);
    return null;
  }, [id, type]);

  if (!product) return <div className="min-h-screen bg-[#0a0a09] flex items-center justify-center text-white">Yüklənir...</div>;

  const isSale = product.status === "Satış";
  
  let totalRaw = product.priceRaw;
  let totalDays = 0;
  if (!isSale && start && end) {
    const diff = Math.ceil(Math.abs(new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
    totalDays = diff;
    totalRaw = product.priceRaw * diff;
  }

  // Formatting Handlers
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only letters and spaces allowed
    const val = e.target.value.replace(/[^A-Za-zƏəŞşÇçĞğÜüÖöİı\s]/g, "");
    setCardName(val);
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only digits, groups of 4
    let val = e.target.value.replace(/\D/g, "").substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "");
    
    // Auto format Month
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

    // Basic Validation Check before proceeding
    if (cardNumber.replace(/\s/g, "").length !== 16) return;
    if (expiry.length !== 5) return;
    if (cvv.length !== 3) return;

    setIsProcessing(true);
    
    setTimeout(() => {
      // Simulate locking
      if (!isSale && start && end) {
        let existing = [];
        const stored = localStorage.getItem(`reserved_${product.id}`);
        if (stored) existing = JSON.parse(stored);
        
        existing.push({ start, end });
        localStorage.setItem(`reserved_${product.id}`, JSON.stringify(existing));
      }
      
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Save order to "myOrders" for the Profile page timeline
      let userOrders = [];
      const storedOrders = localStorage.getItem("myOrders");
      if (storedOrders) userOrders = JSON.parse(storedOrders);
      
      userOrders.push({
        id: Math.random().toString(36).substring(7),
        productId: product.id,
        title: product.title,
        img: product.img,
        type: isSale ? "Satınalma" : "İcarə",
        start: isSale ? null : start,
        end: isSale ? null : end,
        totalDays: totalDays,
        price: totalRaw,
        date: new Date().toISOString()
      });
      localStorage.setItem("myOrders", JSON.stringify(userOrders));
      
      setTimeout(() => {
        router.push("/");
      }, 4000);
      
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl font-black text-white text-center mb-4">
          Ödəniş Uğurludur!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-emerald-400 font-medium text-lg text-center max-w-sm">
          Sizin "{product.title}" sifarişiniz qeydə alındı və tarixlər sizin üçün bloklandı! Gələcəkdəki lüks təcrübənizinizdən zövq alın.
        </motion.p>
      </div>
    );
  }

  const isFormValid = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) return false;
    if (expiry.length !== 5) return false;
    if (cvv.length !== 3) return false;
    if (cardName.trim().length <= 3) return false;
    
    // Check if year is >= 26 natively gracefully
    const year = parseInt(expiry.split('/')[1] || "0", 10);
    if (year < 26) return false;

    return true;
  };

  return (
    <div className="min-h-screen bg-[#0a0a09] flex py-20 px-4 items-center justify-center relative overflow-hidden">
      
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        
        {/* Payment Form */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
            <Lock className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-black text-white">Təhlükəsiz Ödəniş</h2>
          </div>

          <form onSubmit={handlePay} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kartın Üzərindəki Ad</label>
                <input 
                  required 
                  type="text" 
                  autoComplete="off"
                  value={cardName}
                  onChange={handleNameChange}
                  placeholder="John Doe" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Kart Nömrəsi</label>
                <div className="relative">
                  <CreditCard className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    required 
                    type="text" 
                    autoComplete="off"
                    value={cardNumber}
                    onChange={handleCardChange}
                    placeholder="0000 0000 0000 0000" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors tracking-widest placeholder:text-slate-600" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bitmə Tarixi (AA/İİ)</label>
                  <input 
                    required 
                    type="text" 
                    autoComplete="off"
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="AA/İİ" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">CVC/CVV</label>
                  <div className="relative">
                    <input 
                      required 
                      autoComplete="off"
                      type={showCvv ? "text" : "password"} 
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="•••" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowCvv(!showCvv)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showCvv ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button disabled={isProcessing || !isFormValid()} type="submit" className="w-full mt-8 py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? "İcra Edilir..." : `Ödə - $${totalRaw.toLocaleString()}`}
            </button>
            <p className="text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5 mt-4">
              <ShieldCheck className="w-4 h-4 text-slate-400"/> 256-bit şifrələmə ilə qorunur.
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          <div className="relative h-48 w-full">
            <img src={product.img} alt="Product" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a09] to-transparent" />
          </div>
          
          <div className="p-8 pt-0 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3 mt-[-20px] relative z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-zinc-800 text-white border border-white/10 shadow-lg`}>
                Sifarişin Detalları
              </span>
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{product.title}</h3>
            <p className="text-slate-400 font-medium mb-6 text-sm">{product.loc}, {product.country}</p>
            
            <div className="bg-black/50 rounded-2xl p-5 border border-white/5 space-y-4 flex-1">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-400">Növ</span>
                <span className="text-white">{isSale ? "Tamamlıqla Satınalma" : "Müvəqqəti İcarə"}</span>
              </div>
              
              {!isSale && (
                <>
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-400">Giriş / Çıxış</span>
                    <span className="text-white">{start} / {end}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-400">Müddət</span>
                    <span className="text-white">{totalDays} gün</span>
                  </div>
                </>
              )}
              
              <div className="h-px bg-white/10" />
              
              <div className="flex justify-between items-center text-xl font-black text-white">
                <span>Yekun</span>
                <span className="text-emerald-400">${totalRaw.toLocaleString()}</span>
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
