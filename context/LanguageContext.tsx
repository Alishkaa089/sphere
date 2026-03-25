"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "../locales/en";
import { az } from "../locales/az";
import { ru } from "../locales/ru";

type Language = "en" | "az" | "ru";
type Dictionary = typeof en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Dictionary;
}

const dictionaries = { en, az, ru };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>("en"); // Demo default is English
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const saved = localStorage.getItem("sphere_lang") as Language;
    if (saved && dictionaries[saved]) {
      setLangState(saved);
    }
    setMounted(true);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("sphere_lang", newLang);
  };

  // Prevent hydration mismatch by rendering nothing until mounted, or render default
  // Actually, rendering default English is fine for hydration if default is English.
  // But to be perfectly safe, we pass 'en' initially.

  const t = dictionaries[lang] || en;

  if (!mounted) {
    return <LanguageContext.Provider value={{ lang: "en", setLang, t: en }}>{children}</LanguageContext.Provider>;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
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
