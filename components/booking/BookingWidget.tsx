"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, CreditCard, LogIn, Calendar as CalendarIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getReservedDates } from "@/lib/actions";

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [reservedDates, setReservedDates] = useState<Date[]>([]);

  useEffect(() => {
    setIsClient(true);
    // Fetch reserved dates for this product
    if (product?.id) {
      getReservedDates(product.id).then(res => {
        if (res.success && res.reservedDates) {
          const allDates: Date[] = [];
          res.reservedDates.forEach((range: any) => {
            let curr = new Date(range.startDate);
            const end = new Date(range.endDate);
            while (curr <= end) {
              allDates.push(new Date(curr));
              curr.setDate(curr.getDate() + 1);
            }
          });
          setReservedDates(allDates);
        }
      });
    }
  }, [product?.id]);

  const calculateDays = (range: [Date, Date] | null) => {
    if (!range || !range[0] || !range[1]) return 1;
    const diffTime = Math.abs(range[1].getTime() - range[0].getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  };

  const handleDateChange = (value: any) => {
    setDateRange(value);
    const days = calculateDays(value);
    setReservationDays(days);
  };

  const isTileDisabled = ({ date, view }: any) => {
    if (view === 'month') {
      return reservedDates.some(d => 
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    }
    return false;
  };

  const serviceFee = isSale ? priceVal * 0.05 : 250;
  const currentDiscount = isSale ? 0 : priceVal * 0.1 * (reservationDays > 5 ? reservationDays : 0); 
  const theFinalAmount = isSale ? priceVal + serviceFee : (priceVal * reservationDays) + serviceFee - currentDiscount;

  const handleBooking = () => {
    if (!localStorage.getItem("userLoggedIn")) {
      setAuthError(t.widget_auth_req);
      setTimeout(() => setAuthError(""), 3000);
      return;
    }
    if (!isSale && (!dateRange || !dateRange[0] || !dateRange[1])) {
       alert("Zəhmət olmasa təqvimdən tarix aralığı seçin.");
       setShowCalendar(true);
       return;
    }

    const safeData = {
      productId: product.id,
      image: product.img || "",
      title: product.title || "",
      price: product.price || "0",
      totalCost: theFinalAmount,
      rentalDays: isSale ? 0 : reservationDays,
      transactionType: isSale ? "sale" : "rent",
      date: new Date().toLocaleDateString(),
      startDate: dateRange ? dateRange[0].toISOString() : null,
      endDate: dateRange ? dateRange[1].toISOString() : null
    };
    
    localStorage.setItem("pendingCheckout", JSON.stringify(safeData));
    router.push("/checkout");
  };

  return (
    <div className="bg-[#0f0f0e]/95 backdrop-blur-3xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        <style jsx global>{`
          .react-calendar {
            background: #18181b !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 1.5rem !important;
            color: white !important;
            font-family: inherit !important;
            overflow: hidden !important;
            width: 100% !important;
          }
          .react-calendar__navigation button {
            color: white !important;
            font-weight: 800 !important;
          }
          .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus {
            background-color: #27272a !important;
            border-radius: 0.5rem !important;
          }
          .react-calendar__tile {
            color: #94a3b8 !important;
            font-weight: 600 !important;
            padding: 12px !important;
          }
          .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus {
            background-color: #27272a !important;
            border-radius: 0.5rem !important;
          }
          .react-calendar__tile--now {
            background: rgba(0, 163, 204, 0.1) !important;
            color: #00A3CC !important;
            border-radius: 0.5rem !important;
          }
          .react-calendar__tile--active {
            background: #006B8A !important;
            color: white !important;
            border-radius: 0.5rem !important;
          }
          .react-calendar__tile--rangeStart, .react-calendar__tile--rangeEnd {
             background: #00A3CC !important;
          }
          .react-calendar__tile:disabled {
            background-color: #331111 !important;
            color: #664444 !important;
            cursor: not-allowed !important;
            text-decoration: line-through;
          }
          .react-calendar__month-view__weekdays__weekday {
            color: #64748b !important;
            text-decoration: none !important;
            font-size: 0.7rem !important;
            font-weight: 900 !important;
            text-transform: uppercase !important;
          }
        `}</style>

        <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-[#006B8A]/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="mb-8 border-b border-white/10 pb-6 relative z-10">
            <h3 className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-2">
              {isSale ? t.val_prop_price : t.val_rent_price}
            </h3>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl lg:text-5xl font-black text-white">${product.price.toLocaleString()}</span>
                {!isSale && <span className="text-lg font-bold text-slate-500">/ {t.word_day}</span>}
            </div>

            {!isSale && (
                <button 
                  onClick={() => setShowCalendar(true)}
                  className="w-full mt-6 flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-2xl border border-white/10 transition-all text-left group"
                >
                    <div>
                      <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t.widget_start_date} - {t.widget_end_date}</span>
                      <span className="text-sm font-bold text-white">
                        {dateRange ? `${dateRange[0].toLocaleDateString()} - ${dateRange[1].toLocaleDateString()}` : "Tarix seçin"}
                      </span>
                    </div>
                    <CalendarIcon className="w-5 h-5 text-[#00A3CC] group-hover:scale-110 transition-transform" />
                </button>
            )}
        </div>

        <div className="space-y-4 mb-8 relative z-10">
            <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">{t.widget_service_fee}</span>
                <span className="text-white">${serviceFee.toLocaleString()}</span>
            </div>
            {!isSale && currentDiscount > 0 && (
                <div className="flex justify-between items-center text-xs font-black text-emerald-400 uppercase tracking-widest">
                    <span>Güzəşt (10% Off)</span>
                    <span>-${currentDiscount.toLocaleString()}</span>
                </div>
            )}
            <div className="flex justify-between items-center text-lg mt-6 pt-6 border-t border-white/10">
                <span className="text-white font-black uppercase tracking-widest text-sm">{t.widget_total} {reservationDays > 0 ? `(${reservationDays} ${t.word_day})` : ''}</span>
                <span className="text-[#00A3CC] font-black">${theFinalAmount.toLocaleString()}</span>
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
           className="relative z-10 w-full py-5 rounded-[20px] font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 bg-gradient-to-r from-[#004E64] to-[#00394A] shadow-xl shadow-[#006B8A]/20 text-white group"
        >
            <Wallet className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
            {isSale ? t.btn_buy : t.btn_rent_now}
        </button>

        {/* Calendar Modal */}
        <AnimatePresence>
          {showCalendar && (
            <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className="bg-zinc-900 border border-white/10 p-8 rounded-[40px] max-w-md w-full relative"
               >
                  <button onClick={() => setShowCalendar(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                  <h3 className="text-2xl font-black text-white mb-6 pr-12">Rezervasiya Tarixləri</h3>
                  <Calendar 
                    onChange={handleDateChange} 
                    selectRange={true} 
                    value={dateRange}
                    minDate={new Date()}
                    tileDisabled={isTileDisabled}
                  />
                  <button 
                    onClick={() => setShowCalendar(false)}
                    className="w-full mt-8 py-4 rounded-2xl bg-[#004E64] text-white font-black hover:bg-[#006B8A] transition-colors"
                  >
                    Təsdiqlə ({reservationDays} gün)
                  </button>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-[10px] text-slate-600 mt-6 flex items-center justify-center gap-1.5 font-black uppercase tracking-widest relative z-10">
            <CreditCard className="w-3.5 h-3.5" /> Bit şifrələmə ilə qorunur
        </p>
    </div>
  );
}
