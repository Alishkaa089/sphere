 "use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Car, ArrowLeft, Upload, CheckCircle, AlertCircle, Zap, Shield, Gauge, Camera, Link2 } from "lucide-react";
import Link from "next/link";
import { createVehicle } from "@/lib/actions";
import { UNIQUE_COUNTRIES } from "@/constants/countries";
import { useLanguage } from "@/context/LanguageContext";

export default function AddVehiclePage() {
   const { t } = useLanguage();
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState(false);
   const [imgMode, setImgMode] = useState<"url" | "file">("url");
   const fileInputRef = useRef<HTMLInputElement>(null);
   
   const CATEGORIES = [t.cat_sports, t.cat_suv, t.cat_electric, t.cat_exclusive, t.cat_all, "Economy"];

   const [formData, setFormData] = useState({
      title: "",
      category: CATEGORIES[0],
      status: t.word_sale,
      city: "",
      country: t.word_azerbaijan,
      price: "",
      battery: "",
      range: "",
      power: "",
      img: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"
   });

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      
      if (!formData.title || !formData.city || !formData.price || !formData.img) {
         setError(t.admin_add_fill_error);
         return;
      }

      setLoading(true);
      const userEmail = localStorage.getItem("userEmail");
      
      if (!userEmail) {
         setError(t.admin_add_auth_error);
         setLoading(false);
         return;
      }

      try {
         const res = await createVehicle(formData, userEmail);
         if (res.success) {
            setSuccess(true);
            setTimeout(() => router.push("/dashboard/transports"), 2000);
         } else {
            setError(res.error || t.toast_error);
         }
      } catch (err) {
         setError(t.admin_add_server_error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="p-8 lg:p-12 max-w-4xl mx-auto">
         <header className="mb-12">
            <Link href="/dashboard/transports" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group">
               <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               <span className="font-bold">{t.admin_add_back}</span>
            </Link>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
              <Car className="w-10 h-10 text-rose-500" /> {t.admin_add_trans_title}
            </motion.h1>
         </header>

         {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-20 text-center shadow-2xl">
               <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
               </div>
               <h2 className="text-3xl font-black text-white mb-2">{t.admin_add_success_title}</h2>
               <p className="text-slate-400 font-medium">{t.admin_add_success_desc}</p>
            </motion.div>
         ) : (
            <motion.form 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              onSubmit={handleSubmit} 
              className="bg-black/30 border border-white/5 rounded-3xl p-8 shadow-2xl space-y-8"
            >
               {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 font-bold">
                     <AlertCircle className="w-5 h-5" /> {error}
                  </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                     <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">{t.admin_add_label_brand}</label>
                     <input 
                       type="text" 
                       value={formData.title}
                       onChange={(e) => setFormData({...formData, title: e.target.value})}
                       placeholder={t.admin_add_ph_brand}
                       className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-all font-bold"
                     />
                  </div>
                  <div>
                     <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">{t.admin_add_label_cat}</label>
                     <select 
                       value={formData.category}
                       onChange={(e) => setFormData({...formData, category: e.target.value})}
                       className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-rose-500 transition-all font-bold appearance-none cursor-pointer"
                     >
                        {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0a0a09]">{c}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">{t.admin_add_label_status}</label>
                     <div className="flex gap-4 p-1 bg-black/40 border border-white/10 rounded-2xl">
                        {[t.word_sale, t.word_rent].map(s => (
                           <button 
                             key={s}
                             type="button"
                             onClick={() => setFormData({...formData, status: s})}
                             className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.status === s ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}
                           >
                              {s}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">{t.admin_add_label_price}</label>
                     <input 
                       type="number" 
                       value={formData.price}
                       onChange={(e) => setFormData({...formData, price: e.target.value})}
                       placeholder={t.admin_add_ph_price}
                       className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-rose-500 transition-all font-bold"
                     />
                  </div>

                  <div>
                     <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">{t.admin_add_label_country}</label>
                     <select 
                       value={formData.country}
                       onChange={(e) => setFormData({...formData, country: e.target.value})}
                       className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-rose-500 transition-all font-bold appearance-none cursor-pointer"
                     >
                        {UNIQUE_COUNTRIES.map(c => <option key={c} value={c} className="bg-[#0a0a09]">{c}</option>)}
                     </select>
                  </div>

                  <div>
                     <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">{t.admin_add_label_city}</label>
                     <input 
                       type="text" 
                       value={formData.city}
                       onChange={(e) => setFormData({...formData, city: e.target.value})}
                       placeholder={t.admin_add_ph_city}
                       className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-rose-500 transition-all font-bold"
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                     <div className="relative">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <Zap className="w-3 h-3" /> {t.trans_battery} (kWh)
                        </label>
                        <input 
                          type="number" 
                          value={formData.battery}
                          onChange={(e) => setFormData({...formData, battery: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 font-bold"
                        />
                     </div>
                     <div className="relative">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <Shield className="w-3 h-3" /> {t.trans_range} (km)
                        </label>
                        <input 
                          type="number" 
                          value={formData.range}
                          onChange={(e) => setFormData({...formData, range: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 font-bold"
                        />
                     </div>
                     <div className="relative">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <Gauge className="w-3 h-3" /> {t.trans_power} (HP)
                        </label>
                        <input 
                          type="text" 
                          value={formData.power}
                          onChange={(e) => setFormData({...formData, power: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 font-bold"
                        />
                     </div>
                  </div>

                  <div className="md:col-span-2">
                     <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 text-center">{t.admin_add_label_img}</label>
                     <div className="flex gap-2 mb-4 p-1 bg-black/40 border border-white/10 rounded-2xl">
                        <button type="button" onClick={() => setImgMode("url")} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${imgMode === 'url' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                           <Link2 className="w-3.5 h-3.5" /> URL
                        </button>
                        <button type="button" onClick={() => setImgMode("file")} className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${imgMode === 'file' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'}`}>
                           <Camera className="w-3.5 h-3.5" /> Cihazdan
                        </button>
                     </div>
                     {imgMode === "url" ? (
                        <div className="relative">
                           <Upload className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                           <input
                             type="text"
                             value={formData.img.startsWith("data:") ? "" : formData.img}
                             onChange={(e) => setFormData({...formData, img: e.target.value})}
                             placeholder={t.admin_add_ph_img}
                             className="w-full bg-black/40 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-white focus:outline-none focus:border-rose-500 transition-all font-bold text-sm"
                           />
                        </div>
                     ) : (
                        <div className="flex items-center gap-5">
                           <div
                             onClick={() => fileInputRef.current?.click()}
                             className="w-28 h-28 flex-shrink-0 rounded-3xl bg-black/40 border-2 border-dashed border-white/10 hover:border-rose-500/50 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer transition-all active:scale-95"
                           >
                             {formData.img.startsWith("data:") ? (
                               <img src={formData.img} alt="Preview" className="w-full h-full object-cover" />
                             ) : (
                               <Camera className="w-7 h-7 text-slate-600 group-hover:text-rose-500 transition-colors" />
                             )}
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <span className="text-[10px] uppercase font-black text-white tracking-widest">Dəyiş</span>
                             </div>
                           </div>
                           <div className="flex-1">
                             <p className="text-sm font-black text-slate-300">Qalereyadan seçin</p>
                             <p className="text-xs text-slate-500 mt-1 font-medium">Format: JPG, PNG. Yalnız yüksək keyfiyyətli şəkillər.</p>
                             {formData.img.startsWith("data:") && (
                               <button type="button" onClick={() => setFormData({...formData, img: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"})} className="mt-2 text-[10px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest">Sil</button>
                             )}
                           </div>
                           <input
                             type="file"
                             accept="image/*"
                             ref={fileInputRef}
                             onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (file) {
                                 const reader = new FileReader();
                                 reader.onloadend = () => setFormData({...formData, img: reader.result as string});
                                 reader.readAsDataURL(file);
                               }
                             }}
                             className="hidden"
                           />
                        </div>
                     )}
                     <p className="mt-2 text-xs text-slate-600 italic">{t.admin_add_img_note}</p>
                  </div>
               </div>

               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full py-5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-black text-xl rounded-2xl shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-3"
               >
                  {loading ? (
                     <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                   ) : (
                     t.admin_add_btn_submit_trans
                  )}
               </button>
            </motion.form>
         )}
      </div>
   );
}
