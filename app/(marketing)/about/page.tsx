"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Building2, Car, Globe, ShieldCheck, Star, Users, Zap, Heart, MapPin } from "lucide-react";
import Footer from "@/components/common/Footer";
import Interactive3DShowcase from "@/components/ui/Interactive3DShowcase";
import { useLanguage } from "@/context/LanguageContext";

const fadeUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const fadeLeft = {
  initial: { opacity: 0, x: -60 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

export default function AboutPage() {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timer = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => clearTimeout(timer);
  }, []);

  const STATS = [
    { value: "10K+", label: t.about_stat_listings, icon: Building2 },
    { value: "50+", label: t.about_stat_countries, icon: Globe },
    { value: "98%", label: t.about_stat_satisfaction, icon: Star },
    { value: "24/7", label: t.about_stat_support, icon: Zap },
  ];

  const VALUES = [
    {
      icon: ShieldCheck,
      title: t.about_value_1_title,
      desc: t.about_value_1_desc,
    },
    {
      icon: Heart,
      title: t.about_value_2_title,
      desc: t.about_value_2_desc,
    },
    {
      icon: Globe,
      title: t.about_value_3_title,
      desc: t.about_value_3_desc,
    },
    {
      icon: Users,
      title: t.about_value_4_title,
      desc: t.about_value_4_desc,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a09] text-white flex flex-col overflow-hidden">

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Ambient background glows */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#004E64]/20 rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#006B8A]/15 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#004E64]/5 rounded-full blur-[200px]" />
        </div>

        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#004E64]/20 border border-[#006B8A]/30 backdrop-blur-md px-5 py-2.5 rounded-full mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-[#00A3CC] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#7FD4E8]">{t.about_badge}</span>
          </motion.div>

          {/* Main Tagline — the user's quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="mb-10"
          >
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white mb-2"
              style={{ fontFamily: "'Grailga', serif" }}
            >
              {t.about_hero_title_1}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3CC] via-[#7FD4E8] to-[#004E64]">
                {t.about_hero_title_2}
              </span>
            </h1>

            <div className="mt-4 flex flex-col items-center gap-3">
              <p
                className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-300 leading-snug"
                style={{ fontFamily: "'Grailga', serif" }}
              >
                {t.about_hero_subtitle_1}
                <span className="text-[#00A3CC]">{t.about_hero_subtitle_2}</span>
              </p>
              <p
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white mt-2"
                style={{ fontFamily: "'Grailga', serif" }}
              >
                {t.about_hero_tagline}
              </p>
            </div>
          </motion.div>

          {/* Sub-description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12"
          >
            {t.about_description}
          </motion.p>

          {/* CTA Buttons - REMOVED AS PER USER REQUEST */}
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t.about_scroll_more}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-[1px] h-10 bg-gradient-to-b from-[#006B8A] to-transparent"
          />
        </motion.div>
      </section>

      {/* ── INTERACTIVE 3D SHOWCASE ── */}
      <Interactive3DShowcase />

      {/* ── STATS BAR ── */}
      <section className="border-t border-white/5 bg-[#0a0a09]/80 backdrop-blur-xl relative z-10">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#004E64]/20 border border-[#006B8A]/30 flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6 text-[#00A3CC]" />
                </div>
                <span
                  className="text-4xl font-black text-white mb-1"
                  style={{ fontFamily: "'Grailga', serif" }}
                >
                  {s.value}
                </span>
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY SECTION ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#004E64]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div {...fadeLeft}>
            <div className="text-[#00A3CC] font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#00A3CC] inline-block" />
              {t.about_story_badge}
            </div>
            <h2
              className="text-4xl md:text-5xl font-black text-white leading-tight mb-8"
              style={{ fontFamily: "'Grailga', serif" }}
            >
              {t.about_story_title_1}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3CC] to-[#004E64]">
                {t.about_story_title_2}
              </span>
            </h2>
            <div className="space-y-5 text-slate-400 text-base font-medium leading-relaxed">
              <p>{t.about_story_p1}</p>
              <p>{t.about_story_p2}</p>
              <p>{t.about_story_p3}</p>
            </div>
          </motion.div>

          {/* Right: Visual card stack */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Back card */}
            <div className="absolute -top-4 -right-4 w-full h-full rounded-3xl bg-[#006B8A]/10 border border-[#006B8A]/20" />
            {/* Front card */}
            <div className="relative bg-zinc-900/60 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#004E64] to-[#006B8A] flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  V
                </div>
                <div>
                  <div className="text-xl font-black text-white">Valorum</div>
                  <div className="text-sm font-bold text-slate-500">Premium Platform</div>
                </div>
              </div>
              <blockquote className="text-2xl font-black text-white leading-snug mb-6" style={{ fontFamily: "'Grailga', serif" }}>
                "{t.about_story_card_title}"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#004E64] to-[#00A3CC]" />
                <div>
                  <div className="text-sm font-black text-white">Valorum Team</div>
                  <div className="text-xs font-bold text-slate-500">{t.about_story_card_team}</div>
                </div>
              </div>
              {/* Decorative badge */}
              <div className="absolute top-6 right-6 bg-[#004E64]/30 border border-[#006B8A]/40 rounded-full px-3 py-1 text-xs font-black text-[#7FD4E8] uppercase tracking-wider">
                Est. 2024
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VALUES SECTION ── */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#004E64]/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-20">
            <div className="text-[#00A3CC] font-black uppercase tracking-widest text-sm mb-4">
              {t.about_values_badge}
            </div>
            <h2
              className="text-4xl md:text-5xl font-black text-white"
              style={{ fontFamily: "'Grailga', serif" }}
            >
              {t.about_values_title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group bg-zinc-900/40 border border-white/5 hover:border-[#006B8A]/40 rounded-3xl p-8 flex flex-col gap-5 hover:bg-zinc-800/60 transition-all duration-300 hover:shadow-xl hover:shadow-[#004E64]/10"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#004E64]/20 border border-[#006B8A]/30 flex items-center justify-center group-hover:bg-[#004E64] group-hover:border-[#006B8A] transition-all">
                  <v.icon className="w-7 h-7 text-[#00A3CC] group-hover:text-white transition-colors" />
                </div>
                <h3
                  className="text-xl font-black text-white"
                  style={{ fontFamily: "'Grailga', serif" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITIES WE SERVE ── */}
      <section className="py-24 border-t border-white/5 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
            <div>
              <div className="text-[#00A3CC] font-black uppercase tracking-widest text-sm mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {t.about_regions_badge}
              </div>
              <h2
                className="text-3xl md:text-4xl font-black text-white"
                style={{ fontFamily: "'Grailga', serif" }}
              >
                {t.about_regions_title}
              </h2>
            </div>
            <Link
              href="/countries"
              className="flex items-center gap-2 text-[#00A3CC] font-black hover:text-white transition-colors text-sm"
            >
              {t.about_regions_btn} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {["Dubai", "London", "New York", "Paris", "Milan", "Tokyo", "Monaco", "Zurich", "Barcelona", "Berlin", "Madrid", "Geneva"].map((city, i) => (
              <motion.span
                key={city}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-2.5 rounded-full bg-[#004E64]/15 border border-[#006B8A]/25 text-[#7FD4E8] font-bold text-sm hover:bg-[#004E64]/30 hover:border-[#006B8A]/50 transition-all cursor-default"
              >
                {city}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004E64]/10 via-transparent to-[#002B38]/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#004E64]/8 blur-[150px] rounded-full pointer-events-none" />

        <motion.div
          {...fadeUp}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight mb-6"
            style={{ fontFamily: "'Grailga', serif" }}
          >
            {t.about_cta_title_1}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3CC] to-[#006B8A]">
              {t.about_cta_title_2}
            </span>
          </h2>
          <p className="text-lg text-slate-400 font-medium mb-10 max-w-2xl mx-auto">
            {t.about_cta_desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="group px-10 py-4 rounded-full bg-gradient-to-r from-[#004E64] to-[#006B8A] hover:from-[#006B8A] hover:to-[#00A3CC] text-white font-black text-lg transition-all shadow-2xl shadow-[#004E64]/30 hover:shadow-[#006B8A]/40 hover:scale-105 flex items-center justify-center gap-2"
            >
              {t.about_cta_btn_reg}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/property"
              className="px-10 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              {t.about_cta_btn_cat}
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
