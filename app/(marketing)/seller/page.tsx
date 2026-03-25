"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Building2, Car, MapPin, CheckCircle2, DollarSign, Camera } from "lucide-react";
import Footer from "@/components/common/Footer";
import { UNIQUE_COUNTRIES, COUNTRY_CITIES } from "@/constants/countries";
import { useLanguage } from "@/context/LanguageContext";

export default function SellerDashboard() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<"items" | "add">("items");
  const [productType, setProductType] = useState<"property" | "transport">("property");
  
  const [myItems, setMyItems] = useState<any[]>([]);

  // Form State
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState(UNIQUE_COUNTRIES[0]);
  const [city, setCity] = useState(COUNTRY_CITIES[UNIQUE_COUNTRIES[0]][0]);
  const [status, setStatus] = useState("Satış");
  const [price, setPrice] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedImg, setSelectedImg] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Specific Fields
  const [desc, setDesc] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [area, setArea] = useState("");
  const [battery, setBattery] = useState("");
  const [power, setPower] = useState("");
  const [range, setRange] = useState("");
  const [category, setCategory] = useState("");

  const loadItems = () => {
    const props = JSON.parse(localStorage.getItem("sphere_user_properties") || "[]");
    const trans = JSON.parse(localStorage.getItem("sphere_user_transports") || "[]");
    setMyItems([...props.map((p: any) => ({...p, pType: 'property'})), ...trans.map((t: any) => ({...t, pType: 'transport'}))]);
  };

  useEffect(() => {
    if (localStorage.getItem("userRole") !== "seller") {
       window.location.href = "/profile";
       return;
    }
    loadItems();
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !category) {
      setSuccessMsg("Lütfən bütün tələb olunan sahələri doldurun.");
      setTimeout(() => setSuccessMsg(""), 3000);
      return;
    }

    const newItem = {
      id: `usr-${Date.now()}`,
      title,
      country,
      loc: city,
      status,
      priceRaw: parseInt(price),
      price: parseInt(price).toLocaleString(),
      category: category,
      img: selectedImg || (productType === "property" 
        ? "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg" 
        : "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg"),
      // Mock metrics & Specific Features
      desc,
      rating: "5.0",
      beds: productType === "property" ? parseInt(beds) : undefined,
      baths: productType === "property" ? parseInt(baths) : undefined,
      area: productType === "property" ? parseInt(area) : undefined,
      battery: productType === "transport" ? parseInt(battery) : undefined,
      power: productType === "transport" ? `${power} HP` : undefined,
      range: productType === "transport" ? parseInt(range) : undefined
    };

    const storageKey = productType === "property" ? "sphere_user_properties" : "sphere_user_transports";
    const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
    localStorage.setItem(storageKey, JSON.stringify([newItem, ...existing]));

    setSuccessMsg("Məhsul uğurla bazara çıxarıldı!");
    setTitle("");
    setPrice("");
    setDesc("");
    setBeds("");
    setBaths("");
    setArea("");
    setBattery("");
    setPower("");
    setRange("");
    setCategory("");
    setSelectedImg("");
    loadItems();
    
    setTimeout(() => {
        setSuccessMsg("");
        setActiveTab("items");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col pt-32 pb-24 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex-grow">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-white/10 pb-8 gap-6">
           <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Satıcı Paneli</h1>
               <p className="text-slate-400">Şəxsi elanlarınızı, mülk və avtomobillərinizi buradan idarə edin.</p>
           </div>
           
           <div className="flex bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1 shadow-xl">
             <button 
                onClick={() => setActiveTab("items")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'items' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
             >
               Mənim Elanlarım
             </button>
             <button 
                onClick={() => setActiveTab("add")}
                className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${activeTab === 'add' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'}`}
             >
               Yeni Əlavə Et
             </button>
           </div>
        </div>

        {activeTab === "items" && (
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.length > 0 ? myItems.map(item => (
                <div key={item.id} className="bg-black/40 border border-white/10 rounded-3xl p-5 hover:bg-black/60 transition-colors flex flex-col gap-4">
                  <div className="h-40 rounded-xl overflow-hidden relative">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase border border-white/10">
                      {item.status}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-1 uppercase tracking-widest">
                       {item.pType === "property" ? <Building2 className="w-3.5 h-3.5" /> : <Car className="w-3.5 h-3.5" />} {item.category}
                    </div>
                    <h3 className="text-xl font-black text-white truncate">{item.title}</h3>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm mt-1">
                      <MapPin className="w-4 h-4" /> {item.country}, {item.loc}
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/10 text-2xl font-black text-white">
                    ${item.price}
                  </div>
                </div>
              )) : (
                 <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-60">
                   <Plus className="w-16 h-16 text-slate-500 mb-4" />
                   <h3 className="text-xl font-black text-white">Elan yoxdur</h3>
                   <p className="text-slate-400">Heç bir mülk və ya avtomobil satışa çıxarmamısınız.</p>
                 </div>
              )}
           </motion.div>
        )}

        {activeTab === "add" && (
           <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto rounded-[2rem] bg-zinc-900/60 backdrop-blur-3xl border border-white/10 p-8 md:p-12 shadow-2xl">
              
              <AnimatePresence>
                 {successMsg && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-bold flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> {successMsg}
                    </motion.div>
                 )}
              </AnimatePresence>

              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setProductType("property")}
                  className={`flex-1 py-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${productType === 'property' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-black/30 border-white/5 text-slate-400 hover:bg-black/50'}`}
                >
                  <Building2 className="w-8 h-8" />
                  <span className="font-bold text-sm tracking-widest uppercase">Mülk (Ev/Sahə)</span>
                </button>
                <button 
                  onClick={() => setProductType("transport")}
                  className={`flex-1 py-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${productType === 'transport' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-black/30 border-white/5 text-slate-400 hover:bg-black/50'}`}
                >
                  <Car className="w-8 h-8" />
                  <span className="font-bold text-sm tracking-widest uppercase">Avtomobil</span>
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-6">
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Başlıq</label>
                   <input required value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Məs: Möhtəşəm Şəhər Görüntülü Villa" className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium" />
                 </div>

                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Şəkil Seç & Çək</label>
                   <div className="mt-2 flex items-center gap-4">
                     <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-24 h-24 rounded-2xl bg-black/40 border-2 border-dashed border-white/20 hover:border-amber-500/50 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer transition-colors"
                     >
                       {selectedImg ? (
                         <img src={selectedImg} alt="Preview" className="w-full h-full object-cover" />
                       ) : (
                         <Camera className="w-6 h-6 text-slate-500 group-hover:text-amber-500 transition-colors" />
                       )}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                         <span className="text-[10px] uppercase font-bold text-white tracking-widest">Dəyiş</span>
                       </div>
                     </div>
                     <div className="flex-1">
                       <p className="text-sm font-medium text-slate-300">Qalereyadan seçin və ya kameranı açın.</p>
                       <p className="text-xs text-slate-500 mt-1">Format: JPG, PNG. Yalnız yüksək keyfiyyətli şəkillər.</p>
                     </div>
                     <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                   </div>
                 </div>

                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Kateqoriya</label>
                   <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium appearance-none">
                     <option value="" disabled>Kataloqdan Kateqoriya Seçin</option>
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

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Ölkə</label>
                     <select value={country} onChange={(e) => handleCountryChange(e.target.value)} className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium appearance-none">
                       {UNIQUE_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Şəhər(Lokasiya)</label>
                     <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium appearance-none">
                       {COUNTRY_CITIES[country]?.map((c: string) => <option key={c} value={c}>{c}</option>)}
                     </select>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</label>
                     <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium appearance-none">
                       <option value="Satış">Satış</option>
                       <option value="İcarə">İcarə</option>
                     </select>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Qiymət ($)</label>
                     <div className="relative mt-2">
                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                       <input required value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))} type="text" placeholder="150000" className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium" />
                     </div>
                   </div>
                 </div>

                 {/* Dynamic Condition Fields */}
                 {productType === "property" ? (
                   <div className="grid grid-cols-3 gap-4">
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Yataq Otağı</label>
                       <input required value={beds} onChange={(e) => setBeds(e.target.value.replace(/\D/g, ''))} type="text" placeholder="3" className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hamam</label>
                       <input required value={baths} onChange={(e) => setBaths(e.target.value.replace(/\D/g, ''))} type="text" placeholder="2" className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sahə (Sq.M)</label>
                       <input required value={area} onChange={(e) => setArea(e.target.value.replace(/\D/g, ''))} type="text" placeholder="150" className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium" />
                     </div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-3 gap-4">
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Batareya (%)</label>
                       <input required value={battery} onChange={(e) => setBattery(e.target.value.replace(/\D/g, ''))} type="text" placeholder="100" className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Güc (HP)</label>
                       <input required value={power} onChange={(e) => setPower(e.target.value.replace(/\D/g, ''))} type="text" placeholder="500" className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium" />
                     </div>
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mənzil (KM)</label>
                       <input required value={range} onChange={(e) => setRange(e.target.value.replace(/\D/g, ''))} type="text" placeholder="400" className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium" />
                     </div>
                   </div>
                 )}

                 {/* Description Field */}
                 <div>
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detallı Təsvir</label>
                   <textarea required value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} placeholder="Məhsul haqqında geniş və cəlbedici məlumat yazın..." className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-amber-500 text-white font-medium resize-none shadow-inner" />
                 </div>

                 <button type="submit" className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-xl shadow-amber-500/20">
                   Elanı Yerləşdir
                 </button>
              </form>
           </motion.div>
        )}

      </div>
      <Footer />
    </div>
  );
}
