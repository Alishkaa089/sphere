"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building, Search, Plus, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { getAllPropertiesAdmin } from "@/lib/actions";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminPropertiesPage() {
   const { t } = useLanguage();
   const [items, setItems] = useState<any[]>([]);
   const [search, setSearch] = useState("");
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const fetchData = async () => {
       const res = await getAllPropertiesAdmin();
       if (res.success && res.properties) {
         setItems(res.properties);
       }
       setLoading(false);
     };
     fetchData();
   }, []);

    const filtered = items.filter(i => 
      (i.title?.toLowerCase() || "").includes(search.toLowerCase()) || 
      (i.city?.toLowerCase() || "").includes(search.toLowerCase())
    );

   return (
      <div className="p-8 lg:p-12">
         <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
               <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                 <Building className="w-8 h-8 text-amber-500" /> {t.admin_props_title}
               </motion.h1>
               <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 font-medium">{t.admin_props_subtitle?.replace("{count}", items.length.toString())}</motion.p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder={t.admin_props_search_ph} 
                   className="pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:outline-none focus:border-[#006B8A] text-white min-w-[250px]"
                 />
               </div>
               <Link href="/dashboard/properties/add" className="bg-[#006B8A] hover:bg-[#004E64] text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-colors">
                  <Plus className="w-5 h-5" /> {t.admin_props_btn_new} 
               </Link>
            </div>
         </header>

         {loading ? (
             <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00A3CC]"></div></div>
         ) : (
          <div className="bg-black/30 border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left whitespace-nowrap">
                  <thead>
                     <tr className="border-b border-white/10 text-slate-500">
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_props_th_img}</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_props_th_title}</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_props_th_loc}</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_props_th_price}</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_props_th_cat}</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4 text-right">{t.admin_props_th_action}</th>
                     </tr>
                  </thead>
                  <tbody>
                     {filtered.map((item, idx) => (
                        <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                           <td className="py-4 px-4">
                              <div className="w-16 h-12 rounded-lg overflow-hidden border border-white/10 relative">
                                <img src={item.img} alt="img" className="w-full h-full object-cover" />
                              </div>
                           </td>
                           <td className="py-4 px-4 font-bold text-white max-w-[250px] truncate">{item.title}</td>
                           <td className="py-4 px-4 text-slate-400">{item.country}, {item.city}</td>
                           <td className="py-4 px-4 font-black text-amber-400">${item.price.toLocaleString()}</td>
                           <td className="py-4 px-4">
                              <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-slate-300">
                                {item.category}
                              </span>
                           </td>
                           <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button className="p-2 bg-white/5 hover:bg-[#006B8A]/20 text-[#00A3CC] rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                                <button className="p-2 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
               {filtered.length === 0 && (
                  <div className="text-center py-20 text-slate-500 font-bold">{t.admin_props_no_found}</div>
               )}
             </div>
          </div>
         )}
      </div>
   );
}
