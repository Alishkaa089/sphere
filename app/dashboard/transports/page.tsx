"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Car, Search, Plus, Trash2, Edit } from "lucide-react";
import { generateVehicles } from "@/utils/mockData";

export default function AdminTransportsPage() {
   const [items, setItems] = useState<any[]>([]);
   const [search, setSearch] = useState("");

   useEffect(() => {
     setItems(generateVehicles());
   }, []);

   const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.loc.toLowerCase().includes(search.toLowerCase()));

   return (
      <div className="p-8 lg:p-12">
         <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
               <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                 <Car className="w-8 h-8 text-rose-500" /> Bütün Avtomobillər
               </motion.h1>
               <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 font-medium">Bazada olan {items.length} avtomobilə nəzarət edin.</motion.p>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Maşın axtar..." 
                   className="pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:outline-none focus:border-red-500 text-white min-w-[250px]"
                 />
               </div>
               <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 transition-colors">
                  <Plus className="w-5 h-5" /> Yeni 
               </button>
            </div>
         </header>

         <div className="bg-black/30 border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                 <thead>
                    <tr className="border-b border-white/10 text-slate-500">
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Şəkil</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Marka / Başlıq</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Lokasiya</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Güc</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Qiymət</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4 text-right">Əməliyyat</th>
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
                          <td className="py-4 px-4 text-slate-400">{item.country}, {item.loc}</td>
                          <td className="py-4 px-4 font-bold text-rose-400">{item.power}</td>
                          <td className="py-4 px-4 font-black text-white">${item.price}</td>
                          <td className="py-4 px-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                               <button className="p-2 bg-white/5 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                               <button className="p-2 bg-white/5 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {filtered.length === 0 && (
                 <div className="text-center py-20 text-slate-500 font-bold">Heç bir avtomobil tapılmadı.</div>
              )}
            </div>
         </div>
      </div>
   );
}
