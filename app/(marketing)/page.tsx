"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Search, MapPin, Star, ShieldCheck, Globe, Car, Building2, Flame } from "lucide-react";
import Footer from "@/components/common/Footer";
import { UNIQUE_COUNTRIES } from "@/constants/countries";
import { getProperties, getVehicles } from "@/lib/actions";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [featuredVehicles, setFeaturedVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const props = await getProperties();
      const vhs = await getVehicles();
      
      setFeaturedProperties(props.filter((p: any) => p.status === "Satış").slice(0, 3));
      setFeaturedVehicles(vhs.filter((v: any) => v.price > 300000).slice(0, 3));
      setLoading(false);
    };
    fetchData();
  }, []);
  
  return (
    <div className="min-h-screen bg-[#0a0a09] text-white flex flex-col relative overflow-hidden">

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="absolute inset-0 z-0"
        >
          <img 
            src="/home_hero_bg.png" 
            alt="Hero Background" 
            sizes="(max-w-width: 100vw)"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#0a0a09]" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 md:mb-6 flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-1.5 border border-white/10 rounded-full shadow-2xl"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-white/80">{t.home_badge}</span>
          </motion.div>

          {/* Stylized Heading - REDUCED SIZE FOR BALANCED FIT */}
          <div className="flex flex-col items-center mb-6 md:mb-8 select-none cursor-default">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold leading-[1] text-white tracking-tighter"
              style={{ fontFamily: "'NimSerif', serif" }}
            >
              {t.home_title_1}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold leading-[1] text-[#1D8EAD] tracking-tighter"
              style={{ fontFamily: "'NimSerif', serif" }}
            >
              {t.home_title_2}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-bold leading-[1] text-white tracking-tighter"
              style={{ fontFamily: "'NimSerif', serif" }}
            >
              {t.home_title_3}
            </motion.div>

          </div>
          
          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-300 max-w-2xl font-medium mb-12 opacity-80"
          >
            {t.home_subtitle}
          </motion.p>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#004E64]/5 blur-[150px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 100 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-center mb-20 relative z-10"
        >
          <div className="text-[#006B8A] font-bold tracking-widest uppercase mb-4 text-sm flex items-center justify-center gap-2">
            <Globe className="w-5 h-5" /> {t.home_world}
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6" style={{ fontFamily: "'Grailga', serif" }}>{t.home_world_title}</h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            {t.home_world_desc}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 relative z-10">
          {UNIQUE_COUNTRIES.slice(0, 12).map((ctry, i) => (
            <motion.div 
              key={ctry}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: false, amount: 0.1 }}
            >
              <Link href="/countries" className="group flex flex-col items-center justify-center bg-zinc-900/40 hover:bg-zinc-800/80 backdrop-blur-sm border border-white/5 hover:border-[#006B8A]/50 p-6 rounded-3xl transition-all duration-300">
                <MapPin className="w-8 h-8 text-slate-500 mb-3 group-hover:text-[#00A3CC] transition-colors" />
                <span className="font-bold text-slate-300 group-hover:text-white transition-colors">{ctry}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-32 bg-zinc-900/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -100 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-end mb-16"
          >
            <div>
              <div className="text-emerald-500 font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                 <Building2 className="w-5 h-5" /> {t.home_feat_prop_badge}
              </div>
              <h2 className="text-4xl md:text-6xl font-black max-w-xl leading-tight" style={{ fontFamily: "'Grailga', serif" }}>{t.home_feat_prop_title}</h2>
            </div>
            <Link href="/property" className="flex items-center gap-2 text-white font-bold hover:text-emerald-400 transition-colors mt-6 md:mt-0">
              {t.home_btn_catalog} <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {loading ? (
             <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00A3CC]"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProperties.map((p, i) => (
                <motion.div 
                  key={p.id}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -100 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <Link href={`/property/${p.id}`} className="group block bg-black border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-colors">
                    <div className="relative h-64 overflow-hidden">
                      <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white font-bold px-3 py-1.5 rounded-full border border-white/10 text-xs">
                        {t.home_sale}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black mb-2 truncate group-hover:text-emerald-400 transition-colors">{p.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4"/> {p.city}, {p.country}
                      </p>
                      <div className="flex justify-between items-end border-t border-white/10 pt-4">
                        <div className="text-2xl font-black text-white">${p.price.toLocaleString()}</div>
                        <div className="flex items-center gap-1 text-sm font-bold text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {p.rating}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Featured Transport */}
      <section className="py-32 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#002B38]/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: -100 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-end mb-16"
          >
            <div>
              <div className="text-[#00A3CC] font-bold tracking-widest uppercase mb-4 text-sm flex items-center gap-2">
                 <Car className="w-5 h-5" /> {t.home_feat_trans_badge}
              </div>
              <h2 className="text-4xl md:text-6xl font-black max-w-xl leading-tight" style={{ fontFamily: "'Grailga', serif" }}>{t.home_feat_trans_title}</h2>
            </div>
            <Link href="/transport" className="flex items-center gap-2 text-white font-bold hover:text-[#00A3CC] transition-colors mt-6 md:mt-0">
              {t.home_btn_catalog} <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {loading ? (
             <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00A3CC]"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredVehicles.map((v, i) => (
                <motion.div 
                  key={v.id}
                  initial={{ opacity: 0, scale: 0.8, x: i % 2 === 0 ? '-50px' : '50px' }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: i % 2 === 0 ? '-50px' : '50px' }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <Link href={`/transport/${v.id}`} className="group block bg-black border border-white/10 rounded-3xl overflow-hidden hover:border-[#006B8A]/50 transition-colors relative">
                    <div className="relative h-72 overflow-hidden">
                      <img src={v.img} alt={v.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-xl font-black truncate group-hover:text-[#00A3CC] transition-colors">{v.title}</h3>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-slate-400 text-sm flex items-center gap-1.5 font-bold">
                          <MapPin className="w-4 h-4"/> {v.city}
                        </p>
                        <div className="text-2xl font-black text-white">${v.price.toLocaleString()}</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Trust & Verification */}
      <section className="py-32 bg-[#002B38]/10 border-t border-white/5 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div 
               initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
               whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
               exit={{ opacity: 0, scale: 1.5 }}
               transition={{ duration: 0.8, type: "spring" }}
               viewport={{ once: false, amount: 0.6 }}
               className="w-24 h-24 mx-auto bg-[#004E64] rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-[#004E64]/50"
            >
              <ShieldCheck className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h2 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -50 }}
               transition={{ duration: 0.5 }}
               viewport={{ once: false, amount: 0.6 }}
               className="text-4xl md:text-5xl font-black mb-6"
               style={{ fontFamily: "'Grailga', serif" }}
            >
              {t.home_trust_title}
            </motion.h2>
            <motion.p 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -50 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               viewport={{ once: false, amount: 0.6 }}
               className="text-xl text-slate-400 font-medium"
            >
               {t.home_trust_desc}
            </motion.p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
