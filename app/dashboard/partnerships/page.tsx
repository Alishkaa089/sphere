"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, Building2, Briefcase, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getEliteRequests, updateEliteRequestStatus } from "@/lib/actions";

export default function AdminPartnershipsPage() {
   const [requests, setRequests] = useState<any[]>([]);
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     const loadData = async () => {
       const res = await getEliteRequests();
       if (res.success && res.requests) {
         setRequests(res.requests);
       } else {
         setError(res.error || "Müraciətlər yüklənərkən xəta baş verdi.");
       }
       setLoading(false);
     };
     loadData();
   }, []);

   const handleRequest = async (requestId: string, action: "APPROVED" | "REJECTED") => {
      if(!confirm(`Müraciəti ${action === "APPROVED" ? "təsdiqləmək" : "rədd etmək"} istədiyinizə əminsiniz?`)) return;
      const res = await updateEliteRequestStatus(requestId, action);
      if (res.success) {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: action } : r));
      } else {
        alert("Xəta baş verdi.");
      }
    };

   return (
      <div className="p-8 lg:p-12">
         <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
            <div>
               <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                 <Briefcase className="w-8 h-8 text-[#006B8A]" /> Partnership Müraciətləri
               </motion.h1>
               <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 font-medium">
                 Elite Partner olmaq istəyən istifadəçilərin müraciətləri.
               </motion.p>
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
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Şirkət / İstifadəçi</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Əlaqə</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Sahə</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Mesaj</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Status</th>
                        <th className="pb-4 font-black uppercase text-xs tracking-widest px-4">Əməliyyat</th>
                     </tr>
                  </thead>
                  <tbody>
                     {requests.map((item) => {
                        return (
                          <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                             <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-[#006B8A]/20 text-[#00A3CC] flex items-center justify-center font-bold">
                                    <Building2 className="w-5 h-5" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                     <span className="font-bold text-white">{item.company || "N/A"}</span>
                                     <span className="text-xs text-slate-500">{item.user?.name || "Bilinmir"}</span>
                                  </div>
                                </div>
                             </td>
                             <td className="py-4 px-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-medium text-slate-300 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> {item.user?.email || "N/A"}</span>
                                  <span className="text-xs text-slate-500 flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {item.phone || "N/A"}</span>
                                </div>
                             </td>
                             <td className="py-4 px-4">
                               <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-slate-400 bg-black/40">
                                 {item.position || "N/A"}
                               </span>
                             </td>
                             <td className="py-4 px-4 max-w-[200px] truncate text-slate-400 text-sm" title={item.message}>
                                {item.message || "-"}
                             </td>
                             <td className="py-4 px-4">
                                {item.status === "PENDING" ? (
                                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Gözləmədədir</span>
                                ) : item.status === "APPROVED" ? (
                                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Təsdiqləndi</span>
                                ) : item.status === "REJECTED" ? (
                                   <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Rədd edildi</span>
                                ) : (
                                   <span className="text-[10px] font-bold text-slate-600">{item.status}</span>
                                )}
                             </td>
                             <td className="py-4 px-4">
                                {item.status === "PENDING" ? (
                                  <div className="flex gap-2">
                                     <button 
                                       onClick={() => handleRequest(item.id, "APPROVED")}
                                       className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] font-bold uppercase rounded-lg transition-colors flex items-center gap-1"
                                     >
                                        <CheckCircle className="w-3 h-3" /> Təsdiqlə
                                     </button>
                                     <button 
                                       onClick={() => handleRequest(item.id, "REJECTED")}
                                       className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[9px] font-bold uppercase rounded-lg transition-colors flex items-center gap-1"
                                     >
                                        <XCircle className="w-3 h-3" /> Rədd et
                                     </button>
                                  </div>
                                ) : (
                                   <span className="text-xs text-slate-600 italic">Əməliyyat olunub</span>
                                )}
                             </td>
                          </tr>
                        );
                     })}
                  </tbody>
              </table>
              {requests.length === 0 && !loading && !error && (
                 <div className="text-center py-20 text-slate-500 font-bold">Müraciət tapılmadı.</div>
              )}
              {loading && (
                 <div className="flex justify-center p-20 content-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00A3CC]"></div></div>
              )}
            </div>
         </div>
      </div>
   );
}
