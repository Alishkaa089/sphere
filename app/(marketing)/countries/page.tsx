"use client";

import { motion } from "framer-motion";
import { MapPin, Globe, ArrowUpRight, Plane, Building2, Car, Star } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import { UNIQUE_COUNTRIES, COUNTRY_CITIES } from "@/constants/countries";
import { useLanguage } from "@/context/LanguageContext";

export default function CountriesPage() {
  const { t, lang } = useLanguage();

  const getTranslatedCountry = (enName: string) => {
    const dict: any = {
      "USA": { en: "United States", az: "ABŞ", ru: "США" },
      "UK": { en: "United Kingdom", az: "Böyük Britaniya", ru: "Великобритания" },
      "France": { en: "France", az: "Fransa", ru: "Франция" },
      "Switzerland": { en: "Switzerland", az: "İsveçrə", ru: "Швейцария" },
      "Italy": { en: "Italy", az: "İtaliya", ru: "Италия" },
      "Monaco": { en: "Monaco", az: "Monako", ru: "Монако" },
      "UAE": { en: "UAE", az: "BƏƏ (Dubay)", ru: "ОАЭ" },
      "Japan": { en: "Japan", az: "Yaponiya", ru: "Япония" },
      "Germany": { en: "Germany", az: "Almaniya", ru: "Германия" },
      "Spain": { en: "Spain", az: "İspaniya", ru: "Испания" },
    };
    if (dict[enName]) return dict[enName][lang] || enName;
    return enName;
  };

  const getTranslatedCity = (enCity: string) => {
    const dict: any = {
      "New York": { az: "Nyu-York", ru: "Нью-Йорк", en: "New York" },
      "Los Angeles": { az: "Los-Anceles", ru: "Лос-Анджелес", en: "Los Angeles" },
      "Miami": { az: "Mayami", ru: "Майами", en: "Miami" },
      "London": { az: "London", ru: "Лондон", en: "London" },
      "Paris": { az: "Paris", ru: "Париж", en: "Paris" },
      "Zurich": { az: "Sürix", ru: "Цюрих", en: "Zurich" },
      "Geneva": { az: "Cenevrə", ru: "Женева", en: "Geneva" },
      "Milan": { az: "Milan", ru: "Милан", en: "Milan" },
      "Rome": { az: "Roma", ru: "Рим", en: "Rome" },
      "Dubai": { az: "Dubay", ru: "Дубай", en: "Dubai" },
      "Abu Dhabi": { az: "Əbu-Dabi", ru: "Абу-Даби", en: "Abu Dhabi" },
      "Tokyo": { az: "Tokio", ru: "Токио", en: "Tokyo" },
      "Berlin": { az: "Berlin", ru: "Берлин", en: "Berlin" },
      "Munich": { az: "Münhen", ru: "Мюнхен", en: "Munich" },
      "Madrid": { az: "Madrid", ru: "Мадрид", en: "Madrid" },
      "Barcelona": { az: "Barselona", ru: "Барселона", en: "Barcelona" },
    };
    if (dict[enCity]) return dict[enCity][lang] || enCity;
    return enCity;
  };

  const topTitle = lang === 'az' ? 'Ən Məşhur İstiqamətlər' : lang === 'ru' ? 'Популярные Направления' : 'Top Destinations';
  const allTitle = lang === 'az' ? 'Qlobal Şəbəkə' : lang === 'ru' ? 'Глобальная Сеть' : 'Global Network';

  const POPULAR_COUNTRIES = ["USA", "UAE", "Monaco", "Switzerland"];
  const REMAINING_COUNTRIES = UNIQUE_COUNTRIES.filter(c => !POPULAR_COUNTRIES.includes(c));

  // Render Component for Country Cards
  const CountryCard = ({ ctry, isPopular = false }: { ctry: string, isPopular?: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/countries/${ctry}`} className={`block group bg-zinc-900/40 border hover:border-blue-500/30 rounded-[2rem] p-8 transition-all h-full flex flex-col hover:bg-zinc-800/80 hover:shadow-2xl text-left hover:shadow-blue-500/10 cursor-pointer ${isPopular ? "border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]" : "border-white/5"}`}>
        
        {/* Header Content */}
        <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all transform group-hover:scale-110 shadow-inner ${isPopular ? "bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-400 group-hover:bg-blue-600 group-hover:text-white" : "bg-white/5 border border-white/10 text-slate-400 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white"}`}>
                    <MapPin className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">
                     {getTranslatedCountry(ctry)}
                   </h2>
                   <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">
                       {isPopular ? (lang === 'az' ? 'PREMİUM BÖLGƏ' : lang === 'ru' ? 'ПРЕМИУМ' : 'PREMIUM') : (t.cat_loc_badge || "Geography")}
                     </span>
                     {isPopular && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 opacity-80" />}
                   </div>
                </div>
            </div>
        </div>

        {/* Cities Pill Box */}
        <div className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-8 pointer-events-none">
                {(COUNTRY_CITIES[ctry] || []).map((city: string) => (
                    <span key={city} className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${isPopular ? "bg-blue-500/10 border border-blue-500/20 text-blue-300 group-hover:bg-blue-600/20 group-hover:border-blue-400/30" : "bg-black/60 border border-white/5 text-slate-300 group-hover:border-indigo-500/20"}`}>
                        {getTranslatedCity(city)}
                    </span>
                ))}
            </div>
        </div>

        {/* Bottom Interactive Prompt */}
        <div className="pt-6 border-t mt-auto flex items-center justify-between pointer-events-none transition-colors border-white/5 group-hover:border-white/10">
            <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-zinc-900 flex items-center justify-center z-20">
                    <Building2 className="w-4 h-4 text-emerald-400 box-content" />
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-500/20 border-2 border-zinc-900 flex items-center justify-center z-10">
                    <Car className="w-4 h-4 text-indigo-400 box-content" />
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-blue-400 transition-colors">
                <span className="hidden sm:inline">Kataloqa Göz At</span> 
                <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
        </div>

      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a09] text-white pt-24 pb-12 flex flex-col relative overflow-hidden">
      
      {/* Immersive Dark Background Lights */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow relative z-10">
        
        {/* Header Text */}
        <div className="text-center max-w-4xl mx-auto mb-20 pt-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-blue-500 font-bold tracking-widest uppercase mb-4 text-sm flex items-center justify-center gap-2"
          >
            <Globe className="w-5 h-5" /> {t.cat_loc_badge || "Geography"}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-6 tracking-tighter"
          >
            {t.cat_loc_title || "Global Locations."}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-400 max-w-3xl mx-auto font-medium"
          >
            {t.cat_loc_desc || "Discover where our luxury networks operate worldwide."}
          </motion.p>
        </div>

        {/* SECTION 1: TOP/POPULAR COUNTRIES */}
        <div className="mb-20">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="flex items-center gap-4 mb-8"
          >
             <h2 className="text-3xl font-black text-white">{topTitle}</h2>
             <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
            {POPULAR_COUNTRIES.map((ctry) => (
              <CountryCard key={ctry} ctry={ctry} isPopular={true} />
            ))}
          </div>
        </div>

        {/* SECTION 2: REMAINING ALL COUNTRIES */}
        <div className="mb-24">
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="flex items-center gap-4 mb-8"
          >
             <h2 className="text-3xl font-black text-slate-300">{allTitle}</h2>
             <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REMAINING_COUNTRIES.map((ctry) => (
              <CountryCard key={ctry} ctry={ctry} isPopular={false} />
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
