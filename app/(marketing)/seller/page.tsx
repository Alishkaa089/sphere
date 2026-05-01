"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Building2, Car, MapPin, CheckCircle2, DollarSign, Camera, AlertCircle, ShieldCheck, X } from "lucide-react";
import Footer from "@/components/common/Footer";
import { UNIQUE_COUNTRIES, COUNTRY_CITIES } from "@/constants/countries";
import { useLanguage } from "@/context/LanguageContext";
import { createProperty, createVehicle, getUserProperties, getUserVehicles, upgradeUserPlan } from "@/lib/actions";

function UpgradeModal({ isOpen, onClose, onUpgrade, t }: any) {
  const [step, setStep] = useState<"plans" | "payment" | "contact" | "success">("plans");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [planType, setPlanType] = useState<"PRO" | "ELITE">("PRO");

  const [cardData, setCardData] = useState({ number: "", expiry: "", cvc: "" });

  const handleProStart = () => {
    setPlanType("PRO");
    setStep("payment");
  };

  const handleEliteContact = () => {
    setPlanType("ELITE");
    setStep("contact");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    const res = await upgradeUserPlan(email, "PRO");
    setLoading(false);
    
    if (res.success) {
      localStorage.setItem("userPlan", "PRO");
      localStorage.setItem("userRole", "seller");
      window.dispatchEvent(new Event("planChanged"));
      window.dispatchEvent(new Event("roleChanged"));
      onUpgrade();
      setStep("success");
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await (upgradeUserPlan as any).submitEliteContact?.(formData) || { success: true }; 
    setLoading(false);
    if (res.success) {
      setStep("success");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl bg-[#0a0a09] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 transition-colors z-50">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
           
           <div className="hidden md:flex md:w-1/3 bg-gradient-to-br from-[#004E64] to-[#001D25] p-12 flex-col justify-end relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-white leading-tight mb-4">Mükəmməlliyə addım atın.</h3>
                <p className="text-white/60 font-medium">Valorum ilə biznesinizi qlobal səviyyəyə daşıyın.</p>
              </div>
           </div>

           <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[90vh]">
              
              <AnimatePresence mode="wait">
                {step === "plans" && (
                  <motion.div key="plans" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-8">
                     <div className="mb-8">
                        <h2 className="text-3xl font-black text-white mb-2">Plan Seçin</h2>
                        <p className="text-slate-400">Biznesiniz üçün ən uyğun tərəfdaşlıq modelini seçin.</p>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-amber-500/20 rounded-3xl p-6 hover:border-amber-500/50 transition-all group flex flex-col">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                <h4 className="text-xl font-black text-white">Pro Tərəfdaş</h4>
                                <div className="mt-1 flex items-baseline gap-1">
                                   <span className="text-2xl font-black text-amber-500">$199</span>
                                   <span className="text-xs text-slate-500 font-bold">/ ay</span>
                                </div>
                              </div>
                              <div className="p-2 bg-amber-500/10 rounded-xl">
                                 <ShieldCheck className="w-6 h-6 text-amber-500" />
                              </div>
                           </div>
                           <ul className="space-y-3 mb-8 flex-1">
                              {[
                                "50-yə qədər aktiv elan",
                                "Ətraflı analitik & hesabatlar",
                                "Prioritet dəstək (24h)",
                                "Premium Valorum Nişanı",
                                "Öne çıxan elan hüququ",
                                "Dedicated account manager"
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> {item}
                                </li>
                              ))}
                           </ul>
                           <button onClick={handleProStart} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl transition-all">Başla</button>
                        </div>

                        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all flex flex-col">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                <h4 className="text-xl font-black text-white">Elite Tərəfdaş</h4>
                                <div className="mt-1">
                                   <span className="text-2xl font-black text-white">Fərdi qiymət</span>
                                </div>
                              </div>
                              <div className="p-2 bg-white/5 rounded-xl">
                                 <Building2 className="w-6 h-6 text-white" />
                              </div>
                           </div>
                           <ul className="space-y-3 mb-8 flex-1">
                              {[
                                "Limitsiz elan",
                                "API inteqrasiyası",
                                "Xüsusi brend səhifəsi",
                                "Co-marketing imkanları",
                                "Dedicated team",
                                "SLA zəmanəti"
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" /> {item}
                                </li>
                              ))}
                           </ul>
                           <button onClick={handleEliteContact} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest rounded-xl transition-all">Bizimlə Əlaqə</button>
                        </div>
                     </div>
                  </motion.div>
                )}

                {step === "payment" && (
                   <motion.div key="payment" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                      <button onClick={() => setStep("plans")} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest mb-6">
                        <X className="w-4 h-4 rotate-45" /> Geri Qayıt
                      </button>
                      <h2 className="text-3xl font-black text-white mb-2">Ödəniş</h2>
                      <p className="text-slate-400 mb-8">Abunəliyi tamamlamaq üçün kart məlumatlarınızı daxil edin.</p>
                      
                      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 max-w-md">
                         <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            <div>
                               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Kart Nömrəsi</label>
                               <input 
                                required 
                                type="text"
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white font-bold"
                               />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Son Tarix</label>
                                <input required type="text" placeholder="MM/YY" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white font-bold" />
                              </div>
                              <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">CVV</label>
                                <input required type="text" placeholder="123" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white font-bold" />
                              </div>
                            </div>
                            <button disabled={loading} type="submit" className="w-full py-4 mt-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-500/20">
                               {loading ? "Gözləyin..." : "Ödənişi Tamamla ($199)"}
                            </button>
                         </form>
                      </div>
                   </motion.div>
                )}

                {step === "contact" && (
                   <motion.div key="contact" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                      <button onClick={() => setStep("plans")} className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest mb-6">
                        <X className="w-4 h-4 rotate-45" /> Geri Qayıt
                      </button>
                      <h2 className="text-3xl font-black text-white mb-2">Elite Tərəfdaşlıq</h2>
                      <p className="text-slate-400 mb-8">Məlumatlarınızı daxil edin, elit komandamız sizinlə əlaqə saxlayacaq.</p>
                      
                      <form onSubmit={handleContactSubmit} className="space-y-4 max-w-md">
                         <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Ad və Soyad</label>
                            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white font-bold" />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Əlaqə Nömrəsi</label>
                            <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white font-bold" />
                         </div>
                         <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Əlavə Qeyd</label>
                            <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-3.5 text-white font-bold resize-none" />
                         </div>
                         <button disabled={loading} type="submit" className="w-full py-4 mt-2 bg-white hover:bg-slate-100 text-black font-black uppercase tracking-widest rounded-xl transition-all">
                            {loading ? "Göndərilir..." : "Müraciəti Göndər"}
                         </button>
                      </form>
                   </motion.div>
                )}

                {step === "success" && (
                   <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center text-center py-20">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8">
                         <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h2 className="text-3xl font-black text-white mb-4">
                        {planType === "PRO" ? t.upgrade_success : "Müraciətiniz qəbul edildi!"}
                      </h2>
                      <p className="text-slate-400 mb-10 max-w-sm">
                        {planType === "PRO" 
                          ? "Artıq bütün Pro imkanlarından istifadə edə bilərsiniz." 
                          : "Tezliklə sizinlə əlaqə saxlayacağıq. Bizi seçdiyiniz üçün təşəkkür edirik!"}
                      </p>
                      <button onClick={onClose} className="px-10 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest rounded-xl transition-all">Bağla</button>
                   </motion.div>
                )}
              </AnimatePresence>

           </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SellerDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"items" | "add">("items");
  const [productType, setProductType] = useState<"property" | "transport">("property");
  
  const [myItems, setMyItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userPlan, setUserPlan] = useState("BASIC");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const [title, setTitle] = useState("");
  const [country, setCountry] = useState(UNIQUE_COUNTRIES[0]);
  const [city, setCity] = useState(COUNTRY_CITIES[UNIQUE_COUNTRIES[0]][0]);
  const [status, setStatus] = useState("Satış");
  const [price, setPrice] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [selectedImg, setSelectedImg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [desc, setDesc] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [area, setArea] = useState("");
  const [battery, setBattery] = useState("");
  const [power, setPower] = useState("");
  const [range, setRange] = useState("");
  const [category, setCategory] = useState("");

  const loadItems = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;

    setLoading(true);
    const [props, trans] = await Promise.all([
      getUserProperties(email),
      getUserVehicles(email)
    ]);
    
    setMyItems([
      ...props.map((p: any) => ({ ...p, pType: 'property' })),
      ...trans.map((t: any) => ({ ...t, pType: 'transport' }))
    ]);
    setLoading(false);
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "seller" && role !== "admin") {
      window.location.href = "/profile";
      return;
    }
    
    setUserPlan(localStorage.getItem("userPlan") || "BASIC");
    loadItems();

    const handlePlanChange = () => {
      setUserPlan(localStorage.getItem("userPlan") || "BASIC");
    };
    window.addEventListener("planChanged", handlePlanChange);
    return () => window.removeEventListener("planChanged", handlePlanChange);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCountryChange = (c: string) => {
    setCountry(c);
    setCity(COUNTRY_CITIES[c][0]);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setError("");

    if (!title || !price || !category) {
      setError("Lütfən bütün tələb olunan sahələri doldurun.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    const email = localStorage.getItem("userEmail");
    if (!email) return;

    setLoading(true);

    const itemData = {
      title, country, city, status, price, category,
      img: selectedImg || (productType === "property" 
        ? "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg" 
        : "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"),
      desc, beds, baths, area, battery, range,
      power: power ? `${power} HP` : undefined,
    };

    let res;
    if (productType === "property") {
      res = await createProperty(itemData, email);
    } else {
      res = await createVehicle(itemData, email);
    }

    setLoading(false);

    if (res.error) {
      if (res.error === "PLAN_LIMIT_REACHED") {
        setShowUpgradeModal(true);
      } else {
        setError(res.error);
      }
      return;
    }

    setSuccessMsg("Məhsul uğurla bazara çıxarıldı!");
    resetForm();
    loadItems();
    
    setTimeout(() => {
        setSuccessMsg("");
        setActiveTab("items");
    }, 2000);
  };

  const resetForm = () => {
    setTitle(""); setPrice(""); setDesc(""); setBeds(""); setBaths("");
    setArea(""); setBattery(""); setPower(""); setRange(""); setCategory("");
    setSelectedImg("");
  };

  const limitNum = userPlan === "BASIC" ? 5 : userPlan === "PRO" ? 50 : Infinity;
  const usagePercent = limitNum === Infinity ? 0 : Math.min((myItems.length / limitNum) * 100, 100);

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col pt-32 pb-24 relative overflow-hidden">
      
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={() => {
          setSuccessMsg(t.upgrade_success);
          setTimeout(() => setSuccessMsg(""), 3000);
          loadItems();
        }}
        t={t}
      />

      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex-grow">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/10 pb-8 gap-8">
           <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-black text-white">Satıcı Paneli</h1>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  userPlan === 'PRO' ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 
                  userPlan === 'ELITE' ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : 
                  'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  {userPlan === 'PRO' ? t.plan_pro || "PRO PLAN" : 
                   userPlan === 'ELITE' ? "ELITE PARTNER" : 
                   t.plan_basic || "BASIC PLAN"}
                </span>
              </div>
              <p className="text-slate-400">Şəxsi elanlarınızı, mülk və avtomobillərinizi buradan idarə edin.</p>
           </div>
           
           <div className="w-full md:w-64 bg-black/40 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.listings_usage}</span>
                <span className="text-sm font-black text-white">{myItems.length} / {limitNum === Infinity ? "Limitsiz" : limitNum}</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                 <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercent}%` }}
                  className={`h-full ${usagePercent >= 100 ? 'bg-red-500' : 'bg-amber-500 shadow-[0_0_10px_rgb(245,158,11)]'}`} 
                 />
              </div>
              {userPlan === 'BASIC' && (
                <button onClick={() => setShowUpgradeModal(true)} className="text-[10px] font-black text-amber-500 hover:text-amber-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-1 mt-1">
                  {t.btn_upgrade_plan} <Plus className="w-3 h-3" />
                </button>
              )}
           </div>
        </div>

        <div className="flex justify-center mb-12">
            <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-xl">
              <button 
                  onClick={() => setActiveTab("items")}
                  className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'items' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                Mənim Elanlarım
              </button>
              <button 
                  onClick={() => setActiveTab("add")}
                  className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'add' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
              >
                Yeni Əlavə Et
              </button>
            </div>
        </div>

        {activeTab === "items" && (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.length > 0 ? myItems.map(item => (
                <div key={item.id} className="bg-black/40 border border-white/10 rounded-3xl p-5 hover:bg-black/60 transition-colors flex flex-col gap-4 relative group">
                  <div className="h-40 rounded-xl overflow-hidden relative">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase border border-white/10 tracking-widest">
                      {item.status}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-amber-500 mb-1 uppercase tracking-widest">
                       {item.pType === "property" ? <Building2 className="w-3 h-3" /> : <Car className="w-3 h-3" />} {item.category}
                    </div>
                    <h3 className="text-xl font-black text-white truncate">{item.title}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1 font-bold">
                      <MapPin className="w-3.5 h-3.5" /> {item.country}, {item.city}
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/10 text-2xl font-black text-white flex justify-between items-center">
                    ${item.price?.toLocaleString() || 0}
                    <span className="text-[10px] text-slate-600 font-bold uppercase">{item.pType}</span>
                  </div>
                </div>
              )) : (
                 <div className="col-span-full py-28 flex flex-col items-center justify-center text-center opacity-60">
                   <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <Plus className="w-8 h-8 text-slate-500" />
                   </div>
                   <h3 className="text-xl font-black text-white mb-2">Elan yoxdur</h3>
                   <p className="text-slate-400 max-w-xs">Heç bir mülk və ya avtomobil satışa çıxarmamısınız.</p>
                 </div>
              )}
           </motion.div>
        )}

        {activeTab === "add" && (
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
              
              {myItems.length >= limitNum ? (
                <div className="rounded-[2.5rem] bg-zinc-900/60 backdrop-blur-3xl border border-white/10 p-12 md:p-16 shadow-2xl text-center flex flex-col items-center">
                   <div className="w-24 h-24 bg-red-500/10 rounded-[2rem] flex items-center justify-center mb-8">
                     <AlertCircle className="w-12 h-12 text-red-500" />
                   </div>
                   <h2 className="text-3xl font-black text-white mb-4">{t.limit_reached_title}</h2>
                   <p className="text-slate-400 mb-10 leading-relaxed max-w-sm mx-auto text-lg">
                      {t.limit_reached_desc}
                   </p>
                   <button 
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full max-w-xs py-5 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_15px_30px_-10px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-95"
                   >
                     {t.btn_upgrade_plan}
                   </button>
                </div>
              ) : (
                <div className="rounded-[2.5rem] bg-zinc-900/60 backdrop-blur-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
                  <AnimatePresence>
                    {successMsg && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl font-bold flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> {successMsg}
                        </motion.div>
                    )}
                    {error && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-bold flex items-center gap-3">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" /> {error}
                        </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-4 mb-10">
                    <button 
                      onClick={() => setProductType("property")}
                      className={`flex-1 py-6 border rounded-3xl flex flex-col items-center justify-center gap-3 transition-all ${productType === 'property' ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/5' : 'bg-black/30 border-white/5 text-slate-400 hover:bg-black/50'}`}
                    >
                      <Building2 className="w-10 h-10" />
                      <span className="font-black text-[10px] tracking-widest uppercase">Mülk (Ev/Sahə)</span>
                    </button>
                    <button 
                      onClick={() => setProductType("transport")}
                      className={`flex-1 py-6 border rounded-3xl flex flex-col items-center justify-center gap-3 transition-all ${productType === 'transport' ? 'bg-amber-500/10 border-amber-500 text-amber-500 shadow-lg shadow-amber-500/5' : 'bg-black/30 border-white/5 text-slate-400 hover:bg-black/50'}`}
                    >
                      <Car className="w-10 h-10" />
                      <span className="font-black text-[10px] tracking-widest uppercase">Avtomobil</span>
                    </button>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Başlıq</label>
                      <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Məs: Möhtəşəm Şəhər Görüntülü Villa" className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold transition-colors" />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Şəkil Seç & Çək</label>
                      <div className="flex items-center gap-5">
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-28 h-28 rounded-3xl bg-black/40 border-2 border-dashed border-white/10 hover:border-amber-500/50 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer transition-all active:scale-95"
                        >
                          {selectedImg ? (
                            <img src={selectedImg} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <Camera className="w-7 h-7 text-slate-600 group-hover:text-amber-500 transition-colors" />
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[10px] uppercase font-black text-white tracking-widest">Dəyiş</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-black text-slate-300">Qalereyadan seçin</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">Format: JPG, PNG. Yalnız yüksək keyfiyyətli şəkillər.</p>
                        </div>
                        <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Kateqoriya</label>
                      <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold appearance-none cursor-pointer">
                        <option value="" disabled>Kateqoriya Seçin</option>
                        {productType === "property" ? (
                          <>
                            <option value="Premium Villalar">Premium Villalar</option>
                            <option value="Penthaus">Penthaus</option>
                            <option value="Ağıllı Evlər">Ağıllı Evlər</option>
                            <option value="Dəniz Mənzərəli">Dəniz Mənzərəli</option>
                          </>
                        ) : (
                          <>
                            <option value="Elektrik (EV)">Elektrik (EV)</option>
                            <option value="Premium Sedan">Premium Sedan</option>
                            <option value="Sport Maşınlar">Sport Maşınlar</option>
                            <option value="SUV">SUV</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Ölkə</label>
                        <select value={country} onChange={(e) => handleCountryChange(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold appearance-none cursor-pointer">
                          {UNIQUE_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Şəhər</label>
                        <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold appearance-none cursor-pointer">
                          {COUNTRY_CITIES[country]?.map((c: string) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold appearance-none cursor-pointer">
                          <option value="Satış">Satış</option>
                          <option value="İcarə">İcarə</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Qiymət ($)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input required value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))} type="text" placeholder="150000" className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-6 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold" />
                        </div>
                      </div>
                    </div>

                    {productType === "property" ? (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block text-center">Yataq</label>
                          <input required value={beds} onChange={(e) => setBeds(e.target.value.replace(/\D/g, ''))} type="text" placeholder="3" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold text-center" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block text-center">Hamam</label>
                          <input required value={baths} onChange={(e) => setBaths(e.target.value.replace(/\D/g, ''))} type="text" placeholder="2" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold text-center" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block text-center">Sq.M</label>
                          <input required value={area} onChange={(e) => setArea(e.target.value.replace(/\D/g, ''))} type="text" placeholder="150" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold text-center" />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block text-center">Batareya</label>
                          <input required value={battery} onChange={(e) => setBattery(e.target.value.replace(/\D/g, ''))} type="text" placeholder="100%" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold text-center" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block text-center">Güc (HP)</label>
                          <input required value={power} onChange={(e) => setPower(e.target.value.replace(/\D/g, ''))} type="text" placeholder="500" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold text-center" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block text-center">KM</label>
                          <input required value={range} onChange={(e) => setRange(e.target.value.replace(/\D/g, ''))} type="text" placeholder="400" className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4.5 focus:outline-none focus:border-amber-500 text-white font-bold text-center" />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Detallı Təsvir</label>
                      <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="Məhsul haqqında geniş və cəlbedici məlumat yazın..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 focus:outline-none focus:border-amber-500 text-white font-medium resize-none shadow-inner" />
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-[0_15px_30px_-10px_rgba(245,158,11,0.4)] hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                    >
                      {loading ? "Gözləyin..." : "Elanı Yerləşdir"}
                    </button>
                  </form>
                </div>
              )}
           </motion.div>
        )}

      </div>
      <Footer />
    </div>
  );
}
