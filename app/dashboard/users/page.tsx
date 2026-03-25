"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Phone, Calendar, Search } from "lucide-react";

export default function AdminUsersPage() {
   const [users, setUsers] = useState<any[]>([]);

   useEffect(() => {
     // Simulated Users
     const mockUsers = [
        { id: "usr1", name: "Ramin Əliyev", email: "ramin@example.com", phone: "+994 50 123 45 67", role: "Seller", joined: "12 Mar 2026", status: "Aktiv" },
        { id: "usr2", name: "Aygün Həsənova", email: "aygun@example.com", phone: "+994 55 987 65 43", role: "User", joined: "18 Mar 2026", status: "Aktiv" },
        { id: "usr3", name: "Test User", email: "test@sphere.com", phone: "+994 70 555 55 55", role: "User", joined: "20 Mar 2026", status: "Aktiv" },
     ];
     
     if (localStorage.getItem("userRole") === "admin") {
         mockUsers.unshift({
             id: "admin0", name: "Sistem İdarəçisi", email: "Adminyekdi@gmail.com", phone: "Məxfi", role: "Admin", joined: "01 Yan 2026", status: "SuperAktiv"
         });
     }
     setUsers(mockUsers);
   }, []);

   return (
      <div className="p-8 lg:p-12">
         <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
               <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                 <Users className="w-8 h-8 text-blue-500" /> İstifadəçilər
               </motion.h1>
               <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 font-medium">Bütün qeydiyyatdan keçmiş istifadəçilər.</motion.p>
            </div>
            
            <div className="relative">
               <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                 type="text" 
                 placeholder="E-mail və ya ad axtar..." 
                 className="pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:outline-none focus:border-red-500 text-white min-w-[300px]"
               />
            </div>
         </header>

         <div className="bg-black/30 border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                 <thead>
                    <tr className="border-b border-white/10 text-slate-500">
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">İstifadəçi Adı</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">E-Mail / Əlaqə</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Qoşulma Tarixi</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Rol</th>
                       <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Status</th>
                    </tr>
                 </thead>
                 <tbody>
                    {users.map((item, idx) => (
                       <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                                 {item.name.charAt(0)}
                               </div>
                               <span className="font-bold text-white">{item.name}</span>
                             </div>
                          </td>
                          <td className="py-4 px-4">
                             <div className="flex flex-col gap-1">
                               <span className="text-sm font-medium text-slate-300 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {item.email}</span>
                               <span className="text-xs text-slate-500 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {item.phone}</span>
                             </div>
                          </td>
                          <td className="py-4 px-4 text-slate-400 text-sm"><Calendar className="w-4 h-4 inline mr-2 align-text-bottom"/>{item.joined}</td>
                          <td className="py-4 px-4">
                             <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${item.role === 'Admin' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : item.role === 'Seller' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' : 'bg-slate-500/20 text-slate-400 border border-slate-500/20'}`}>
                               {item.role}
                             </span>
                          </td>
                          <td className="py-4 px-4">
                             <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${item.status === 'SuperAktiv' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                <span className="text-sm font-bold text-white uppercase tracking-widest">{item.status}</span>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
            </div>
         </div>
      </div>
   );
}
