"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Search, CheckCircle2, DownloadCloud } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { getAllOrdersAdmin } from "@/lib/actions";

export default function AdminOrdersPage() {
   const { t } = useLanguage();
   const [orders, setOrders] = useState<any[]>([]);
   const [search, setSearch] = useState("");
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const loadData = async () => {
       const res = await getAllOrdersAdmin();
       if (res.success && res.orders) {
         setOrders(res.orders);
       }
       setLoading(false);
     };
     loadData();
   }, []);

   const filtered = orders.filter(i => i.title?.toLowerCase().includes(search.toLowerCase()) || i.id?.toLowerCase().includes(search.toLowerCase()));

   return (
      <div className="p-8 lg:p-12">
         <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
               <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                 <CalendarCheck className="w-8 h-8 text-emerald-500" /> {t.admin_orders_title}
               </motion.h1>
               <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 font-medium">{t.admin_orders_subtitle}</motion.p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder={t.admin_orders_search_ph} 
                   className="pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:outline-none focus:border-red-500 text-white min-w-[250px]"
                 />
               </div>
               <button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-colors">
                  <DownloadCloud className="w-5 h-5" /> {t.admin_orders_btn_export} 
               </button>
            </div>
         </header>

         <div className="bg-black/30 border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                 <thead>
                    <tr className="border-b border-white/10 text-slate-500">
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_orders_th_img}</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_orders_th_product}</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_orders_th_type}</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_orders_th_amount}</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_orders_th_date}</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_orders_th_status}</th>
                    </tr>
                 </thead>
                 <tbody>
                    {filtered.map((item, idx) => (
                       <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                             <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 relative">
                               <img src={item.img} alt="img" className="w-full h-full object-cover" />
                             </div>
                          </td>
                          <td className="py-4 px-4 font-bold text-white max-w-[250px] truncate">
                             <div className="text-sm font-medium text-slate-400">#ORD-{Date.now().toString().slice(-4) + idx}</div>
                             <div className="text-white mt-1">{item.title}</div>
                          </td>
                          <td className="py-4 px-4">
                             <span className={`px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest ${item.type === "Satınalma" || item.type === "Purchase" ? "bg-emerald-500/20 text-emerald-400" : "bg-[#006B8A]/20 text-[#00A3CC]"}`}>
                                {item.type === "Satınalma" || item.type === "Purchase" ? t.prof_order_type_sale : t.prof_order_type_rent}
                             </span>
                          </td>
                          <td className="py-4 px-4 font-black text-emerald-400">${(item.totalPrice || item.priceRaw || 0).toLocaleString()}</td>
                          <td className="py-4 px-4 text-slate-400 text-sm font-medium">
                             {item.type === "İcarə" || item.type === "Rental" ? `${item.start} — ${item.end} (${item.totalDays} ${t.word_day})` : t.admin_orders_type_sale}
                          </td>
                          <td className="py-4 px-4">
                             <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold uppercase tracking-widest">
                               <CheckCircle2 className="w-4 h-4" /> {t.admin_orders_status_all_ok}
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {filtered.length === 0 && (
                 <div className="text-center py-20 text-slate-500 font-bold">{t.admin_orders_no_found}</div>
              )}
            </div>
         </div>
      </div>
   );
}
