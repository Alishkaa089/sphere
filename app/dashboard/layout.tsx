"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Building, Car, CalendarCheck, LogOut, Settings, Menu, X, Home, UserCircle, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
     if (localStorage.getItem("userRole") !== "admin") {
         window.location.href = "/login";
     }
  }, []);

  // Close sidebar on path change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPlan");
    localStorage.removeItem("userAvatar");
    window.dispatchEvent(new Event("roleChanged"));
    window.location.href = "/";
  };

  const menu = [
    { label: t.side_dashboard, icon: <LayoutDashboard className="w-5 h-5" />, href: "/dashboard" },
    { label: t.side_users, icon: <Users className="w-5 h-5" />, href: "/dashboard/users" },
    { label: "Partnerships", icon: <Building className="w-5 h-5" />, href: "/dashboard/partnerships" },
    { label: t.side_properties, icon: <Building className="w-5 h-5" />, href: "/dashboard/properties" },
    { label: t.side_transports, icon: <Car className="w-5 h-5" />, href: "/dashboard/transports" },
    { label: t.side_orders, icon: <CalendarCheck className="w-5 h-5" />, href: "/dashboard/orders" },
    { label: "Applications", icon: <Briefcase className="w-5 h-5" />, href: "/dashboard/applications" },
    { label: t.side_settings, icon: <Settings className="w-5 h-5" />, href: "/dashboard/settings" },
  ];

  const userLinks = [
    { label: t.side_home, icon: <Home className="w-5 h-5" />, href: "/" },
    { label: t.side_profile, icon: <UserCircle className="w-5 h-5" />, href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a09] flex text-white font-sans overflow-hidden relative">
      
      {/* Abstract Background for Layout */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0a0a09]/80 backdrop-blur-xl border-b border-white/5 z-[100] flex items-center justify-between px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
           <span className="text-xl font-black tracking-tighter text-white">Admin<span className="text-red-500">.</span></span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors focus:ring-2 focus:ring-red-500/50 outline-none"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[50]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-[#0a0a09] lg:bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col z-[110] transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 border-b border-white/5 hidden lg:block">
           <Link href="/dashboard" className="flex flex-col">
              <span className="text-sm font-bold text-red-500 uppercase tracking-widest mb-1">Valorum OS</span>
              <span className="text-3xl font-black tracking-tighter text-white">Admin<span className="text-red-500">.</span></span>
           </Link>
        </div>

        <nav className="flex-1 py-10 lg:py-8 px-4 flex flex-col gap-2 overflow-y-auto mt-16 lg:mt-0">
           {menu.map((item) => (
             <Link 
               key={item.label} 
               href={item.href}
               className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${pathname === item.href ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
             >
               {item.icon} {item.label}
             </Link>
           ))}

           <div className="mt-8 mb-4 px-4">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 px-2">{t.side_user_view}</span>
           </div>

           {userLinks.map((item) => (
             <Link 
               key={item.label} 
               href={item.href}
               className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all"
             >
               {item.icon} {item.label}
             </Link>
           ))}
        </nav>

        <div className="p-6 border-t border-white/5 pb-8">
           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 font-bold transition-all"
           >
             <LogOut className="w-5 h-5" /> {t.side_logout}
           </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 relative z-10 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
