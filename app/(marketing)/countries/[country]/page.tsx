"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Gauge, ShieldPlus, Battery, Star, Car, Globe, Building2, BedDouble, Bath, Square } from "lucide-react";
import { getProperties, getVehicles } from "@/lib/actions";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function CountryPortfolioPage({ params }: { params: Promise<{ country: string }> }) {
  const unwrappedParams = use(params);
  const countryName = decodeURIComponent(unwrappedParams.country);
  const { t, lang } = useLanguage();
  const [mixedPortfolio, setMixedPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const allProps = await getProperties();
      const allVehicles = await getVehicles();
      
      const properties = allProps.filter((p: any) => p.country === countryName);
      const vehicles = allVehicles.filter((v: any) => v.country === countryName);

      const mixed = [
        ...properties.map((p: any) => ({ ...p, type: 'property' })),
        ...vehicles.map((v: any) => ({ ...v, type: 'transport' }))
      ].sort(() => Math.random() - 0.5);
      
      setMixedPortfolio(mixed);
      setLoading(false);
    };
    fetchData();
  }, [countryName]);

  const getTranslatedCountry = (enName: string) => {
    const dict: any = {
      "USA": { en: "United States", az: "ABŞ", ru: "США" },
      "UK": { en: "United Kingdom", az: "Böyük Britaniya", ru: "Великобритания" },
      "France": { en: "France", az: "Fransa", ru: "Франция" },
      "Switzerland": { en: "Switzerland", az: "İsveçrə", ru: "Швейцария" },
      "Italy": { en: "Italy", az: "İtaliya", ru: "İtaliya" },
      "Monaco": { en: "Monaco", az: "Monako", ru: "Monako" },
      "UAE": { en: "UAE", az: "BƏƏ (Dubay)", ru: "ОАЭ" },
      "Japan": { en: "Japan", az: "Yaponiya", ru: "Yaponiya" },
      "Germany": { en: "Germany", az: "Almaniya", ru: "Almaniya" },
      "Spain": { en: "Spain", az: "İspaniya", ru: "İspaniya" },
    };
    if (dict[enName]) return dict[enName][lang] || enName;
    return enName;
  };

  const isSale = (status: string) => status === "Satış" || status === "Sale";

  return (
    <div className="min-h-screen bg-[#0a0a09] text-white pt-24 pb-12 flex flex-col relative overflow-hidden">
      
      {/* Immersive Dark Background Lights */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#004E64]/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-[#004E64]/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header with Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow relative z-10">
        
        <div className="flex items-center gap-6 mb-12">
            <Link href="/countries" className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all focus:outline-none shadow-2xl group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[#006B8A] font-bold tracking-widest uppercase mb-1 text-xs flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" /> Valorum Portfolio
                </motion.div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-black text-white tracking-tighter"
                >
                  {getTranslatedCountry(countryName)}
                </motion.h1>
            </div>
        </div>

        {loading ? (
             <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00A3CC]"></div></div>
        ) : mixedPortfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-24">
            {mixedPortfolio.map((item: any, i) => {
              
              if (item.type === 'property') {
                  const propStatusLocale = isSale(item.status) ? (t.for_sale || "Satış") : (t.for_rent || "İcarə");
                  return (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                    >
                        <Link href={`/property/${item.id}`} className="group relative block bg-[#0f0f0e] border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-all shadow-xl hover:shadow-emerald-500/10 h-full flex flex-col">
                        
                            <div className="relative h-56 overflow-hidden">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0e] via-transparent to-transparent opacity-90" />
                                
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                   <div className={`backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg ${isSale(item.status) ? 'bg-emerald-500/80' : 'bg-[#006B8A]/80'}`}>
                                     {propStatusLocale}
                                   </div>
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                                    <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-sm mb-1 drop-shadow-md">
                                      <Building2 className="w-3.5 h-3.5" />
                                      {item.city}
                                    </div>
                                    <h3 className="text-xl font-black drop-shadow-md truncate">{item.title}</h3>
                                </div>
                            </div>

                            <div className="p-5 flex-grow flex flex-col justify-between bg-gradient-to-b from-transparent to-black/40">
                                <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">
                                   <span className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-slate-300" /> {item.beds}</span>
                                   <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-slate-300" /> {item.baths}</span>
                                   <span className="flex items-center gap-1.5 text-amber-400 ml-auto"><Star className="w-4 h-4 fill-amber-400" /> {item.rating || "5.0"}</span>
                                </div>
                                
                                <div className="flex items-end justify-between border-t border-white/5 pt-4">
                                  <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                                        {isSale(item.status) ? (t.sale_price || "Sale Price") : (t.monthly_rent || "Monthly Rent")}
                                    </p>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-2xl font-black text-white">${item.price.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                  );
              }

              // TRANSPORT CARD
              const isVehicleSale = isSale(item.status);
              const transStatusLocale = isVehicleSale ? (t.for_sale || "Satış") : (t.for_rent || "İcarə");
              return (
                <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                    <Link href={`/transport/${item.id}`} className="group relative block bg-[#0f0f0e] border border-white/5 rounded-3xl overflow-hidden hover:border-[#006B8A]/50 transition-all shadow-xl hover:shadow-[#006B8A]/10 h-full flex flex-col">
                      
                      <div className="relative h-56 overflow-hidden">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0e] via-transparent to-transparent opacity-90" />
                        
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                           <div className={`backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg ${isVehicleSale ? 'bg-emerald-500/80' : 'bg-purple-500/80'}`}>
                             {transStatusLocale}
                           </div>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                            <div className="flex items-center gap-1.5 text-[#7FD4E8] font-bold text-sm mb-1 drop-shadow-md">
                              <Car className="w-3.5 h-3.5" />
                              {item.city}
                            </div>
                            <h3 className="text-xl font-black drop-shadow-md truncate">{item.title}</h3>
                        </div>
                      </div>

                      <div className="p-5 flex-grow flex flex-col justify-between bg-gradient-to-b from-transparent to-black/40">
                        <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">
                           <span className="flex items-center gap-1.5"><Gauge className="w-4 h-4 text-slate-300" /> {item.range}km</span>
                           <span className="flex items-center gap-1.5"><Battery className="w-4 h-4 text-slate-300" /> {item.battery}%</span>
                           <span className="flex items-center gap-1.5 text-amber-400 ml-auto"><Star className="w-4 h-4 fill-amber-400" /> {item.rating || "5.0"}</span>
                        </div>
                        
                        <div className="flex items-end justify-between border-t border-white/5 pt-4">
                          <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">
                              {isVehicleSale ? (t.val_trans_price || "Vehicle Price") : (t.val_rent_price || "Daily Rent")}
                            </p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-white">${item.price.toLocaleString()}</span>
                              {!isVehicleSale && <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">/ {t.word_day || "day"}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                </motion.div>
              );

            })}
          </div>
        ) : (
          <div className="py-20 text-center flex flex-col items-center justify-center bg-zinc-900/30 rounded-3xl border border-white/5">
            <Globe className="w-16 h-16 text-slate-600 mb-4 opacity-50" />
            <h3 className="text-2xl font-bold text-white mb-2">{t.no_property_found_title || "Tapılmadı"}</h3>
            <p className="text-slate-400 max-w-sm">{t.no_property_found_description || "Bu ölkədə məlumat yoxdur."}</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
