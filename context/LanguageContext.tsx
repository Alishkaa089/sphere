"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { en } from "../locales/en";
import { az } from "../locales/az";
import { ru } from "../locales/ru";
import { motion, AnimatePresence } from "framer-motion";

type Language = "en" | "az" | "ru";
type Dictionary = typeof en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
  isChanging: boolean;
}

const dictionaries = { en, az, ru };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>("en"); 
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [targetLang, setTargetLang] = useState<Language | null>(null);
  const router = useRouter();

  useEffect(() => {
    
    const saved = localStorage.getItem("Valorum_lang") as Language;
    if (saved && dictionaries[saved]) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    if (newLang === lang) return;

    setIsChanging(true);
    setTargetLang(newLang);
    
    setTimeout(() => {
      setLangState(newLang);
      localStorage.setItem("Valorum_lang", newLang);
      router.push("/"); 
      
      setTimeout(() => {
        setIsChanging(false);
        setTargetLang(null);
      }, 1000);
    }, 800);
  };

  const t = dictionaries[lang] || en;

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: "en", setLang, t: en, isChanging: false }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isChanging }}>
      <AnimatePresence mode="wait">
        {isChanging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#0a0a09] flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ 
                scale: [0.8, 1.1, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,107,138,0.3)] border border-white/10 mb-8"
            >
              <img src="/valorum-logo.png" alt="Valorum" className="w-full h-full object-cover" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
              <h2 className="text-white text-2xl font-black uppercase tracking-[0.2em] text-center">
                {targetLang === 'en' ? 'ENGLISH' : targetLang === 'az' ? 'AZƏRBAYCAN' : 'РУССКИЙ'}
              </h2>
              <div className="h-[2px] w-12 bg-[#006B8A] rounded-full" />
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                {targetLang === 'az' ? 'DİL DƏYİŞDİRİLİR...' : targetLang === 'ru' ? 'СМЕНА ЯЗЫКА...' : 'CHANGING LANGUAGE...'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
