"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Search, CheckCircle2, DownloadCloud, User, Mail, Calendar, Tag } from "lucide-react";
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

   const filtered = orders.filter(i => 
     i.title?.toLowerCase().includes(search.toLowerCase()) || 
     i.id?.toLowerCase().includes(search.toLowerCase()) ||
     i.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
     i.user?.email?.toLowerCase().includes(search.toLowerCase())
   );

   if (loading) return <div className="p-12 text-white font-black uppercase tracking-widest">Yüklənir...</div>;

   return (
      <div className="p-8 lg:p-12">
         <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
               <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                 <CalendarCheck className="w-8 h-8 text-[#006B8A]" /> Sifarişlərin İdarəedilməsi
               </motion.h1>
               <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-500 font-medium tracking-wide uppercase text-xs">Sistemdəki bütün satış və icarə əməliyyatlarına nəzarət edin</motion.p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Məhsul, Müştəri və ya Email..." 
                   className="pl-12 pr-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl focus:outline-none focus:border-[#006B8A] text-white min-w-[320px] shadow-2xl transition-all"
                 />
               </div>
            </div>
         </header>

         <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                 <thead>
                    <tr className="border-b border-white/10 text-slate-500">
                       <th className="pb-6 font-black uppercase text-[10px] tracking-widest px-4">MƏHSUL</th>
                       <th className="pb-6 font-black uppercase text-[10px] tracking-widest px-4">ALICI MƏLUMATLARI</th>
                       <th className="pb-6 font-black uppercase text-[10px] tracking-widest px-4">ƏMƏLİYYAT NÖVÜ</th>
                       <th className="pb-6 font-black uppercase text-[10px] tracking-widest px-4">MƏBLƏĞ</th>
                       <th className="pb-6 font-black uppercase text-[10px] tracking-widest px-4">TARİX / MÜDDƏT</th>
                       <th className="pb-6 font-black uppercase text-[10px] tracking-widest px-4">STATUS</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {filtered.map((item, idx) => (
                       <tr key={item.id} className="hover:bg-white/5 transition-all group">
                          <td className="py-6 px-4">
                             <div className="flex items-center gap-4">
                               <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 relative flex-shrink-0">
                                 <img src={item.img || "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg"} alt="img" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                               </div>
                               <div>
                                  <div className="text-xs font-black text-[#00A3CC] uppercase tracking-tighter mb-0.5">#{item.id.slice(0,8)}</div>
                                  <div className="text-white font-black text-sm">{item.title}</div>
                               </div>
                             </div>
                          </td>
                          <td className="py-6 px-4">
                             <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-white font-bold text-sm">
                                   <User className="w-3.5 h-3.5 text-slate-500" /> {item.user?.name || "Naməlum"}
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-xs">
                                   <Mail className="w-3.5 h-3.5 text-slate-500" /> {item.user?.email || "-"}
                                </div>
                             </div>
                          </td>
                          <td className="py-6 px-4">
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${item.type === "Satınalma" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-[#006B8A]/10 text-[#00A3CC] border border-[#006B8A]/20"}`}>
                                <Tag className="w-3.5 h-3.5" />
                                {item.type === "Satınalma" ? "SATIŞ" : "İCARƏ"}
                             </span>
                          </td>
                          <td className="py-6 px-4">
                             <div className="text-white font-black text-lg">${(item.totalPrice || 0).toLocaleString()}</div>
                          </td>
                          <td className="py-6 px-4">
                             <div className="flex flex-col gap-1">
                                {item.type === "İcarə" ? (
                                   <>
                                      <div className="flex items-center gap-2 text-white text-xs font-bold">
                                         <Calendar className="w-3.5 h-3.5 text-[#00A3CC]" /> 
                                         {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                      </div>
                                   </>
                                ) : (
                                   <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">Daimi Mülkiyyət</div>
                                )}
                                <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest">
                                   Qeydiyyat: {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                             </div>
                          </td>
                          <td className="py-6 px-4">
                             <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                               <CheckCircle2 className="w-4 h-4" /> TAMAMLANDI
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {filtered.length === 0 && (
                 <div className="text-center py-24 text-slate-500 font-black uppercase tracking-widest border-t border-white/5">Heç bir sifariş tapılmadı</div>
              )}
            </div>
         </div>
      </div>
   );
}
