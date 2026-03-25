"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CreditCard, Sparkles, Building2, Car, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BookingWidget({ 
  product, 
  isSale, 
  priceVal, 
  discountAmount, 
  reservationDays, 
  setReservationDays,
  t
}: any) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => setIsClient(true), []);

  const serviceFee = isSale ? priceVal * 0.05 : 250;
  const theFinalAmount = isSale ? priceVal + serviceFee : (priceVal * reservationDays) + serviceFee - discountAmount;

  const handleBooking = () => {
    if (!localStorage.getItem("userLoggedIn")) {
      setAuthError(t.widget_auth_req);
      setTimeout(() => setAuthError(""), 3000);
      return;
    }
    const safeData = {
      image: product.img || "",
      title: product.title || "",
      price: product.price || "0",
      totalCost: theFinalAmount,
      rentalDays: isSale ? 0 : reservationDays,
      transactionType: isSale ? "sale" : "rent", // For checkout page to know
      date: new Date().toLocaleDateString()
    };
    
    localStorage.setItem("pendingCheckout", JSON.stringify(safeData));
    router.push("/checkout");
  };

  return (
    <div className="bg-[#0f0f0e]/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow behind widget */}
        <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-blue-500/10 blur-[80px] rounded-full point-events-none" />
        
        <div className="mb-8 border-b border-white/10 pb-6 relative z-10">
            <h3 className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-2">
              {isSale ? t.val_prop_price : t.val_rent_price}
            </h3>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-black text-white">${product.price}</span>
                {!isSale && <span className="text-lg font-bold text-slate-500">/ {t.word_day}</span>}
            </div>
            {!isSale && (
                <div className="mt-4 flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 relative z-10">
                    <span className="text-sm font-bold text-slate-400">Total {t.word_day}:</span>
                    <input 
                      type="number" 
                      min="1" 
                      value={reservationDays} 
                      onChange={(e) => setReservationDays(parseInt(e.target.value) || 1)}
                      className="w-16 bg-black border border-white/10 rounded-lg px-2 py-1 text-center font-bold text-white focus:outline-none focus:border-blue-500 relative z-20"
                    />
                </div>
            )}
        </div>

        <div className="space-y-4 mb-8 relative z-10">
            <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400 uppercase tracking-widest">{t.widget_service_fee}</span>
                <span className="text-white">${serviceFee.toLocaleString()}</span>
            </div>
            {!isSale && discountAmount > 0 && (
                <div className="flex justify-between items-center text-sm font-bold text-emerald-400">
                    <span className="uppercase tracking-widest">Güzəşt (Discount)</span>
                    <span>-${discountAmount.toLocaleString()}</span>
                </div>
            )}
            <div className="flex justify-between items-center text-lg mt-6 pt-6 border-t border-white/10">
                <span className="text-white font-black uppercase tracking-widest">{t.widget_total}</span>
                <span className="text-blue-400 font-black">${theFinalAmount.toLocaleString()}</span>
            </div>
        </div>

        {authError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3 relative z-10">
             <LogIn className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
             <p className="text-xs font-bold text-red-300 leading-snug">{authError}</p>
          </motion.div>
        )}

        <button 
           onClick={handleBooking}
           className="relative z-10 w-full py-5 rounded-2xl font-black text-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/20 text-white"
        >
            <Wallet className="w-5 h-5" /> 
            {isSale ? t.btn_buy : t.btn_rent_now}
        </button>

        <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-1.5 font-bold relative z-10">
            <CreditCard className="w-4 h-4" /> Visa, Mastercard
        </p>
    </div>
  );
}
