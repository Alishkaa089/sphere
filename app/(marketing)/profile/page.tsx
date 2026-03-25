"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/common/Footer";
import { Camera, Lock, Mail, ShieldCheck, Clock, CalendarRange, Car, LogOut, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [avatarUrl, setAvatarUrl] = useState("https://ui-avatars.com/api/?name=Istifadeci&background=0D8ABC&color=fff");
  const [userEmail, setUserEmail] = useState("istifadeci@sphere.com");
  const [isSeller, setIsSeller] = useState(false);

  // Passwords
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If not logged in, immediately redirect to register
    if (localStorage.getItem("userLoggedIn") !== "true") {
      window.location.href = "/register";
      return;
    }

    // Load Orders
    const storedOrders = localStorage.getItem("myOrders");
    if (storedOrders) {
      setUserOrders(JSON.parse(storedOrders).reverse());
    }

    // Load Profile
    const storedAvatar = localStorage.getItem("userAvatar");
    if (storedAvatar) setAvatarUrl(storedAvatar);
    
    // Simulate generic email or load
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setUserEmail(storedEmail);

    const storedRole = localStorage.getItem("userRole");
    setIsSeller(storedRole === "seller");
  }, []);

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
      setPassError("Bütün xanaları doldurun.");
      return;
    }

    // Auth Mock Logic natively stored 
    const currentPass = localStorage.getItem("userPassword") || "password123";
    
    if (oldPass !== currentPass) {
      setPassError("Köhnə parol yanlışdır!");
      return;
    }

    if (newPass === oldPass) {
      setPassError("Yeni parol əvvəlki parolla tamamilə eynidir. Fərqli parol seçin!");
      return;
    }

    // Success fully updating natively
    localStorage.setItem("userPassword", newPass);
    setPassSuccess("Parolunuz uğurla güncəlləndi!");
    setOldPass("");
    setNewPass("");
  };

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 right-0 h-[60vh] z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-32 mb-24 relative z-10">
        
        <div className="mb-12">
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Sizin Profiliniz
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-slate-400">
            Fərdi məlumatlarınızı, rezervasiya və hesablarınızı idarə edin.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Profile Details & Password */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* User Card */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center">
              
              <div className="relative mb-6 group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-800 shadow-xl relative">
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg border-2 border-zinc-900 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              </div>

              <h2 className="text-2xl font-black text-white mb-1">Hesabınız</h2>
              <div className="flex items-center gap-2 text-slate-400 font-medium bg-black/40 px-4 py-2 rounded-full border border-white/5 w-full justify-center mb-6">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="truncate">{userEmail}</span>
              </div>

              {/* BECOME SELLER TOGGLE */}
              <div className="w-full bg-black/30 border border-white/5 rounded-2xl p-4 mb-6 relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-r transition-opacity duration-500 ${isSeller ? 'from-amber-600/20 to-orange-600/20 opacity-100' : 'from-indigo-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100'}`} />
                <div className="relative z-10 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-white">{isSeller ? "Satıcı Hesabı Aktivdir" : "Satıcı Ol"}</span>
                      <span className="text-xs text-slate-400 mt-1 max-w-[180px]">Öz mülk və avtomobillərinizi satışa və ya icarəyə çıxarın.</span>
                   </div>
                   <button 
                      onClick={() => {
                        const newStatus = !isSeller;
                        setIsSeller(newStatus);
                        localStorage.setItem("userRole", newStatus ? "seller" : "user");
                        window.dispatchEvent(new Event("roleChanged"));
                      }}
                      className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 relative ${isSeller ? 'bg-amber-500' : 'bg-slate-700'}`}
                   >
                     <motion.div 
                        animate={{ x: isSeller ? 24 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-md"
                     />
                   </button>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full py-3 rounded-xl font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sistemdən Çıxış Et
              </button>

            </motion.div>

            {/* Password Management */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <Lock className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xl font-black text-white">Təhlükəsizlik</h3>
              </div>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mövcud Parol</label>
                  <div className="relative">
                    <input 
                      type={showOldPass ? "text" : "password"} 
                      value={oldPass}
                      onChange={(e) => setOldPass(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors focus:outline-none"
                    >
                      {showOldPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 italic">Defolt sınaq parolu: password123</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Yeni Parol</label>
                  <div className="relative">
                    <input 
                      type={showNewPass ? "text" : "password"} 
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-700" 
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
                  Şifrəni Yenilə
                </button>
              </form>
            </motion.div>

          </div>

          {/* RIGHT: Order History Grid */}
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl min-h-[600px] flex flex-col">
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-black text-white">Son Əməliyyatlar</h3>
                </div>
                <div className="text-sm font-bold bg-black/40 text-slate-400 px-4 py-1.5 rounded-full border border-white/5">
                  Ödənilmiş: {userOrders.length} məhsul
                </div>
              </div>

              {userOrders.length > 0 ? (
                <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {userOrders.map((order) => (
                    <div key={order.id} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:bg-black/60 transition-colors">
                      
                      {/* Thumbnail */}
                      <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/10 hidden sm:block">
                        <img src={order.img} alt={order.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${order.type === "Satınalma" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>
                              {order.type}
                            </span>
                            <h4 className="text-lg font-black text-white mt-1 leading-tight">{order.title}</h4>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-white">${order.price.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                          {order.type === "İcarə" && (
                            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                              <CalendarRange className="w-3.5 h-3.5 text-slate-500" />
                              {order.start} — {order.end} ({order.totalDays} gün)
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                            Status: Təsdiqlənib
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
                  <h4 className="text-xl font-black text-white mb-2">Hələlik heç nə yoxdur</h4>
                  <p className="text-slate-400 max-w-sm">
                    Siz hələ ki, heç bir eksklüziv maşın rezerv etməmisiniz və ya daşınmaz əmlak almamısınız.
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
