"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Building, Car, ArrowUpRight, CheckCircle2, DollarSign, Activity, TrendingUp, CalendarCheck } from "lucide-react";
import { generateProperties, generateVehicles } from "@/utils/mockData";

export default function AdminDashboardPage() {
   const [stats, setStats] = useState({
     totalUsers: 0,
     totalRevenue: 0,
     totalProps: 0,
     totalTrans: 0,
     recentOrders: [] as any[]
   });

   useEffect(() => {
      const loadRealData = () => {
         // Users: 1 Admin + generic simulated base
         const baseUsers = 14502;

         // Get real items
         const props = generateProperties();
         const trans = generateVehicles();

         // Get real revenue from placed orders in this browser + simulated global
         const storedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
         
         const realRevenue = storedOrders.reduce((sum: number, order: any) => sum + (order.totalPrice || order.priceRaw || 0), 0);
         const simulatedGlobalRev = 4500000; // Simulated existing global sales

         setStats({
            totalUsers: baseUsers + (storedOrders.length > 0 ? 1 : 0),
            totalRevenue: simulatedGlobalRev + realRevenue,
            totalProps: props.length,
            totalTrans: trans.length,
            recentOrders: storedOrders.reverse().slice(0, 5) // Last 5 orders
         });
      };

      loadRealData();
   }, []);

   const statCards = [
     { label: "Ümumi Dövriyyə", value: `$${stats.totalRevenue.toLocaleString()}`, percent: "+24.5%", icon: <DollarSign className="w-6 h-6 text-emerald-500" /> },
     { label: "Aktiv İstifadəçilər", value: stats.totalUsers.toLocaleString(), percent: "+12.3%", icon: <Users className="w-6 h-6 text-blue-500" /> },
     { label: "Bazada Mülklər", value: stats.totalProps.toLocaleString(), percent: "+4.1%", icon: <Building className="w-6 h-6 text-amber-500" /> },
     { label: "Bazada Avtomobillər", value: stats.totalTrans.toLocaleString(), percent: "+8.9%", icon: <Car className="w-6 h-6 text-rose-500" /> },
   ];

   return (
      <div className="p-4 sm:p-8 lg:p-12">
         
         <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div>
               <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">Ümumi İdarə Paneli</motion.h1>
               <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm sm:text-base text-slate-400 font-medium tracking-wide">SPHERE qlobal satış və icarə statistikası.</motion.p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-5 py-2">
               <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] sm:text-sm font-bold text-white uppercase tracking-widest">Canlı Data</span>
            </div>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((card, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, scale: 0.95 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 transition={{ delay: i * 0.1 }}
                 className="bg-black/30 border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors shadow-2xl"
               >
                 <div className="flex justify-between items-start mb-6">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                     {card.icon}
                   </div>
                   <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                     <TrendingUp className="w-3 h-3" /> {card.percent}
                   </div>
                 </div>
                 <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{card.label}</h4>
                 <h2 className="text-3xl font-black text-white">{card.value}</h2>
                 
                 {/* Internal Glow Hover Pattern */}
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
               </motion.div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="col-span-2 bg-black/30 border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col h-[500px]">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                   <Activity className="w-5 h-5 text-red-500" /> Son Satışlar / Rezervlər
                 </h3>
                 <button className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1">Hamısına Bax <ArrowUpRight className="w-4 h-4"/></button>
               </div>
               
               {stats.recentOrders.length > 0 ? (
                  <div className="overflow-x-auto overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <table className="w-full text-left min-w-[600px]">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="pb-4 text-[10px] sm:text-xs font-black uppercase text-slate-500">Sifariş №</th>
                          <th className="pb-4 text-[10px] sm:text-xs font-black uppercase text-slate-500">Məhsul</th>
                          <th className="pb-4 text-[10px] sm:text-xs font-black uppercase text-slate-500">Tip</th>
                          <th className="pb-4 text-[10px] sm:text-xs font-black uppercase text-slate-500">Məbləğ</th>
                          <th className="pb-4 text-[10px] sm:text-xs font-black uppercase text-slate-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders.map((order: any, idx: number) => (
                           <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                             <td className="py-4 text-sm font-medium text-slate-400">#ORD-{Date.now().toString().slice(-6) + idx}</td>
                             <td className="py-4 text-sm font-bold text-white max-w-[200px] truncate">{order.title}</td>
                             <td className="py-4">
                               <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${order.type === "Satınalma" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
                                 {order.type}
                               </span>
                             </td>
                             <td className="py-4 text-sm font-black text-white">${(order.totalPrice || order.priceRaw).toLocaleString()}</td>
                             <td className="py-4">
                               <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                                 <CheckCircle2 className="w-4 h-4" /> Ödənilib
                               </div>
                             </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
                     <CalendarCheck className="w-12 h-12 text-slate-600 mb-3" />
                     <p className="text-slate-400 font-bold">Hələlik heç bir real sifariş (rezerv) qeydə alınmayıb.</p>
                     <p className="text-xs text-slate-500 mt-1">Siz saytın özündə bir məhsul aldıqda, o burada görünəcək.</p>
                  </div>
               )}
            </motion.div>

            {/* Quick Actions / System Health */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between">
               <div>
                  <h3 className="text-xl font-black text-white mb-2">Sistem Vəziyyəti</h3>
                  <p className="text-red-200/60 font-medium mb-6">Bütün xidmətlər operativ fəaliyyətdədir. Server işlək vəziyyətdədir.</p>
               </div>
               
               <div className="space-y-4">
                  <div className="bg-black/40 p-4 rounded-2xl flex items-center justify-between border border-white/5 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <span className="font-bold text-slate-300 relative z-10">Mərkəzi Server</span>
                     <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-md relative z-10">Online</span>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl flex items-center justify-between border border-white/5 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <span className="font-bold text-slate-300 relative z-10">Ödəniş Keçidi (Stripe)</span>
                     <span className="text-xs font-black uppercase text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-md relative z-10">Online</span>
                  </div>
                  <div className="bg-black/40 p-4 rounded-2xl flex items-center justify-between border border-white/5 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <span className="font-bold text-slate-300 relative z-10">Məlumat Bazası</span>
                     <span className="text-xs font-black uppercase text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-md relative z-10">Syncing</span>
                  </div>
               </div>

               <div className="mt-8 pt-6 border-t border-red-500/20">
                  <button className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-red-600/20 flex justify-center items-center gap-2">
                     Bütün Hesabatları Çıxar <ArrowUpRight className="w-4 h-4" />
                  </button>
               </div>
            </motion.div>
         </div>
      </div>
   );
}
