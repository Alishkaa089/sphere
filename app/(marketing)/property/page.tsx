"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import Footer from "@/components/common/Footer";
import Link from "next/link";
import { Search, MapPin, BedDouble, Bath, Square, Star, Heart, Globe, ChevronDown, Map } from "lucide-react";
import { UNIQUE_COUNTRIES, COUNTRY_CITIES } from "@/constants/countries";
import { getProperties } from "@/lib/actions";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORIES = ["Bütün Mülklər", "Premium Villalar", "Penthaus", "Ağıllı Evlər", "Dəniz Mənzərəli"];

export default function PropertyPage() {
  const { t, lang } = useLanguage();
  
  const CATEGORIES = [
    { label: t.all_properties, val: "Bütün Mülklər" },
    { label: t.premium_villas, val: "Premium Villalar" },
    { label: t.penthouse, val: "Penthaus" },
    { label: t.smart_homes, val: "Ağıllı Evlər" },
    { label: t.sea_view, val: "Dəniz Mənzərəli" }
  ];

  const [selectedCountry, setSelectedCountry] = useState("Bütün Ölkələr");
  const [selectedCity, setSelectedCity] = useState("Bütün Şəhərlər");
  const [selectedCategory, setSelectedCategory] = useState("Bütün Mülklər");
  const [tradeType, setTradeType] = useState<"Bütün" | "Satış" | "Kirayə">("Bütün");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [ALL_PROPERTIES, setAllProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchProps = async () => {
      const dbProps = await getProperties();
      setAllProperties(dbProps);
    };
    fetchProps();
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

  const handleCountrySelect = (ctry: string) => {
    setSelectedCountry(ctry);
    setSelectedCity("Bütün Şəhərlər");
    setIsCountryDropdownOpen(false);
  };

  const isSale = (status: string) => status === "Satış" || status === "Sale";

  const filteredProperties = ALL_PROPERTIES.filter(prop => {
    const matchesCountry = selectedCountry === "Bütün Ölkələr" || prop.country === selectedCountry;
    const matchesCity = selectedCity === "Bütün Şəhərlər" || prop.city === selectedCity;
    const matchesCategory = selectedCategory === "Bütün Mülklər" || prop.category === selectedCategory;
    const matchesType = tradeType === "Bütün" 
        ? true 
        : tradeType === "Satış" 
            ? isSale(prop.status) 
            : !isSale(prop.status);
    const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prop.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesCity && matchesCategory && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col relative overflow-hidden">
      
      {/* ── Premium Hero Background Image ── */}
      <div className="absolute top-0 left-0 right-0 h-[75vh] z-0 overflow-hidden">
        <Image 
          src="/prop_v4.png"
          alt="Luxury Property Background"
          fill
          quality={100}
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0a0a09] via-[#0a0a09]/80 to-transparent z-10" />
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
        
        {/* ── HERO CONTENT ── */}
        <div className="max-w-4xl mb-12 sm:mb-20 pt-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl"
          >
            <span className="w-2 h-2 rounded-full bg-[#00A3CC] animate-pulse" />
            {t.premium_property_badge}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl leading-[1.1] mb-6"
            style={{ fontFamily: "'Grailga', serif" }}
          >
            {t.hero_title_part1} <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-[#7FD4E8]">{t.hero_title_part2}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 drop-shadow-md font-medium leading-relaxed max-w-2xl"
          >
            {t.hero_description}
          </motion.p>
        </div>

        {/* ── FLOATING GLASS SEARCH BAR ── */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-30 -mt-8 mb-8"
        >
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-2 md:p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex w-full md:w-auto items-center flex-1 px-4 h-12 md:h-14 bg-black/50 rounded-2xl border border-white/5">
              <Search className="w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder={t.search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none focus:ring-0 ml-3 text-white font-medium placeholder:text-slate-500"
              />
            </div>
            
            {/* Country Selector */}
            <div className="relative w-full md:w-56 z-50">
              <button 
                onClick={() => {setIsCountryDropdownOpen(!isCountryDropdownOpen); setIsCityDropdownOpen(false)}}
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
                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50 scrollbar-thin scrollbar-thumb-white/10"
                  >
                    <button 
                      onClick={() => handleCountrySelect("Bütün Ölkələr")}
                      className="w-full text-left px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                    >
                      {t.all_countries}
                    </button>
                    {UNIQUE_COUNTRIES.map(ctry => (
                      <button 
                        key={ctry}
                        onClick={() => handleCountrySelect(ctry)}
                        className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {getCountryLabel(ctry)}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* City Selector */}
            <div className="relative w-full md:w-56 z-40">
              <button 
                disabled={selectedCountry === "Bütün Ölkələr"}
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className={`flex items-center justify-between w-full h-12 md:h-14 px-5 rounded-2xl border transition ${selectedCountry === "Bütün Ölkələr" ? "bg-black/20 border-white/0 text-slate-600 cursor-not-allowed" : "bg-black/50 border-white/5 text-white hover:bg-black/70 font-bold"}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Map className={`w-4 h-4 flex-shrink-0 ${selectedCountry === "Bütün Ölkələr" ? "text-slate-600" : "text-cyan-400"}`} />
                  <span className="truncate text-sm">{selectedCountry === "Bütün Ölkələr" ? t.select_country : getCityLabel(selectedCity)}</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCityDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isCityDropdownOpen && selectedCountry !== "Bütün Ölkələr" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50 scrollbar-thin scrollbar-thumb-white/10"
                  >
                    <button 
                      onClick={() => { setSelectedCity("Bütün Şəhərlər"); setIsCityDropdownOpen(false); }}
                      className="w-full text-left px-5 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
                    >
                      {t.all_cities}
                    </button>
                    {availableCities.map(city => (
                      <button 
                        key={city}
                        onClick={() => { setSelectedCity(city); setIsCityDropdownOpen(false); }}
                        className="w-full text-left px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── FILTER TOGGLES ── */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-10 border-b border-white/5 pb-6">
          <div className="flex overflow-x-auto gap-3 pb-2 w-full lg:w-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button 
                key={cat.val}
                onClick={() => setSelectedCategory(cat.val)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat.val
                    ? "bg-white text-slate-900 shadow-md transform scale-10"
                    : "bg-zinc-900 border border-zinc-800 text-slate-400 hover:border-[#006B8A] hover:text-[#00A3CC]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex bg-zinc-900 border border-white/10 p-1 rounded-full w-full lg:w-auto shadow-lg">
            {["Bütün", "Satış", "Kirayə"].map((type) => (
              <button
                key={type}
                onClick={() => setTradeType(type as any)}
                className={`flex-1 lg:flex-none px-8 py-2 rounded-full text-sm font-bold transition-all ${
                  tradeType === type
                    ? "bg-[#004E64] text-white shadow-lg shadow-[#004E64]/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {type === "Bütün" ? t.all : type === "Satış" ? t.for_sale : t.for_rent || "Kirayə"}
              </button>
            ))}
          </div>
        </div>

        {/* ── PROPERTY GRID ── */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((prop, i) => {
              const pSale = isSale(prop.status);
              return (
              <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.3 }}
                key={prop.id} 
                className="group"
              >
                <Link href={`/property/${prop.id}`} className="block h-full">
                  <Card className="h-full overflow-hidden border-0 bg-transparent flex flex-col relative rounded-3xl">
                    
                    <div className="relative h-[300px] w-full rounded-3xl overflow-hidden shadow-lg border border-white/10">
                      <img 
                        src={prop.img}
                        alt={prop.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />
                      
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        <div className="flex flex-col items-start gap-2">
                          <div className={`backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg ${pSale ? "bg-emerald-500/50" : "bg-[#006B8A]/50"}`}>
                            {pSale ? t.for_sale : t.for_rent}
                          </div>
                          <div className="bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                            <Globe className="w-3 h-3 text-[#00A3CC]" /> {getCountryLabel(prop.country)}
                          </div>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white hover:bg-white hover:text-red-500 transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-sm mb-1 drop-shadow-md">
                          <MapPin className="w-4 h-4" />
                          {prop.city}
                        </div>
                        <h3 className="text-xl font-black drop-shadow-md truncate">{prop.title}</h3>
                      </div>
                    </div>

                    <CardContent className="px-1 py-5 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between text-slate-400 mb-5 text-sm font-semibold">
                        <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/5 px-2.5 py-1.5 rounded-lg"><BedDouble className="w-4 h-4 text-[#006B8A]"/> {prop.beds}</div>
                        <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/5 px-2.5 py-1.5 rounded-lg"><Bath className="w-4 h-4 text-cyan-500"/> {prop.baths}</div>
                        <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/5 px-2.5 py-1.5 rounded-lg"><Square className="w-4 h-4 text-[#006B8A]"/> {prop.area}m²</div>
                      </div>
                      
                      <div className="flex items-end justify-between border-t border-zinc-800/80 pt-4">
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                            {pSale ? t.sale_price : t.monthly_rent}
                          </p>
                          <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-white">${prop.price.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold text-slate-200 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {prop.rating}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )})}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-zinc-900/30 rounded-3xl border border-white/5">
            <MapPin className="w-16 h-16 text-slate-600 mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">{t.no_property_found_title}</h3>
            <p className="text-slate-400 max-w-sm">"{selectedCity}" {t.no_property_found_description}</p>
            <button 
              onClick={() => { setSelectedCity("Bütün Şəhərlər"); setSearchQuery(""); setTradeType("Bütün"); setSelectedCategory("Bütün Mülklər"); }}
              className="mt-6 px-6 py-2.5 font-bold rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
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
