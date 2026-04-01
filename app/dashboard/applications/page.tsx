"use client";

import { useEffect, useState } from "react";
import { getJobApplications, updateJobApplicationStatus } from "@/lib/actions";
import { Briefcase, CheckCircle2, Clock, MapPin, XCircle, FileText, Loader2 } from "lucide-react";

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    const res = await getJobApplications();
    if (res.success && res.applications) {
      setApplications(res.applications);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (id: string, action: "ACCEPTED" | "REJECTED") => {
    setActionLoading(id);
    const res = await updateJobApplicationStatus(id, action);
    setActionLoading(null);
    if (res.success) {
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: action } : app));
    } else {
      alert("Xəta baş verdi");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-screen">
         <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto flex-1 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-black text-white">Karyera Müraciətləri</h1>
        <p className="text-slate-400 font-medium">Bütün iş müraciətlərini idarə edin</p>
      </div>

      <div className="grid grid-cols-1 gap-6 pb-20">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div key={app.id} className="bg-black/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center relative z-10">
                
                <div className="flex-1 flex flex-col gap-4">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                         <Briefcase className="w-6 h-6 text-purple-500" />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-white">{app.roleTitle}</h3>
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1">
                            <span>{new Date(app.createdAt).toLocaleString()}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded uppercase tracking-widest ${
                              app.status === "PENDING" ? "bg-amber-500/20 text-amber-500" :
                              app.status === "ACCEPTED" ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-400"
                            }`}>
                              {app.status}
                            </span>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                       <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                           <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Ad və Soyad</div>
                           <div className="font-bold text-white text-sm">{app.fullName}</div>
                       </div>
                       <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                           <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Email / Telefon</div>
                           <div className="font-bold text-white text-sm truncate">{app.email}</div>
                           <div className="font-bold text-slate-400 text-xs">{app.phone}</div>
                       </div>
                   </div>

                   {(app.portfolio || app.message) && (
                     <div className="mt-2 bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                        {app.portfolio && (
                           <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="flex flex-col items-start gap-1">
                              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">CV / Portfolio</span>
                              <span className="text-sm font-bold text-[#00A3CC] hover:underline flex items-center gap-2 truncate max-w-full"><FileText className="w-4 h-4"/> {app.portfolio}</span>
                           </a>
                        )}
                        {app.message && (
                           <div className="flex flex-col gap-1">
                              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Əlavə Qeyd</span>
                              <p className="text-sm font-medium text-slate-300 leading-relaxed">{app.message}</p>
                           </div>
                        )}
                     </div>
                   )}
                </div>

                <div className="flex gap-2 w-full xl:w-auto mt-4 xl:mt-0 xl:min-w-[200px]">
                   {app.status === "PENDING" ? (
                     <>
                        <button 
                          onClick={() => handleAction(app.id, "ACCEPTED")}
                          disabled={actionLoading === app.id}
                          className="flex-1 px-4 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-5 h-5"/> Təsdiqlə
                        </button>
                        <button 
                          onClick={() => handleAction(app.id, "REJECTED")}
                          disabled={actionLoading === app.id}
                          className="flex-1 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-5 h-5"/> Rədd et
                        </button>
                     </>
                   ) : (
                      <div className={`w-full flex items-center justify-center px-4 py-4 rounded-xl font-bold tracking-widest uppercase text-xs border ${
                         app.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                      }`}>
                         {app.status === "ACCEPTED" ? "Təsdiqləndi" : "Rədd edildi"}
                      </div>
                   )}
                </div>

              </div>
            </div>
          ))
        ) : (
           <div className="col-span-1 py-20 text-center text-slate-500 font-bold bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center gap-4">
              <Briefcase className="w-12 h-12 opacity-50" />
              Hazırda müraciət yoxdur.
           </div>
        )}
      </div>
    </div>
  );
}
