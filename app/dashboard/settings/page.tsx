"use client";

import { motion } from "framer-motion";
import { Settings, Save, Server, ShieldCheck, CreditCard, Bell } from "lucide-react";

export default function AdminSettingsPage() {
   return (
      <div className="p-8 lg:p-12 mb-20">
         <header className="mb-12">
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
              <Settings className="w-8 h-8 text-slate-400" /> Tənzimləmələr
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400 font-medium">Bütün qlobal platforma tənzimləmələri və arxitektura quruluşu.</motion.p>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-8">
               
               <div className="bg-black/30 border border-white/5 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-3 text-lg font-black text-white mb-6 border-b border-white/5 pb-4"><Server className="w-5 h-5 text-indigo-500"/> Mərkəzi Konfiqurasiya</div>
                  
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <h4 className="text-white font-bold mb-1">Maintancence Mode</h4>
                           <p className="text-sm text-slate-500">Sayt müvəqqəti olaraq təmir rejiminə keçəcək və yalnız adminlər daxil ola biləcək.</p>
                        </div>
                        <div className="w-14 h-8 bg-slate-700 rounded-full p-1 relative cursor-pointer hover:bg-slate-600 transition-colors">
                           <div className="w-6 h-6 bg-white rounded-full shadow-md relative" />
                        </div>
                     </div>
                     <div className="w-full h-[1px] bg-white/5" />
                     <div className="flex items-center justify-between">
                        <div>
                           <h4 className="text-white font-bold mb-1">Qlobal Qeydiyyat Sistemi</h4>
                           <p className="text-sm text-slate-500">Yeni istifadəçi və satıcıların saytdan qeydiyyatdan keçməsinə icazə verir.</p>
                        </div>
                        <div className="w-14 h-8 bg-red-500 rounded-full p-1 relative cursor-pointer">
                           <div className="w-6 h-6 bg-white rounded-full shadow-md relative left-6" />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-black/30 border border-white/5 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-3 text-lg font-black text-white mb-6 border-b border-white/5 pb-4"><CreditCard className="w-5 h-5 text-amber-500"/> Ödəniş Sistemi (Stripe API)</div>
                  
                  <div className="space-y-6">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Stripe Public Key</label>
                        <input type="text" value="pk_test_51NxXXXXXXXXXXXXXXXXXXXXXXXXXX" readOnly className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500 text-white font-medium" />
                     </div>
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Stripe Secret Key</label>
                        <input type="password" value="sk_test_51NxXXXXXXXXXXXXXXXXXXXXXXXXXX" readOnly className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-red-500 text-white font-medium" />
                     </div>
                     <p className="text-xs font-bold text-rose-500 bg-rose-500/10 p-4 rounded-xl">DIQQƏT: Bu API açarları live mühitində dəyişdirilməməlidir!</p>
                  </div>
               </div>
               
               <button className="bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-red-600/20 w-full flex justify-center items-center gap-3">
                  <Save className="w-5 h-5" /> Tənzimləmələri Yadda Saxla
               </button>

            </div>

            <div className="lg:col-span-4 flex flex-col gap-8">
               <div className="bg-blue-600/10 border border-blue-500/20 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
                  <div>
                     <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30">
                        <ShieldCheck className="w-6 h-6" />
                     </div>
                     <h3 className="text-xl font-black text-white mb-2">Təhlükəsizlik Statusu</h3>
                     <p className="text-blue-200/60 font-medium mb-6">Heç bir kənar giriş bloku aşkar olunmayıb. Baza tam zəmanətlə işləyir.</p>
                  </div>
               </div>

               <div className="bg-black/30 border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest border-b border-white/5 flex items-center gap-2 pb-3 mb-2"><Bell className="w-4 h-4 text-emerald-500" /> Sistem Jurnalı (Loglar)</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400"><span className="text-emerald-500 font-black">GET</span> /api/properties - 200 OK</div>
                  <div className="flex items-center gap-3 text-xs text-slate-400"><span className="text-blue-500 font-black">POST</span> /api/auth/login - 200 OK</div>
                  <div className="flex items-center gap-3 text-xs text-slate-400"><span className="text-amber-500 font-black">WARN</span> Database sync missing API</div>
                  <div className="flex items-center gap-3 text-xs text-slate-400"><span className="text-emerald-500 font-black">GET</span> /api/dashboard - 200 OK</div>
               </div>
            </div>
         </div>
      </div>
   );
}
