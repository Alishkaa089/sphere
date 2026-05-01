"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/common/Footer";
import { Camera, Lock, Mail, ShieldCheck, Clock, CalendarRange, Car, LogOut, CheckCircle2, AlertCircle, Eye, EyeOff, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getAllUsers, requestSellerStatus, getOrdersByUserEmail } from "@/lib/actions";

export default function ProfilePage() {
  const { t } = useLanguage();
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("https://ui-avatars.com/api/?name=User&background=004E64&color=fff");
  const [userEmail, setUserEmail] = useState("user@Valorum.com");
  const [isSeller, setIsSeller] = useState(false);
  const [sellerStatus, setSellerStatus] = useState<string | null>(null);
  const [jobTitle, setJobTitle] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [userPlan, setUserPlan] = useState("BASIC");

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    
    if (localStorage.getItem("userLoggedIn") !== "true") {
      window.location.href = "/login";
      return;
    }

    const storedOrders = localStorage.getItem("myOrders");
    if (storedOrders) {
      setUserOrders(JSON.parse(storedOrders).reverse());
    }

    const storedAvatar = localStorage.getItem("userAvatar");
    if (storedAvatar) setAvatarUrl(storedAvatar);
    
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setUserEmail(storedEmail);

    const role = localStorage.getItem("userRole");
    setIsSeller(role === "seller");

    const plan = localStorage.getItem("userPlan");
    if (plan) setUserPlan(plan);

    const onPlanChange = () => {
      setUserPlan(localStorage.getItem("userPlan") || "BASIC");
    };
    window.addEventListener("planChanged", onPlanChange);

    if (storedEmail) {
      
      getAllUsers().then(res => {
         if (res.success && res.users) {
            const me = res.users.find((u: any) => u.email === storedEmail);
            if (me) {
               setSellerStatus(me.sellerRequestStatus);
               if (me.jobTitle) setJobTitle(me.jobTitle);
               if (me.role === "seller") setIsSeller(true);
               
               if (me.plan) {
                 setUserPlan(me.plan);
                 localStorage.setItem("userPlan", me.plan);
               }
            }
         }
      });

      getOrdersByUserEmail(storedEmail).then(res => {
         if (res.success && res.orders) {
            setUserOrders(res.orders);
         }
      });
    }

    return () => window.removeEventListener("planChanged", onPlanChange);
  }, []);

  const handleSellerRequest = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    setRequestLoading(true);
    const res = await requestSellerStatus(email);
    setRequestLoading(false);
    if (res.success) {
      setSellerStatus("PENDING");
      alert("Müraciətiniz göndərildi. Admin tərəfindən təsdiqlənməsini gözləyin.");
    } else {
      alert(res.error || "Xəta baş verdi.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Str = reader.result as string;
        setAvatarUrl(base64Str);
        localStorage.setItem("userAvatar", base64Str);
        window.dispatchEvent(new Event("avatarChanged"));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (!oldPass || !newPass) {
      setPassError(t.prof_fill_all);
      return;
    }

    const currentPass = localStorage.getItem("userPassword") || "password123";
    
    if (oldPass !== currentPass) {
      setPassError(t.prof_pass_wrong);
      return;
    }

    if (newPass === oldPass) {
      setPassError(t.prof_pass_same);
      return;
    }

    localStorage.setItem("userPassword", newPass);
    setPassSuccess(t.prof_pass_success);
    setOldPass("");
    setNewPass("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPlan");
    localStorage.removeItem("userAvatar");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col relative overflow-hidden">
      
      <div className="absolute top-0 left-0 right-0 h-[60vh] z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#004E64]/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#004E64]/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-32 mb-24 relative z-10">
        
        <div className="mb-12">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            {t.prof_title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400">
            {t.prof_subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-8">
            
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
              
              <div className="relative mb-6 group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800 shadow-xl relative">
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-[#004E64] hover:bg-[#006B8A] rounded-full text-white shadow-lg border-2 border-zinc-900 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>

              <h2 className="text-2xl font-black text-white mb-1">{t.prof_account}</h2>
              <div className="flex items-center gap-2 text-slate-400 font-medium bg-black/40 px-4 py-2 rounded-full border border-white/5 w-full justify-center mb-6">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="truncate">{userEmail}</span>
              </div>

              <div className="w-full mb-6 p-5 bg-gradient-to-br from-zinc-800/40 to-zinc-900/40 border border-white/5 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3">
                    <ShieldCheck className={`w-5 h-5 ${userPlan === "PRO" ? "text-amber-500" : userPlan === "ELITE" ? "text-emerald-500" : "text-slate-600"}`} />
                  </div>
                  <div className="relative z-10">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">{t.current_plan}</span>
                    <div className="flex items-center gap-2">
                       <span className="text-xl font-black text-white">
                         {userPlan === "PRO" ? (t.plan_pro || "Valorum PRO") : 
                          userPlan === "ELITE" ? "Valorum ELITE" : 
                          (t.plan_basic || "Valorum BASIC")}
                       </span>
                       {userPlan === "BASIC" && (
                         <Link href="/partnership" className="text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest underline underline-offset-4 decoration-amber-500/30 transition-all">
                           {t.btn_upgrade_plan || "Planı Yüksəlt"}
                         </Link>
                       )}
                    </div>
                  </div>
              </div>

              <div className="w-full bg-black/30 border border-white/5 rounded-2xl p-5 mb-6 relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-500 ${(isSeller || jobTitle) ? 'from-emerald-600/10 to-emerald-600/5 opacity-100' : 'from-[#004E64]/10 to-[#004E64]/5 opacity-0 group-hover:opacity-100'}`} />
                <div className="relative z-10 flex flex-col gap-4">
                   <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Hesab Statusu</span>
                         <span className="text-sm font-black text-white">
                           {isSeller ? "Rəsmi Tərəfdaş (Satıcı)" : jobTitle ? "Rəsmi Əməkdaş" : "Standart İstifadəçi"}
                         </span>
                      </div>
                      <div className={`p-2 rounded-xl ${(isSeller || jobTitle) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                         {(isSeller || jobTitle) ? <ShieldCheck className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                      </div>
                   </div>

                   {jobTitle && (
                      <div className="pt-2 border-t border-white/5">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Vəzifə</span>
                         <span className="text-sm font-bold text-[#00A3CC]">{jobTitle}</span>
                      </div>
                   )}

                   {!isSeller && !jobTitle && (
                      <div className="pt-2 border-t border-white/5">
                         {sellerStatus === "PENDING" ? (
                            <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                               <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest text-wrap">Müraciətiniz nəzərdən keçirilir...</span>
                            </div>
                         ) : sellerStatus === "REJECTED" ? (
                            <div className="flex flex-col gap-3">
                               <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                  <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Maalesef müraciətiniz rədd edildi.</span>
                               </div>
                               <button 
                                 onClick={handleSellerRequest}
                                 className="w-full py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all"
                               >
                                 Yenidən Müraciət Et
                               </button>
                            </div>
                         ) : (
                            <button 
                              disabled={requestLoading}
                              onClick={handleSellerRequest}
                              className="w-full py-4 bg-[#004E64] hover:bg-[#006B8A] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-black/20 disabled:opacity-50"
                            >
                              {requestLoading ? "Gözləyin..." : "Satıcı Olmaq Üçün Müraciət Et"}
                            </button>
                         )}
                      </div>
                   )}

                   {isSeller && (
                      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-xl justify-center">
                         <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Təsdiqlənmiş Hesab</span>
                      </div>
                   )}
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full py-3 rounded-xl font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> {t.prof_logout_confirm || t.btn_logout}
              </button>

            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <Lock className="w-5 h-5 text-[#00A3CC]" />
                <h3 className="text-xl font-black text-white">{t.prof_security}</h3>
              </div>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.prof_old_pass}</label>
                  <div className="relative">
                    <input 
                      type={showOldPass ? "text" : "password"} 
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-[#006B8A] transition-colors placeholder:text-slate-700" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                    >
                      {showOldPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.prof_new_pass}</label>
                  <div className="relative">
                    <input 
                      type={showNewPass ? "text" : "password"} 
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-[#006B8A] transition-colors placeholder:text-slate-700" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                    >
                      {showNewPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {passError && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 overflow-hidden">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium text-red-200">{passError}</span>
                    </motion.div>
                  )}
                  {passSuccess && (
                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2 overflow-hidden">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium text-emerald-200">{passSuccess}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" className="w-full py-3 mt-2 rounded-xl font-bold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10">
                  {t.prof_update_pass}
                </button>
              </form>
            </motion.div>

          </div>

          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl min-h-[600px] flex flex-col">
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#00A3CC]" />
                  <h3 className="text-xl font-black text-white">{t.prof_recent_ops}</h3>
                </div>
                <div className="text-sm font-bold bg-black/40 text-slate-400 px-4 py-1.5 rounded-full border border-white/5">
                  {t.prof_paid_items} {userOrders.length} {t.word_product}
                </div>
              </div>

              {userOrders.length > 0 ? (
                <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {userOrders.map((order) => (
                    <div key={order.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:bg-black/60 transition-colors">
                      
                      <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/10 hidden sm:block">
                        <img src={order.img} alt={order.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${order.type === "Satınalma" || order.type === "Purchase" ? "bg-emerald-500/20 text-emerald-400" : "bg-[#006B8A]/20 text-[#00A3CC]"}`}>
                              {order.type === "Satınalma" || order.type === "Purchase" ? t.prof_order_type_sale : t.prof_order_type_rent}
                            </span>
                            <h4 className="text-lg font-black text-white mt-1 leading-tight">{order.title}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-white">${(order.totalPrice || 0).toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                          {(order.type === "İcarə" || order.type === "Rental") && (
                            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                              <CalendarRange className="w-3.5 h-3.5 text-slate-500" />
                              {order.startDate ? new Date(order.startDate).toLocaleDateString() : (order.start || "-")} — {order.endDate ? new Date(order.endDate).toLocaleDateString() : (order.end || "-")}
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            {t.prof_status_ok}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 opacity-60">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Car className="w-10 h-10 text-slate-500" />
                  </div>
                  <h4 className="text-xl font-black text-white mb-2">{t.prof_empty_title}</h4>
                  <p className="text-slate-400 max-w-sm">
                    {t.prof_empty_desc}
                  </p>
                </div>
              )}
              
            </motion.div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
