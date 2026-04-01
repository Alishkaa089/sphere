"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Globe, ArrowUpRight, Plane, Building2, Car, Star, Search, X } from "lucide-react";
import Link from "next/link";
import Footer from "@/components/common/Footer";
import { UNIQUE_COUNTRIES, COUNTRY_CITIES, COUNTRY_FLAGS } from "@/constants/countries";
import { useLanguage } from "@/context/LanguageContext";

export default function CountriesPage() {
  const { t, lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const getTranslatedCountry = (enName: string) => {
    const dict: any = {
      "USA": { en: "United States", az: "United States", ru: "Соединенные Штаты" },
      "UK": { en: "United Kingdom", az: "United Kingdom", ru: "Соединенное Королевство" },
      "France": { en: "France", az: "Fransa", ru: "Франция" },
      "Switzerland": { en: "Switzerland", az: "İsveçrə", ru: "Швейцария" },
      "Italy": { en: "Italy", az: "İtaliya", ru: "Италия" },
      "Monaco": { en: "Monaco", az: "Monako", ru: "Монако" },
      "UAE": { en: "United Arab Emirates", az: "BƏƏ", ru: "ОАЭ" },
      "Japan": { en: "Japan", az: "Yaponiya", ru: "Япония" },
      "Germany": { en: "Germany", az: "Almaniya", ru: "Германия" },
      "Spain": { en: "Spain", az: "İspaniya", ru: "Испания" },
    };
    if (dict[enName]) return dict[enName][lang] || enName;
    return enName;
  };

  const getCountryAbbreviation = (enName: string) => {
    const abbreviations: Record<string, string> = {
      "USA": "US",
      "Germany": "DE", 
      "Australia": "AU",
      "Austria": "AT",
      "Andorra": "AD",
      "Azerbaijan": "AZ",
      "Morocco": "MA",
      "UAE": "AE",
      "UK": "GB",
      "Belgium": "BE",
      "Bulgaria": "BG",
      "Brazil": "BR",
      "South_Africa": "ZA",
      "South_Korea": "KR",
      "Denmark": "DK",
      "Estonia": "EE",
      "Finland": "FI",
      "France": "FR",
      "Georgia": "GE",
      "India": "IN",
      "Croatia": "HR",
      "Indonesia": "ID",
      "Iraq": "IQ",
      "Ireland": "IE",
      "Iceland": "IS",
      "Spain": "ES",
      "Israel": "IL",
      "Sweden": "SE",
      "Switzerland": "CH",
      "Italy": "IT",
      "Cyprus": "CY",
      "Canada": "CA",
      "Colombia": "CO",
      "Lithuania": "LT",
      "Latvia": "LV",
      "Hungary": "HU",
      "Malaysia": "MY",
      "Mexico": "MX",
      "Egypt": "EG",
      "Netherlands": "NL",
      "Norway": "NO",
      "Poland": "PL",
      "Portugal": "PT",
      "Romania": "RO",
      "Slovakia": "SK",
      "Slovenia": "SI",
      "Thailand": "TH",
      "Turkey": "TR",
      "Vietnam": "VN",
      "Japan": "JP",
      "Greece": "GR",
      "Czech_Republic": "CZ",
      "China": "CN",
      "Monaco": "MC"
    };
    return abbreviations[enName] || enName.substring(0, 2).toUpperCase();
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

  const POPULAR_COUNTRIES_LIST = ["USA", "UAE", "Germany", "Switzerland"];
  
  const filteredPopular = useMemo(() => {
    return POPULAR_COUNTRIES_LIST.filter(ctry => {
      const translated = getTranslatedCountry(ctry).toLowerCase();
      const enName = ctry.toLowerCase();
      const cities = (COUNTRY_CITIES[ctry] || []).join(" ").toLowerCase();
      const query = searchQuery.toLowerCase();
      return translated.includes(query) || enName.includes(query) || cities.includes(query);
    });
  }, [searchQuery, lang]);

  const filteredRemaining = useMemo(() => {
    return UNIQUE_COUNTRIES.filter(ctry => !POPULAR_COUNTRIES_LIST.includes(ctry)).filter(ctry => {
      const translated = getTranslatedCountry(ctry).toLowerCase();
      const enName = ctry.toLowerCase();
      const cities = (COUNTRY_CITIES[ctry] || []).join(" ").toLowerCase();
      const query = searchQuery.toLowerCase();
      return translated.includes(query) || enName.includes(query) || cities.includes(query);
    });
  }, [searchQuery, lang]);

  // Render Component for Country Cards
  const CountryCard = ({ ctry, isPopular = false }: { ctry: string, isPopular?: boolean }) => (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/countries/${ctry}`} className={`block group relative overflow-hidden rounded-[2rem] transition-all h-full flex flex-col cursor-pointer transform hover:scale-[1.02] ${
        isPopular 
          ? "bg-zinc-900/40 border-2 border-[#006B8A]/30 shadow-2xl shadow-[#006B8A]/20 hover:shadow-[#006B8A]/40" 
          : "bg-zinc-900/40 border border-white/5 hover:border-[#006B8A]/30 hover:shadow-xl hover:shadow-[#004E64]/20"
      }`}>
        
        {/* Premium Glow Effect for Popular Countries */}
        {isPopular && (
          <div className="absolute inset-0 bg-gradient-to-r from-[#006B8A]/10 via-transparent to-[#006B8A]/10 pointer-events-none" />
        )}

        {/* Country Flag Background */}
        <div className="absolute top-3 right-3 opacity-10 select-none blur-sm">
          {isPopular ? (
            COUNTRY_FLAGS[ctry].startsWith('/flags') ? (
              <img src={COUNTRY_FLAGS[ctry]} alt={`${ctry} flag`} className="w-16 h-16" />
            ) : (
              <span className="text-7xl">{COUNTRY_FLAGS[ctry] || "🌍"}</span>
            )
          ) : (
            <span className="text-7xl font-bold text-white/20">{getCountryAbbreviation(ctry)}</span>
          )}
        </div>
        
        <div className="relative p-8 flex flex-col h-full">
          {/* Header Content */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all transform group-hover:scale-110 shadow-xl border-2 overflow-hidden ${
                isPopular 
                  ? "bg-gradient-to-br from-[#004E64]/30 to-[#006B8A]/30 border-[#006B8A]/50 shadow-[#006B8A]/30" 
                  : "bg-white/10 border-white/20 shadow-white/10"
              }`}>
                {isPopular ? (
                  COUNTRY_FLAGS[ctry].startsWith('/flags') ? (
                    <img src={COUNTRY_FLAGS[ctry]} alt={`${ctry} flag`} className="w-12 h-12 object-cover" />
                  ) : (
                    <span className="text-4xl drop-shadow-lg">{COUNTRY_FLAGS[ctry] || "🌍"}</span>
                  )
                ) : (
                  <span className="text-2xl font-black text-white">{getCountryAbbreviation(ctry)}</span>
                )}
              </div>
              <div>
                <h2 className={`text-3xl font-black transition-colors mb-2 ${
                  isPopular ? "text-white group-hover:text-[#00A3CC]" : "text-white group-hover:text-[#00A3CC]"
                }`}>
                  {getTranslatedCountry(ctry)}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                    isPopular 
                      ? "bg-[#006B8A]/20 text-white border border-[#006B8A]/30" 
                      : "bg-white/10 text-slate-300 border border-white/20"
                  }`}>
                    {isPopular ? (lang === 'az' ? 'PREMİUM' : lang === 'ru' ? 'ПРЕМИУМ' : 'PREMIUM') : (t.cat_loc_badge || "Geography")}
                  </span>
                  {isPopular && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                </div>
              </div>
            </div>
          </div>

          {/* Cities Section */}
          <div className="flex-grow">
            <div className="flex flex-wrap gap-2 mb-8">
              {(COUNTRY_CITIES[ctry] || []).map((city: string) => (
                <span key={city} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isPopular 
                    ? "bg-[#006B8A]/10 border border-[#006B8A]/20 text-[#7FD4E8] hover:bg-[#004E64]/20 hover:border-[#00A3CC]/30" 
                    : "bg-black/60 border border-white/5 text-slate-300 hover:border-[#006B8A]/20"
                }`}>
                  {getTranslatedCity(city)}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Interactive Section */}
          <div className={`pt-6 border-t flex items-center justify-between transition-colors ${
            isPopular ? "border-[#006B8A]/20" : "border-white/5"
          }`}>
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-slate-800 flex items-center justify-center z-20">
                <Building2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-500/20 border-2 border-slate-800 flex items-center justify-center z-10">
                <Car className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className={`flex items-center gap-2 text-sm font-bold transition-colors ${
              isPopular ? "text-[#00A3CC] group-hover:text-white" : "text-slate-400 group-hover:text-[#00A3CC]"
            }`}>
              <span className="hidden sm:inline">
                {lang === 'az' ? 'Kataloqa Göz At' : lang === 'ru' ? 'Посмотреть Каталог' : 'Explore Catalog'}
              </span> 
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a09] text-white flex flex-col relative overflow-hidden">

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <motion.div 
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="absolute inset-0 z-0"
        >
          <img 
            src="/countries_hero.png" 
            alt="Global Locations Background" 
            sizes="(max-width: 100vw)"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0a0a09]" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-1.5 border border-white/10 rounded-full shadow-2xl"
          >
            <Globe className="w-3.5 h-3.5 text-[#00A3CC]" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-white/80">{t.cat_loc_badge || "Global Network"}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter"
            style={{ fontFamily: "'Grailga', serif" }}
          >
            {t.cat_loc_title || "Global Locations"}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed opacity-90"
          >
            {t.cat_loc_desc || "Discover our premium luxury networks across the world's most exclusive destinations."}
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex-grow relative">
        
        {/* Dark Background Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#004E64]/5 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#002B38]/5 rounded-full blur-[250px] pointer-events-none" />
        <div className="absolute top-[40%] right-[10%] w-[400px] h-[400px] bg-[#006B8A]/3 rounded-full blur-[150px] pointer-events-none" />

        {/* ── SEARCH BAR ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mb-24 relative z-10"
        >
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-500 group-focus-within:text-[#00A3CC] transition-colors" />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'az' ? 'Ölkə və ya şəhər axtar...' : lang === 'ru' ? 'Поиск страны или города...' : 'Search country or city...'}
              className="block w-full pl-16 pr-14 py-6 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#006B8A]/50 focus:border-[#006B8A]/50 transition-all font-bold text-lg shadow-xl"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-500 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {/* SECTION 1: TOP/POPULAR COUNTRIES */}
          {filteredPopular.length > 0 && (
            <motion.div 
              key="popular-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-24 relative z-10"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 mb-12"
              >
                <div className="flex items-center gap-3">
                  <Star className="w-6 h-6 text-[#00A3CC] fill-[#00A3CC]" />
                  <h2 className="text-4xl font-black text-[#00A3CC]" style={{ fontFamily: "'Grailga', serif" }}>{topTitle}</h2>
                </div>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-[#006B8A]/30 to-transparent" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPopular.map((ctry) => (
                  <CountryCard key={ctry} ctry={ctry} isPopular={true} />
                ))}
              </div>
            </motion.div>
          )}

          {/* SECTION 2: REMAINING ALL COUNTRIES */}
          {filteredRemaining.length > 0 && (
            <motion.div 
              key="remaining-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-32 relative z-10"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 mb-12"
              >
                <Globe className="w-6 h-6 text-slate-400" />
                <h2 className="text-4xl font-black text-slate-300" style={{ fontFamily: "'Grailga', serif" }}>{allTitle}</h2>
                <div className="h-[1px] flex-grow bg-gradient-to-r from-white/10 to-transparent" />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRemaining.map((ctry) => (
                  <CountryCard key={ctry} ctry={ctry} isPopular={false} />
                ))}
              </div>
            </motion.div>
          )}

          {filteredPopular.length === 0 && filteredRemaining.length === 0 && (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 flex flex-col items-center justify-center text-center relative z-10"
            >
              <div className="w-24 h-24 rounded-3xl bg-zinc-900/50 border border-white/5 flex items-center justify-center mb-8">
                <Globe className="w-12 h-12 text-slate-600 animate-pulse" />
              </div>
              <h3 className="text-4xl font-black text-white mb-4">
                {lang === 'az' ? 'Nəticə tapılmadı' : lang === 'ru' ? 'Результатов не найдено' : 'No results found'}
              </h3>
              <p className="text-slate-500 font-medium text-xl max-w-md">
                {lang === 'az' ? `"${searchQuery}" üçün heç bir ölkə tapılmadı.` : lang === 'ru' ? `Страна "${searchQuery}" не найдена.` : `No country found for "${searchQuery}".`}
              </p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-10 px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
              >
                {t.reset_filters || "Reset filters"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </div>
  );
}
