"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Mail, Phone, Calendar, Search, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

import { getAllUsers, updateUserRole, updateSellerRequest } from "../../../lib/actions";

export default function AdminUsersPage() {
   const { t } = useLanguage();
   const [users, setUsers] = useState<any[]>([]);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(true);
   const [currentUserEmail, setCurrentUserEmail] = useState("");

   useEffect(() => {
     const email = localStorage.getItem("userEmail") || "";
     setCurrentUserEmail(email);

     const loadData = async () => {
       const res = await getAllUsers();
       if (res.success && res.users) {
         setUsers(res.users);
       } else {
         setError(res.error || "İstifadəçilər yüklənərkən xəta baş verdi.");
       }
       setLoading(false);
     };
     loadData();
   }, []);

   const handleRoleChange = async (userId: string, newRole: string) => {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
         setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
         alert(t.admin_users_role_error);
      }
   };

   const handleRequest = async (userId: string, action: "APPROVED" | "REJECTED") => {
      const res = await updateSellerRequest(userId, action);
      if (res.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, sellerRequestStatus: action, role: action === 'APPROVED' ? 'seller' : u.role } : u));
      } else {
        alert("Xəta baş verdi.");
      }
    };

   return (
      <div className="p-8 lg:p-12">
         <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
               <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                 <Users className="w-8 h-8 text-[#006B8A]" /> {t.admin_users_title}
               </motion.h1>
               <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 font-medium">{t.admin_users_subtitle}</motion.p>
            </div>
            
            <div className="relative">
               <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                 type="text" 
                 placeholder={t.admin_users_search_ph} 
                 className="pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-full focus:outline-none focus:border-red-500 text-white min-w-[300px]"
               />
            </div>
         </header>

         {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-bold flex items-center gap-3">
              <AlertCircle className="w-5 h-5" /> {error}
            </div>
         )}

         <div className="bg-black/30 border border-white/5 rounded-3xl p-6 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                  <thead>
                     <tr className="border-b border-white/10 text-slate-500">
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_users_th_name}</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_users_th_email}</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Plan</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Bitmə Tarixi</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Müraciət</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_users_th_role}</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">{t.admin_users_th_status}</th>
                     </tr>
                  </thead>
                  <tbody>
                     {users.map((item, idx) => {
                        const daysLeft = item.planExpiresAt 
                          ? Math.ceil((new Date(item.planExpiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                          : null;

                        return (
                          <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                             <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-[#006B8A]/20 text-[#00A3CC] flex items-center justify-center font-bold">
                                    {item.name ? item.name.charAt(0) : item.email?.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="font-bold text-white">{item.name || "İstifadəçi"}</span>
                                </div>
                             </td>
                             <td className="py-4 px-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-medium text-slate-300 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {item.email}</span>
                                  <span className="text-xs text-slate-500 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {item.phone || "N/A"}</span>
                                </div>
                             </td>
                             <td className="py-4 px-4">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                 item.plan === "PRO" ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]" : 
                                 item.plan === "ELITE" ? "bg-white/10 text-white border-white/20" : 
                                 "bg-slate-800 text-slate-500 border-white/5"
                               }`}>
                                 {item.plan || "BASIC"}
                               </span>
                             </td>
                             <td className="py-4 px-4">
                                {item.plan === "PRO" && daysLeft !== null ? (
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs font-bold text-white flex items-center gap-2">
                                       <Calendar className="w-3 h-3 text-amber-500" />
                                       {new Date(item.planExpiresAt).toLocaleDateString()}
                                    </span>
                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${daysLeft <= 5 ? "text-red-500" : "text-emerald-500"}`}>
                                       {daysLeft} gün qalıb
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-600 font-bold italic">Limit yoxdur</span>
                                )}
                             </td>
                             <td className="py-4 px-4">
                                {item.sellerRequestStatus === "PENDING" ? (
                                  <div className="flex gap-2">
                                     <button 
                                       onClick={() => handleRequest(item.id, "APPROVED")}
                                       className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold uppercase rounded-lg transition-colors"
                                     >
                                        Təsdiqlə
                                     </button>
                                     <button 
                                       onClick={() => handleRequest(item.id, "REJECTED")}
                                       className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[9px] font-bold uppercase rounded-lg transition-colors"
                                     >
                                        Rədd et
                                     </button>
                                  </div>
                                ) : item.sellerRequestStatus === "APPROVED" ? (
                                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Təsdiqləndi</span>
                                ) : item.sellerRequestStatus === "REJECTED" ? (
                                   <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Rədd edildi</span>
                                ) : (
                                   <span className="text-[10px] font-bold text-slate-600">Yoxdur</span>
                                )}
                             </td>
                             <td className="py-4 px-4">
                                <select 
                                  value={item.role?.toLowerCase() || "user"} 
                                  disabled={item.email === currentUserEmail}
                                  onChange={(e) => handleRoleChange(item.id, e.target.value)}
                                  className={`bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-widest outline-none focus:border-[#00A3CC] transition-all cursor-pointer ${
                                    item.email === currentUserEmail ? 'opacity-50 cursor-not-allowed border-slate-700' : ''
                                  } ${
                                    item.role?.toLowerCase() === 'admin' ? 'text-red-500 border-red-500/30' : 
                                    item.role?.toLowerCase() === 'seller' ? 'text-amber-500 border-amber-500/30' : 
                                    'text-slate-400 border-white/10'
                                  }`}
                                  title={item.email === currentUserEmail ? "Öz rolunuzu dəyişə bilməzsiniz" : ""}
                                >
                                  <option value="user" className="bg-[#0a0a09]">{t.admin_users_option_user}</option>
                                  <option value="seller" className="bg-[#0a0a09]">{t.admin_users_option_seller}</option>
                                  <option value="admin" className="bg-[#0a0a09]">{t.admin_users_option_admin}</option>
                                </select>
                             </td>
                             <td className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${item.status === 'SuperAktiv' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                    <span className="text-sm font-bold text-white uppercase tracking-widest">{item.status || "Active"}</span>
                                </div>
                             </td>
                          </tr>
                        );
                     })}
                  </tbody>
              </table>
              {users.length === 0 && !loading && !error && (
                 <div className="text-center py-20 text-slate-500 font-bold">{t.admin_users_no_found}</div>
              )}
              {loading && (
                 <div className="flex justify-center p-20 content-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00A3CC]"></div></div>
              )}
            </div>
         </div>
      </div>
   );
}
