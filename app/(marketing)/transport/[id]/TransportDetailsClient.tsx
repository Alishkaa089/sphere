"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, ShieldCheck, Battery, Gauge, Zap } from "lucide-react";
import { motion } from "framer-motion";
import BookingWidget from "@/components/booking/BookingWidget";
import { useLanguage } from "@/context/LanguageContext";

export default function TransportDetailsClient({ vehicle }: { vehicle: any }) {
  const { t } = useLanguage();
  const [reservationDays, setReservationDays] = useState(1);

  if (!vehicle) return null;

  const priceVal = vehicle.price;
  const discountAmount = vehicle.status === "Satış" ? 0 : priceVal * 0.1 * reservationDays;
  const isSale = vehicle.status === "Satış";

  return (
    <div className="min-h-screen bg-[#0a0a09] text-white">
      
      {/* Dynamic Header */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 pointer-events-none flex justify-between items-center">
        <Link href="/transport" className="pointer-events-auto w-12 h-12 bg-black/50 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all focus:outline-none shadow-2xl">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Hero Visual Section */}
      <div className="relative h-[65vh] md:h-[80vh] w-full">
        <motion.img 
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src={vehicle.img} 
          alt={vehicle.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a09] via-[#0a0a09]/50 to-transparent" />
        <div className="absolute bottom-12 left-6 md:left-24 max-w-4xl pr-6">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap items-center gap-3 mb-4"
          >
             <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white border border-white/20 backdrop-blur-md shadow-2xl ${isSale ? 'bg-emerald-500/80' : 'bg-purple-500/80'}`}>
               {isSale ? t.home_sale : t.home_rent}
             </span>
             <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/20 backdrop-blur-md">
               <Star className="w-4 h-4 fill-amber-400" /> {vehicle.rating}
             </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] drop-shadow-2xl mb-4"
          >
            {vehicle.title}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-2 text-[#7FD4E8] font-bold text-lg md:text-xl drop-shadow-md"
          >
            <MapPin className="w-5 h-5" /> {vehicle.city}, {vehicle.country}
          </motion.div>
        </div>
      </div>

      {/* Overview & Core Specs */}
      <div className="max-w-7xl mx-auto px-6 lg:px-24 -mt-8 relative z-20 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-12"
            >
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <Battery className="w-8 h-8 text-[#00A3CC] mb-3" />
                    <span className="text-3xl font-black text-white mb-1">{vehicle.battery}%</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.trans_battery}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <Gauge className="w-8 h-8 text-[#00A3CC] mb-3" />
                    <span className="text-3xl font-black text-white mb-1">{vehicle.range}km</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.trans_range}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <Zap className="w-8 h-8 text-[#00A3CC] mb-3" />
                    <span className="text-3xl font-black text-white mb-1">{vehicle.power}</span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.trans_power}</span>
                </div>
            </motion.div>

            <div className="mb-16">
                <h2 className="text-2xl font-black mb-6 border-b border-white/10 pb-4">{t.det_desc_title}</h2>
                <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed font-medium">
                    <p className="mb-6">
                        {vehicle.title} - {t.cat_trans_desc}
                    </p>
                    <div className="bg-emerald-900/20 border border-emerald-500/20 rounded-2xl p-6 mb-8 flex items-start gap-4">
                        <ShieldCheck className="w-8 h-8 text-emerald-400 flex-shrink-0" />
                        <div>
                            <h4 className="text-lg font-black text-white mb-1">{t.det_inspect_badge}</h4>
                            <p className="text-sm text-emerald-200 leading-relaxed">
                                {t.home_trust_desc}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mb-16">
                <h2 className="text-2xl font-black mb-6 border-b border-white/10 pb-4">{t.det_loc_target}</h2>
                <div className="w-full h-[400px] bg-zinc-900 rounded-3xl overflow-hidden relative border border-white/10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=14&size=800x400&maptype=roadmap&markers=color:blue%7Clabel:S%7C40.7128,-74.0060&style=feature:all|element:labels.text.fill|color:0x8ec3b9&style=feature:all|element:labels.text.stroke|color:0x1a3646&style=feature:administrative.country|element:geometry.stroke|color:0x4b6878&style=feature:administrative.land_parcel|element:labels.text.fill|color:0x64779e&style=feature:landscape.man_made|element:geometry.stroke|color:0x334e87&style=feature:landscape.natural|element:geometry|color:0x023e58&style=feature:poi|element:geometry|color:0x283d6a&style=feature:poi|element:labels.text.fill|color:0x6f9ba5&style=feature:poi|element:labels.text.stroke|color:0x1d2c4d&style=feature:road|element:geometry|color:0x304a7d&style=feature:road|element:labels.text.fill|color:0x98a5be&style=feature:road.highway|element:geometry|color:0x2c6675&style=feature:road.highway|element:geometry.stroke|color:0x255763&style=feature:road.highway|element:labels.text.fill|color:0xb0d5ce&style=feature:road.highway|element:labels.text.stroke|color:0x023e58&style=feature:transit|element:labels.text.fill|color:0x98a5be&style=feature:water|element:geometry|color:0x0e1626&style=feature:water|element:labels.text.fill|color:0x4e6d70')] opacity-50 bg-cover bg-center mix-blend-luminosity grayscale contrast-125" />
                    <div className="relative z-10 bg-black/60 backdrop-blur-xl border border-white/20 p-6 rounded-2xl text-center shadow-2xl">
                        <MapPin className="w-10 h-10 text-[#00A3CC] mx-auto mb-3" />
                        <h4 className="text-xl font-black text-white">{vehicle.city}</h4>
                        <p className="text-slate-400 font-bold">{vehicle.country}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* -------------------- FLOATING BOOKING WIDGET -------------------- */}
        <div className="lg:col-span-1 relative">
           <div className="sticky top-12">
             <BookingWidget 
               product={vehicle} 
               isSale={isSale}
               priceVal={priceVal}
               discountAmount={discountAmount}
               reservationDays={reservationDays}
               setReservationDays={setReservationDays}
               t={t}
             />
           </div>
        </div>
      </div>
    </div>
  );
}
