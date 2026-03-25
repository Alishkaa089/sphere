"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLanguage();

  const NAV_LINKS = [
    { label: t.nav_home, href: "/" },
    { label: t.nav_property, href: "/property" },
    { label: t.nav_transport, href: "/transport" },
    { label: t.nav_countries, href: "/countries" },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("userLoggedIn") === "true");
    setIsSeller(localStorage.getItem("userRole") === "seller");
    setIsAdmin(localStorage.getItem("userRole") === "admin");
    
    const storedAv = localStorage.getItem("userAvatar");
    if (storedAv) setAvatarUrl(storedAv);

    const handleStorageSync = () => {
      const updatedAv = localStorage.getItem("userAvatar");
      if (updatedAv) setAvatarUrl(updatedAv);
      setIsSeller(localStorage.getItem("userRole") === "seller");
      setIsAdmin(localStorage.getItem("userRole") === "admin");
    };
    window.addEventListener("avatarChanged", handleStorageSync);
    window.addEventListener("roleChanged", handleStorageSync);
    
    return () => {
       window.removeEventListener("avatarChanged", handleStorageSync);
       window.removeEventListener("roleChanged", handleStorageSync);
    };
  }, [pathname]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock Body Scroll when Navbar Open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset"; // Cleanup
    };
  }, [isOpen]);

  // Hide Navbar completely on admin and auth routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  // Animation variants
  const desktopMenuVariants = {
    closed: {
      clipPath: "circle(0px at 100vw 0px)",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      clipPath: "circle(150vw at 100vw 0px)",
      transition: {
        type: "spring" as const,
        stiffness: 20,
        restDelta: 2,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const mobileMenuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    closed: { x: 50, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[130] px-6 md:px-12 py-6 flex justify-between items-center pointer-events-none">
        {/* Left Logo */}
        <div className="pointer-events-auto">
          <Link href="/" className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-2xl shadow-blue-500/30"
            >
              S
            </motion.div>
            <motion.span 
              className={`text-2xl font-black tracking-tighter transition-colors duration-500 text-white`}
            >
              Sphere
            </motion.span>
          </Link>
        </div>
        {/* Right Hamburger Button ONLY */}
        <div className="pointer-events-auto flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 flex flex-col items-center justify-center gap-[5px] text-white hover:bg-white/20 transition-all focus:outline-none shadow-2xl relative z-[140]"
          >
            <motion.span 
              animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] bg-white rounded-full block transition-transform"
            />
            <motion.span 
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-[2px] bg-white rounded-full block transition-opacity"
            />
            <motion.span 
              animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="w-6 h-[2px] bg-white rounded-full block transition-transform"
            />
          </button>
        </div>
      </nav>

      {/* Full Screen Interactive Splash Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={isMobile ? mobileMenuVariants : desktopMenuVariants}
            className={`fixed inset-0 z-[120] bg-[#0a0a09]/98 backdrop-blur-3xl flex flex-col ${isMobile ? 'justify-start py-28 pr-6 pl-12 sm:pl-20' : 'justify-start py-20 px-6 sm:px-12 md:px-24'} overflow-y-auto`}
          >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex flex-col lg:flex-row justify-between w-full max-w-7xl mx-auto items-start lg:items-center gap-12 lg:gap-10 relative z-10 pb-12">
              
              {/* Massive Main Links */}
              <div className="flex flex-col gap-3 sm:gap-4 w-full lg:flex-1">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div key={link.href} variants={itemVariants} className="overflow-hidden py-1">
                      <Link 
                        href={link.href}
                        className="group flex flex-col items-start focus:outline-none"
                      >
                        <span className="text-sm font-bold text-slate-500 mb-1 tracking-widest uppercase flex items-center gap-4">
                          0{i + 1}
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={isActive ? { width: 40 } : { width: 0 }} 
                            className="h-[2px] bg-blue-500 inline-block transition-all duration-300 group-hover:bg-indigo-500" 
                          />
                        </span>
                        <div className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter transition-colors duration-500 ${isActive ? 'text-white' : 'text-slate-700 hover:text-white'}`}>
                          {link.label}
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}

                {/* Conditional Seller Menu */}
                {isSeller && (
                    <motion.div variants={itemVariants} className="overflow-hidden py-1 mt-6 border-t border-white/10 pt-6">
                      <Link href="/seller" className="group flex flex-col items-start focus:outline-none">
                        <span className="text-sm font-bold text-amber-500 mb-1 tracking-widest uppercase flex items-center gap-4">
                          S <motion.div initial={{ width: 0 }} animate={pathname === "/seller" ? { width: 40 } : { width: 0 }} className="h-[2px] bg-amber-500 inline-block transition-all duration-300 group-hover:bg-amber-400" />
                        </span>
                        <div className={`text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter transition-colors duration-500 ${pathname === '/seller' ? 'text-amber-400' : 'text-amber-600 hover:text-amber-400'}`}>
                          {lang === 'az' ? 'Satıcı Paneli' : lang === 'ru' ? 'Панель Продавца' : 'Seller Panel'}
                        </div>
                      </Link>
                    </motion.div>
                )}
                
                {/* Admin Panel Link */}
                {isAdmin && (
                    <motion.div variants={itemVariants} className="overflow-hidden py-1 mt-6 border-t border-white/10 pt-6">
                      <Link href="/dashboard" className="group flex flex-col items-start focus:outline-none">
                        <span className="text-sm font-bold text-red-500 mb-1 tracking-widest uppercase flex items-center gap-4">
                          A <motion.div initial={{ width: 0 }} animate={pathname.startsWith("/dashboard") ? { width: 40 } : { width: 0 }} className="h-[2px] bg-red-500 inline-block transition-all duration-300 group-hover:bg-red-400" />
                        </span>
                        <div className={`text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter transition-colors duration-500 ${pathname.startsWith('/dashboard') ? 'text-red-400' : 'text-red-600 hover:text-red-400'}`}>
                          {lang === 'az' ? 'Admin Paneli' : lang === 'ru' ? 'Панель Админа' : 'Admin Panel'}
                        </div>
                      </Link>
                    </motion.div>
                )}
              </div>

              {/* Dynamic Auth / Identity Panel */}
              <motion.div variants={itemVariants} className="w-full lg:w-96 flex flex-col gap-8 items-start lg:items-end text-left lg:text-right">
                
                <h3 className="text-xl font-bold text-white mb-2">{t.nav_platform_access}</h3>
                
                {isLoggedIn ? (
                  <div className="flex flex-col gap-6 w-full lg:items-end">
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 w-full lg:w-max group">
                      <div className="text-right flex-1">
                        <div className="text-sm font-bold text-slate-400">{t.nav_sphere_user}</div>
                        <div className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">{t.nav_verified_account}</div>
                      </div>
                      <Link href="/profile" className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 relative">
                        <img src={avatarUrl} alt="Your Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <ArrowUpRight className="w-6 h-6 text-white" />
                        </div>
                      </Link>
                    </div>

                    <div className="flex flex-col w-full gap-3">
                       <Link onClick={() => setIsOpen(false)} href="/profile" className="w-full lg:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg transition-colors flex items-center lg:justify-end justify-center gap-2">
                         {t.nav_dashboard} <ArrowUpRight className="w-5 h-5" />
                       </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col w-full gap-4">
                    <p className="text-slate-400 font-medium mb-4 w-full lg:max-w-[250px]">
                      {t.nav_login_prompt}
                    </p>
                    <Link onClick={() => setIsOpen(false)} href="/register" className="w-full lg:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg text-center transition-all shadow-xl shadow-blue-600/20">
                      {t.nav_free_register}
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/login" className="w-full lg:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-black text-lg text-center transition-all">
                      {t.nav_login}
                    </Link>
                  </div>
                )}
                
                {/* Persistent In-Menu Language Switcher */}
                <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-2 mt-4 w-full justify-between">
                   <div className="text-xs font-bold text-slate-500 px-4 uppercase flex items-center gap-2"><Globe className="w-4 h-4"/> {t.nav_lang || "DİL"}</div>
                   <div className="flex gap-2">
                     <button onClick={() => setLang("en")} className={`px-4 py-2 rounded-full text-xs font-black transition-all ${lang === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>EN</button>
                     <button onClick={() => setLang("az")} className={`px-4 py-2 rounded-full text-xs font-black transition-all ${lang === 'az' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>AZ</button>
                     <button onClick={() => setLang("ru")} className={`px-4 py-2 rounded-full text-xs font-black transition-all ${lang === 'ru' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>RU</button>
                   </div>
                </div>

              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
