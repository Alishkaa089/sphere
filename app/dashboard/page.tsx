"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Building, Car, ArrowUpRight, CheckCircle2, DollarSign, Activity, TrendingUp, CalendarCheck, ShieldCheck, Download, Clock } from "lucide-react";
import { getAdminStats } from "../../lib/actions";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminDashboardPage() {
   const { t } = useLanguage();
   const [stats, setStats] = useState({
     totalUsers: 0,
     totalRevenue: 0,
     totalProps: 0,
     totalTrans: 0,
     recentOrders: [] as any[]
   });
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const loadData = async () => {
       const res = await getAdminStats();
       if (res.success && res.stats) {
         setStats(res.stats);
       }
       setLoading(false);
     };
     loadData();
   }, []);

   const statCards = [
     { label: t.admin_total_revenue, value: `$${stats.totalRevenue.toLocaleString()}`, percent: "+24.5%", icon: <DollarSign className="w-6 h-6 text-emerald-500" /> },
     { label: t.admin_active_users, value: stats.totalUsers.toLocaleString(), percent: "+12.3%", icon: <Users className="w-6 h-6 text-[#006B8A]" /> },
     { label: t.admin_db_props, value: stats.totalProps.toLocaleString(), percent: "+4.1%", icon: <Building className="w-6 h-6 text-amber-500" /> },
     { label: t.admin_db_trans, value: stats.totalTrans.toLocaleString(), percent: "+8.9%", icon: <Car className="w-6 h-6 text-rose-500" /> },
   ];

   return (
      <div className="p-4 sm:p-8 lg:p-12">
         
         <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div>
               <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                 {t.admin_title}
               </motion.h1>
               <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-sm sm:text-base text-slate-400 font-medium tracking-wide">
                 {t.admin_subtitle}
               </motion.p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-5 py-2">
               <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] sm:text-sm font-bold text-white uppercase tracking-widest">{t.admin_live_data}</span>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="col-span-1 lg:col-span-2 bg-black/30 border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl flex flex-col h-[600px]">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                   <Activity className="w-5 h-5 text-red-500" /> {t.admin_recent_orders}
                 </h3>
                 <button className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                   {t.admin_view_all} <ArrowUpRight className="w-4 h-4"/>
                 </button>
               </div>
               
               {stats.recentOrders.length > 0 ? (
                  <div className="overflow-x-auto overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <table className="w-full text-left min-w-[600px]">
                      <thead>
                        <tr className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5">
                           <th className="pb-4">{t.admin_order_no}</th>
                           <th className="pb-4">{t.admin_product}</th>
                           <th className="pb-4">{t.admin_type}</th>
                           <th className="pb-4">{t.admin_amount}</th>
                           <th className="pb-4">{t.admin_status}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {stats.recentOrders.map((order, idx) => (
                           <tr key={idx} className="group hover:bg-white/5 transition-colors">
                             <td className="py-4 text-sm font-bold text-slate-400">#{(order.id || idx + 1001).toString().slice(-4)}</td>
                             <td className="py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                                      {order.img && <img src={order.img} alt={order.title} className="w-full h-full object-cover" />}
                                   </div>
                                   <span className="text-sm font-black text-white truncate max-w-[150px]">{order.title}</span>
                                </div>
                             </td>
                             <td className="py-4">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${order.type === 'Satınalma' || order.type === 'Purchase' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                                   {order.type === 'Satınalma' || order.type === 'Purchase' ? t.prof_order_type_sale : t.prof_order_type_rent}
                                </span>
                             </td>
                             <td className="py-4 font-black text-white text-sm">${(order.totalPrice || 0).toLocaleString()}</td>
                             <td className="py-4">
                                <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase tracking-widest font-mono">
                                   <CheckCircle2 className="w-3.5 h-3.5" />
                                   {t.admin_paid}
                                </div>
                             </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-20 opacity-30">
                    <Clock className="w-12 h-12 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">{t.admin_no_orders}</p>
                    <p className="text-xs mt-1 lowercase">{t.admin_no_orders_desc}</p>
                  </div>
               )}
            </motion.div>

            {/* System Health */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-zinc-900 border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col justify-between h-[600px]">
               <div>
                  <h3 className="text-xl font-black text-white mb-8 pb-4 border-b border-white/5">{t.admin_sys_status}</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <ShieldCheck className="w-5 h-5" />
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-emerald-400">{t.admin_sys_status}</h4>
                          <p className="text-[10px] text-emerald-500/70 font-medium">{t.admin_sys_desc}</p>
                       </div>
                    </div>

                    <div className="space-y-4 pt-4">
                       <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                          <span>{t.admin_central_server}</span>
                          <span className="text-emerald-500 font-mono">24ms</span>
                       </div>
                       <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                          <span>{t.admin_payment_gateway}</span>
                          <span className="text-emerald-500 font-mono">Online</span>
                       </div>
                       <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                          <span>{t.admin_db}</span>
                          <span className="text-emerald-500 font-mono">Active</span>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="mt-8">
                  <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl border border-white/5 transition-all shadow-xl flex justify-center items-center gap-3">
                     <Download className="w-4 h-4" /> {t.admin_export_reports}
                  </button>
               </div>
            </motion.div>
         </div>
      </div>
   );
}
