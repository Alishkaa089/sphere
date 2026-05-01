"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, MapPin, BedDouble, Bath, Square, Star, Car, Trash2, LogIn } from "lucide-react";
import { getUserFavorites, toggleFavorite } from "@/lib/actions";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/context/LanguageContext";

export default function FavoritesPage() {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"all" | "properties" | "vehicles">("all");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
    if (email) fetchFavorites(email);
    else setLoading(false);
  }, []);

  useEffect(() => {
    const handleChange = () => {
      const email = localStorage.getItem("userEmail");
      if (email) fetchFavorites(email);
    };
    window.addEventListener("favoritesChanged", handleChange);
    return () => window.removeEventListener("favoritesChanged", handleChange);
  }, []);

  const fetchFavorites = async (email: string) => {
    setLoading(true);
    try {
      const res = await getUserFavorites(email);
      if (res.success) {
        setProperties((res as any).properties || []);
        setVehicles((res as any).vehicles || []);
        localStorage.setItem("favorites", JSON.stringify((res as any).favoriteIds || []));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string, type: "property" | "vehicle") => {
    if (!userEmail) return;
    setRemovingId(productId);
    try {
      await toggleFavorite(userEmail, productId, type);
      if (type === "property") setProperties((p) => p.filter((x) => x.id !== productId));
      else setVehicles((v) => v.filter((x) => x.id !== productId));
      const stored = localStorage.getItem("favorites");
      const ids: string[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem("favorites", JSON.stringify(ids.filter((id) => id !== productId)));
      window.dispatchEvent(new Event("favoritesChanged"));
    } finally {
      setRemovingId(null);
    }
  };

  const isSale = (status: string) => status === "Satış" || status === "Sale";

  const shownProperties = tab === "vehicles" ? [] : properties;
  const shownVehicles = tab === "properties" ? [] : vehicles;
  const total = properties.length + vehicles.length;

  if (!userEmail && !loading) {
    return (
      <div className="min-h-screen bg-[#0a0a09] flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">{t.fav_title}</h2>
          <p className="text-slate-400 mb-8">{t.fav_login_desc}</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-[#004E64] to-[#00394A] hover:from-[#006B8A] hover:to-[#004E64] text-white shadow-xl transition-all"
          >
            <LogIn className="w-5 h-5" /> {t.fav_login_btn}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a09] flex flex-col">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">

        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-300"
          >
            <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />
            {t.fav_title}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">{t.fav_my_products}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 mt-3 text-lg font-medium"
          >
            {loading ? t.fav_loading : total === 0 ? t.fav_none_selected : `${total} ${t.fav_saved_count}`}
          </motion.p>
        </div>

        {/* Tabs */}
        {!loading && total > 0 && (
          <div className="flex gap-2 mb-8">
            {[
              { key: "all", label: `${t.fav_tab_all} (${total})` },
              { key: "properties", label: `${t.fav_tab_properties} (${properties.length})` },
              { key: "vehicles", label: `${t.fav_tab_vehicles} (${vehicles.length})` },
            ].map((tabItem) => (
              <button
                key={tabItem.key}
                onClick={() => setTab(tabItem.key as any)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  tab === tabItem.key
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                    : "bg-zinc-900 border border-white/10 text-slate-400 hover:text-white"
                }`}
              >
                {tabItem.label}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-zinc-900/50 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : total === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-28 text-center flex flex-col items-center bg-zinc-900/30 rounded-3xl border border-white/5"
          >
            <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 text-red-400/50" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">{t.fav_empty_title}</h3>
            <p className="text-slate-400 mb-8 max-w-sm">{t.fav_empty_desc}</p>
            <div className="flex gap-3 flex-wrap justify-center">
              <Link href="/property" className="px-6 py-3 rounded-2xl font-bold bg-[#004E64] text-white hover:bg-[#006B8A] transition-all">
                {t.fav_view_property}
              </Link>
              <Link href="/transport" className="px-6 py-3 rounded-2xl font-bold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10">
                {t.fav_view_transport}
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-10">
            {/* Properties */}
            <AnimatePresence>
              {shownProperties.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {tab === "all" && (
                    <h2 className="text-lg font-black text-white mb-5 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#00A3CC]" /> {t.fav_section_properties}
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shownProperties.map((prop) => {
                      const pSale = isSale(prop.status);
                      return (
                        <motion.div
                          key={prop.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group relative"
                        >
                          <Link href={`/property/${prop.id}`} className="block">
                            <div className="relative h-64 rounded-3xl overflow-hidden border border-white/10 shadow-lg">
                              <img src={prop.img} alt={prop.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                              <div className="absolute top-4 left-4">
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 text-white ${pSale ? "bg-emerald-500/60" : "bg-[#006B8A]/60"}`}>
                                  {pSale ? t.fav_sale_badge : t.fav_rent_badge}
                                </span>
                              </div>
                              <button
                                onClick={(e) => { e.preventDefault(); handleRemove(prop.id, "property"); }}
                                disabled={removingId === prop.id}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center border border-red-400 text-white hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-4 left-4 right-4 text-white">
                                <div className="flex items-center gap-1 text-cyan-300 text-sm font-bold mb-1">
                                  <MapPin className="w-3.5 h-3.5" /> {prop.city}
                                </div>
                                <h3 className="font-black text-lg truncate">{prop.title}</h3>
                              </div>
                            </div>
                            <div className="px-1 pt-4 pb-2 flex justify-between items-end">
                              <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{pSale ? t.fav_sale_price : t.fav_monthly_rent}</p>
                                <span className="text-2xl font-black text-white">${prop.price.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-slate-400 font-semibold">
                                <span className="flex items-center gap-1"><BedDouble className="w-4 h-4 text-[#006B8A]" />{prop.beds}</span>
                                <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-cyan-500" />{prop.baths}</span>
                                <span className="flex items-center gap-1"><Square className="w-4 h-4 text-[#006B8A]" />{prop.area}m²</span>
                                <span className="flex items-center gap-1 text-amber-400"><Star className="w-4 h-4 fill-amber-400" />{prop.rating}</span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Vehicles */}
            <AnimatePresence>
              {shownVehicles.length > 0 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {tab === "all" && (
                    <h2 className="text-lg font-black text-white mb-5 flex items-center gap-2">
                      <Car className="w-5 h-5 text-purple-400" /> {t.fav_section_vehicles}
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shownVehicles.map((v) => {
                      const vSale = isSale(v.status);
                      return (
                        <motion.div
                          key={v.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="group relative"
                        >
                          <Link href={`/transport/${v.id}`} className="block bg-[#0f0f0e] border border-white/5 rounded-3xl overflow-hidden hover:border-[#006B8A]/50 transition-all shadow-xl">
                            <div className="relative h-56 overflow-hidden">
                              <img src={v.img} alt={v.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0e] via-transparent to-transparent opacity-90" />
                              <div className="absolute top-4 left-4">
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-md border border-white/30 text-white ${vSale ? "bg-emerald-500/80" : "bg-purple-500/80"}`}>
                                  {vSale ? t.fav_sale_badge : t.fav_lease_badge}
                                </span>
                              </div>
                              <button
                                onClick={(e) => { e.preventDefault(); handleRemove(v.id, "vehicle"); }}
                                disabled={removingId === v.id}
                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center border border-red-400 text-white hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-4 left-4 right-4 text-white">
                                <div className="flex items-center gap-1 text-[#7FD4E8] text-sm font-bold mb-1">
                                  <MapPin className="w-3.5 h-3.5" /> {v.city}
                                </div>
                                <h3 className="font-black text-xl truncate">{v.title}</h3>
                              </div>
                            </div>
                            <div className="p-5 flex items-end justify-between border-t border-white/5">
                              <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{vSale ? t.fav_sale_price : t.fav_daily_rent}</p>
                                <span className="text-2xl font-black text-white">${v.price.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                                <Star className="w-4 h-4 fill-amber-400" /> {v.rating}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
