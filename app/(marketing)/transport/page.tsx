"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Gauge, ShieldPlus, Battery, Star, Car, Globe, ChevronDown, Map, ArrowRight } from "lucide-react";
import { UNIQUE_COUNTRIES, COUNTRY_CITIES } from "@/constants/countries";
import { getVehicles } from "@/lib/actions";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/context/LanguageContext";
import FavoriteButton from "@/components/common/FavoriteButton";

const CATEGORIES = ["Bütün Transportlar", "İdman Avtomobilləri", "Premium Yolsuzluq (SUV)", "Eksklüziv", "Elektrik"];

export default function TransportPage() {
  const { t, lang } = useLanguage();
  
  const CATEGORIES = [
    { label: t.cat_all, val: "Bütün Transportlar" },
    { label: t.cat_sports, val: "İdman Avtomobilləri" },
    { label: t.cat_suv, val: "Premium Yolsuzluq (SUV)" },
    { label: t.cat_exclusive, val: "Eksklüziv" },
    { label: t.cat_electric, val: "Elektrik" }
  ];

  const [selectedCountry, setSelectedCountry] = useState("Bütün Ölkələr");
  const [selectedCity, setSelectedCity] = useState("Bütün Şəhərlər");
  const [selectedCategory, setSelectedCategory] = useState("Bütün Transportlar");
  const [searchQuery, setSearchQuery] = useState("");
  const [tradeType, setTradeType] = useState<"Bütün" | "Satış" | "İcarə">("Bütün");

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const [ALL_VEHICLES, setAllVehicles] = useState<any[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      const dbVehicles = await getVehicles();
      setAllVehicles(dbVehicles);
    };
    fetchVehicles();
  }, []);

  const getCountryLabel = (c: string) => {
    if (c === "Bütün Ölkələr") return t.all_countries;
    const countryMap: Record<string, string> = {
      "BƏƏ": t.country_UAE,
      "Türkiyə": t.country_Turkey,
      "Qətər": t.country_Qatar,
      "Azərbaycan": t.country_Azerbaijan,
      "ABŞ": t.country_USA,
      "Almaniya": t.country_Germany,
      "Böyük Britaniya": t.country_UK,
      "Fransa": t.country_France,
      "İtaliya": t.country_Italy,
      "İspaniya": t.country_Spain,
      "İsveçrə": t.country_Switzerland,
      "Monako": t.country_Monaco,
    };
    return countryMap[c] || c;
  };

  const getCityLabel = (city: string) => {
    if (city === "Bütün Şəhərlər") return t.all_cities;
    return city;
  };

  const availableCities = selectedCountry !== "Bütün Ölkələr" && COUNTRY_CITIES[selectedCountry] 
     ? COUNTRY_CITIES[selectedCountry] 
     : [];

  const isSale = (status: string) => status === "Satış" || status === "Sale";

  const handleCountrySelect = (c: string) => {
    setSelectedCountry(c);
    setSelectedCity("Bütün Şəhərlər");
    setIsCountryDropdownOpen(false);
  };

  const filteredVehicles = ALL_VEHICLES.filter(v => {
    const matchesQuery = (v.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (v.city || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = selectedCountry === "Bütün Ölkələr" || v.country === selectedCountry;
    const matchesCity = selectedCity === "Bütün Şəhərlər" || v.city === selectedCity;
    const matchesCat = selectedCategory === "Bütün Transportlar" || v.category === selectedCategory;
    const matchesTrade = tradeType === "Bütün" 
        ? true 
        : tradeType === "Satış" 
            ? isSale(v.status) 
            : !isSale(v.status);

    return matchesQuery && matchesCountry && matchesCity && matchesCat && matchesTrade;
  });

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col relative overflow-hidden">
      
      <div className="absolute top-0 left-0 right-0 h-[75vh] z-0 overflow-hidden">
        <Image 
          src="/trans_v4.png"
          alt="Luxury Transport Background"
          fill
          quality={100}
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0a09] via-[#0a0a09]/80 to-transparent z-10" />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        <div className="max-w-4xl mb-12 sm:mb-20 pt-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-[#00A3CC] animate-pulse" />
            {t.cat_trans_badge || "Elite Fleet"}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl leading-[1.1] mb-6"
            style={{ fontFamily: "'Grailga', serif" }}
          >
            Unleash <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">{t.cat_trans_title || "High-Speed Collection."}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 drop-shadow-md font-medium leading-relaxed max-w-2xl"
          >
             {t.cat_trans_desc}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-30 -mt-8 mb-8"
        >
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2rem] p-2 md:p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex w-full md:w-auto items-center flex-1 px-4 h-12 md:h-14 bg-black/50 rounded-2xl border border-white/5 focus-within:border-[#006B8A] focus-within:ring-1 focus-within:ring-[#006B8A] transition-all">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder={t.search_placeholder || "Axtarış..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 ml-3 text-white font-medium placeholder:text-slate-500"
              />
            </div>

            <div className="relative w-full md:w-56 z-50">
              <button 
                onClick={() => { setIsCountryDropdownOpen(!isCountryDropdownOpen); setIsCityDropdownOpen(false); }}
                className="flex items-center justify-between w-full h-12 md:h-14 px-5 rounded-2xl bg-black/50 border border-white/5 text-white font-bold hover:bg-black/70 transition"
              >
                <div className="flex items-center gap-2 truncate">
                  <Globe className="w-4 h-4 text-[#00A3CC] flex-shrink-0" />
                  <span className="truncate text-sm">{getCountryLabel(selectedCountry)}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCountryDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isCountryDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50 py-2 scrollbar-thin overflow-x-hidden"
                  >
                    <button 
                      onClick={() => handleCountrySelect("Bütün Ölkələr")}
                      className="w-full text-left px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                    >
                      {t.all_countries}
                    </button>
                    {UNIQUE_COUNTRIES.map(ctry => (
                      <button 
                        key={ctry} onClick={() => handleCountrySelect(ctry)}
                        className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {getCountryLabel(ctry)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative w-full md:w-56 z-40">
              <button 
                onClick={() => { if (selectedCountry !== "Bütün Ölkələr") setIsCityDropdownOpen(!isCityDropdownOpen); setIsCountryDropdownOpen(false); }}
                className={`flex items-center justify-between w-full h-12 md:h-14 px-5 rounded-2xl border transition text-white font-bold ${selectedCountry === "Bütün Ölkələr" ? "bg-black/20 border-white/5 opacity-50 cursor-not-allowed" : "bg-black/50 border-white/5 hover:bg-black/70"}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Map className={`w-4 h-4 flex-shrink-0 ${selectedCountry === "Bütün Ölkələr" ? "text-slate-600" : "text-purple-400"}`} />
                  <span className="truncate text-sm">{selectedCountry === "Bütün Ölkələr" ? t.select_country : getCityLabel(selectedCity)}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCityDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isCityDropdownOpen && selectedCountry !== "Bütün Ölkələr" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl z-50 py-2 scrollbar-thin overflow-x-hidden"
                  >
                    <button 
                      onClick={() => { setSelectedCity("Bütün Şəhərlər"); setIsCityDropdownOpen(false); }}
                      className="w-full text-left px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                    >
                      {t.all_cities}
                    </button>
                    {availableCities.map(city => (
                      <button 
                        key={city} onClick={() => { setSelectedCity(city); setIsCityDropdownOpen(false); }}
                        className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] p-1 mt-4 shadow-sm w-fit overflow-hidden">
             {["Bütün", "Satış", "İcarə"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTradeType(type as any)}
                  className={`px-8 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                    tradeType === type
                      ? "bg-white text-black shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {type === "Bütün" ? t.all : type === "Satış" ? t.for_sale : t.for_rent}
                </button>
             ))}
          </div>

          <div className="flex gap-2 mt-4 flex-wrap pb-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat.val} 
                onClick={() => setSelectedCategory(cat.val)}
                className={`px-6 py-2 rounded-full font-bold transition-all text-sm ${
                  selectedCategory === cat.val
                    ? "bg-[#004E64] border border-[#006B8A] text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]" 
                    : "bg-black/50 border border-white/10 text-slate-400 hover:border-[#006B8A] hover:text-[#00A3CC]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10 w-full">
            {filteredVehicles.map((v, i) => {
              const vSale = isSale(v.status);
              return (
              <motion.div 
                key={v.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="w-full"
              >
                <Link href={`/transport/${v.id}`} className="group relative block bg-[#0f0f0e] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#006B8A]/50 transition-all shadow-xl hover:shadow-[#006B8A]/10 h-full flex flex-col w-full">
                  
                  <div className="relative h-64 overflow-hidden">
                    <img src={v.img} alt={v.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0e] via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
                       <div className={`backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg ${vSale ? 'bg-emerald-500/80' : 'bg-purple-500/80'}`}>
                         {vSale ? t.for_sale : t.for_rent}
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="bg-black/80 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-1">
                           <Globe className="w-3 h-3 text-[#00A3CC]" /> {getCountryLabel(v.country)}
                         </div>
                         <FavoriteButton productId={v.id} type="vehicle" />
                       </div>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 z-10 text-white">
                        <div className="flex items-center gap-1.5 text-[#7FD4E8] font-bold text-sm mb-2 drop-shadow-md">
                          <MapPin className="w-4 h-4" />
                          {v.city}
                        </div>
                        <h3 className="text-2xl font-black drop-shadow-md truncate">{v.title}</h3>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between bg-gradient-to-b from-transparent to-black/40">
                    <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-wider mb-8">
                       <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5"><Gauge className="w-3.5 h-3.5 text-slate-300" /> 3.2s</span>
                       <span className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5"><Battery className="w-3.5 h-3.5 text-slate-300" /> 100%</span>
                       <span className="flex items-center gap-1.5 text-amber-400 ml-auto bg-amber-500/10 px-2 py-1 rounded-md"><Star className="w-3.5 h-3.5 fill-amber-400" /> {v.rating}</span>
                    </div>
                    
                    <div className="flex items-end justify-between border-t border-white/5 pt-5">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                          {vSale ? t.val_trans_price : t.val_rent_price}
                        </p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-black text-white">${v.price.toLocaleString()}</span>
                          {!vSale && <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">/ {t.word_day || "day"}</span>}
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:bg-[#004E64] group-hover:border-[#006B8A] transition-all shadow-lg transform group-hover:scale-110">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )})}
          </div>
        ) : (
          <div className="py-24 text-center flex flex-col items-center justify-center bg-zinc-900/40 rounded-[2rem] border border-white/5 backdrop-blur-xl">
            <Car className="w-20 h-20 text-slate-600 mb-6 opacity-40" />
            <h3 className="text-3xl font-black text-white mb-3">{t.no_property_found_title}</h3>
            <p className="text-slate-400 max-w-md mx-auto text-lg">{t.no_property_found_description}</p>
            <button 
              onClick={() => { setSelectedCity("Bütün Şəhərlər"); setSearchQuery(""); setTradeType("Bütün"); setSelectedCategory("Bütün Transportlar"); setSelectedCountry("Bütün Ölkələr"); }}
              className="mt-8 px-8 py-3 font-bold uppercase tracking-widest rounded-full bg-white text-black hover:bg-slate-200 transition shadow-xl hover:shadow-white/20"
            >
              {t.reset_filters}
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
