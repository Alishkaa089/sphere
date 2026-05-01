"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Briefcase, Code2, Globe, Heart, MapPin,
  Megaphone, Rocket, Shield, Star, TrendingUp, Users, Zap, ChevronDown
} from "lucide-react";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { submitJobApplication } from "@/lib/actions";
import { Loader2, X } from "lucide-react";

export default function CareersPage() {
  const [openDept, setOpenDept] = useState<string | null>("eng");
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({ fullName: "", email: "", phone: "", portfolio: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timer = setTimeout(() => window.scrollTo(0, 0), 100);
    return () => clearTimeout(timer);
  }, []);

  const PERKS = [
    { icon: Globe, title: t.careers_perk_remote_title, desc: t.careers_perk_remote_desc },
    { icon: TrendingUp, title: t.careers_perk_growth_title, desc: t.careers_perk_growth_desc },
    { icon: Heart, title: t.careers_perk_health_title, desc: t.careers_perk_health_desc },
    { icon: Star, title: t.careers_perk_bonus_title, desc: t.careers_perk_bonus_desc },
    { icon: Zap, title: t.careers_perk_learn_title, desc: t.careers_perk_learn_desc },
    { icon: Rocket, title: t.careers_perk_mission_title, desc: t.careers_perk_mission_desc },
  ];

  const ROLES = [
    {
      id: "eng",
      dept: t.careers_dept_eng,
      icon: Code2,
      color: "from-[#004E64] to-[#006B8A]",
      glow: "shadow-[#004E64]/20",
      positions: [
        { title: t.careers_role_eng_1, loc: "Remote", type: "Full-time", badge: "Hot" },
        { title: t.careers_role_eng_2, loc: "Remote / Dubai", type: "Full-time", badge: "" },
        { title: t.careers_role_eng_3, loc: "Remote", type: "Full-time", badge: "New" },
      ],
    },
    {
      id: "prod",
      dept: t.careers_dept_prod,
      icon: Rocket,
      color: "from-violet-600 to-purple-600",
      glow: "shadow-violet-600/20",
      positions: [
        { title: t.careers_role_prod_1, loc: "Remote", type: "Full-time", badge: "Hot" },
        { title: t.careers_role_prod_2, loc: "Remote / London", type: "Full-time", badge: "" },
      ],
    },
    {
      id: "growth",
      dept: t.careers_dept_growth,
      icon: Megaphone,
      color: "from-emerald-600 to-teal-600",
      glow: "shadow-emerald-600/20",
      positions: [
        { title: t.careers_role_growth_1, loc: "Dubai / Remote", type: "Full-time", badge: "New" },
        { title: t.careers_role_growth_2, loc: "Remote", type: "Part-time", badge: "" },
        { title: t.careers_role_growth_3, loc: "Remote", type: "Contract", badge: "" },
      ],
    },
    {
      id: "ops",
      dept: t.careers_dept_ops,
      icon: Shield,
      color: "from-amber-600 to-orange-500",
      glow: "shadow-amber-600/20",
      positions: [
        { title: t.careers_role_ops_1, loc: "UAE / Europe", type: "Full-time", badge: "Hot" },
        { title: t.careers_role_ops_2, loc: "Remote", type: "Full-time", badge: "" },
      ],
    },
  ];

  const VALUES = [
    { title: t.careers_value_1_title, desc: t.careers_value_1_desc },
    { title: t.careers_value_2_title, desc: t.careers_value_2_desc },
    { title: t.careers_value_3_title, desc: t.careers_value_3_desc },
    { title: t.careers_value_4_title, desc: t.careers_value_4_desc },
  ];

  const STATS = [
    { label: t.careers_stat_roles, value: "9" },
    { label: t.careers_stat_countries, value: "12+" },
    { label: t.careers_stat_team, value: "40+" },
    { label: t.careers_stat_response, value: "48s" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a09] text-white flex flex-col overflow-hidden">

      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-5%] left-[-10%] w-[600px] h-[600px] bg-[#004E64]/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-[-5%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-36 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#004E64]/20 border border-[#006B8A]/30 backdrop-blur-md px-5 py-2.5 rounded-full mb-10"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#00A3CC]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#7FD4E8]">{t.careers_badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white mb-6"
            style={{ fontFamily: "'Grailga', serif" }}
          >
            {t.careers_hero_title.split('bizimlə')[0]}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3CC] via-[#7FD4E8] to-[#004E64]">
              {t.careers_hero_title.includes('bizimlə') ? 'bizimlə ' : ''}{t.careers_hero_title.split('bizimlə')[1] || t.careers_hero_title.split('with us')[1] || ''}
            </span>
            {t.careers_hero_title.includes('with us') ? ' with us.' : ''}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-12"
          >
            {t.careers_hero_desc.split('qurucu')[0]}
            <strong className="text-white">{t.careers_hero_desc.includes('qurucu') ? 'qurucu' : t.careers_hero_desc.includes('founders') ? 'founders' : ''}</strong>
            {t.careers_hero_desc.split('qurucu')[1] || t.careers_hero_desc.split('founders')[1] || ''}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#open-roles"
              className="group px-8 py-4 rounded-full bg-[#004E64] hover:bg-[#006B8A] text-white font-black text-base transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#004E64]/30 hover:scale-105"
            >
              {t.careers_hero_btn_roles}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#culture"
              className="px-8 py-4 rounded-full bg-white/8 hover:bg-white/15 border border-white/15 text-white font-black text-base transition-all hover:scale-105 flex items-center justify-center"
            >
              {t.careers_hero_btn_culture}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-16 flex flex-wrap justify-center gap-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3 bg-white/5 border border-white/8 backdrop-blur-md rounded-2xl px-5 py-3">
                <span className="text-xl font-black text-[#00A3CC]">{s.value}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-28 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#004E64]/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="text-[#00A3CC] font-black uppercase tracking-widest text-xs mb-3">{t.careers_perks_badge}</div>
            <h2 className="text-3xl md:text-5xl font-black text-white" style={{ fontFamily: "'Grailga', serif" }}>
              {t.careers_perks_title}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group bg-zinc-900/40 border border-white/5 hover:border-[#006B8A]/40 rounded-3xl p-8 flex flex-col gap-4 hover:bg-zinc-800/50 transition-all hover:shadow-xl hover:shadow-[#004E64]/10"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#004E64]/20 border border-[#006B8A]/30 flex items-center justify-center group-hover:bg-[#004E64] transition-all">
                  <p.icon className="w-6 h-6 text-[#00A3CC] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-black text-white" style={{ fontFamily: "'Grailga', serif" }}>{p.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="culture" className="py-28 border-t border-white/5 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="text-emerald-500 font-black uppercase tracking-widest text-xs mb-3 flex items-center justify-center gap-2">
              <Users className="w-4 h-4" /> {t.careers_culture_badge}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white" style={{ fontFamily: "'Grailga', serif" }}>
              {t.careers_culture_title}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-white/8 rounded-3xl p-8 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#004E64] to-[#006B8A] rounded-l-3xl" />
                <div className="text-5xl font-black text-white/5 mb-4 leading-none" style={{ fontFamily: "'Grailga', serif" }}>0{i + 1}</div>
                <h3 className="text-xl font-black text-white mb-3" style={{ fontFamily: "'Grailga', serif" }}>{v.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="open-roles" className="py-28 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="text-[#00A3CC] font-black uppercase tracking-widest text-xs mb-3">{t.careers_roles_badge}</div>
            <h2 className="text-3xl md:text-5xl font-black text-white" style={{ fontFamily: "'Grailga', serif" }}>
              {t.careers_roles_title}
            </h2>
            <p className="mt-4 text-slate-400 font-medium">{t.careers_roles_desc}</p>
          </motion.div>

          <div className="space-y-4">
            {ROLES.map((dept, di) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: di * 0.1 }}
                className="border border-white/8 rounded-3xl overflow-hidden bg-zinc-900/30 backdrop-blur-sm"
              >
                <button
                  onClick={() => setOpenDept(openDept === dept.id ? null : dept.id)}
                  className="w-full flex items-center justify-between px-8 py-6 hover:bg-white/3 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center shadow-lg ${dept.glow}`}>
                      <dept.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-black text-white text-lg">{dept.dept}</div>
                      <div className="text-xs font-bold text-slate-500">{dept.positions.length} {t.careers_roles_count}</div>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openDept === dept.id ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {openDept === dept.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 divide-y divide-white/5">
                        {dept.positions.map((pos, pi) => (
                          <div key={pos.title}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-5 hover:bg-white/3 transition-colors group"
                          >
                            <div>
                              <div className="flex items-center gap-3 mb-1.5">
                                <span className="font-black text-white group-hover:text-[#00A3CC] transition-colors">{pos.title}</span>
                                {pos.badge && (
                                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${pos.badge === "Hot" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-[#004E64]/30 text-[#7FD4E8] border border-[#006B8A]/30"}`}>
                                    {pos.badge}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pos.loc}</span>
                                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/8">{pos.type}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedRole(pos.title);
                                setApplyModalOpen(true);
                                setSuccessMsg("");
                                setFormData({ fullName: "", email: "", phone: "", portfolio: "", message: "" });
                              }}
                              className="flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#004E64]/20 border border-[#006B8A]/30 text-[#7FD4E8] font-black text-sm hover:bg-[#004E64] hover:text-white transition-all"
                            >
                              {t.careers_btn_apply || "Müraciət Et"} <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#004E64]/8 via-transparent to-violet-900/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#004E64]/8 blur-[160px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto px-6 text-center relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Grailga', serif" }}>
            {t.careers_cta_title}
          </h2>
          <p className="text-lg text-slate-400 font-medium mb-10">
            {t.careers_cta_desc}
          </p>
          <a
            href="mailto:careers@Valorum.app"
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[#004E64] to-[#006B8A] hover:from-[#006B8A] hover:to-[#00A3CC] text-white font-black text-lg transition-all shadow-2xl shadow-[#004E64]/30 hover:scale-105"
          >
            careers@Valorum.app
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </section>

      <Footer />

      <AnimatePresence>
        {applyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <button 
                onClick={() => setApplyModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <h3 className="text-2xl font-black text-white mb-2">Müraciət Formu</h3>
                <p className="text-slate-400 text-sm">Vakansiya: <span className="text-[#00A3CC] font-bold">{selectedRole}</span></p>
              </div>

              {successMsg ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-8 rounded-2xl text-center font-bold">
                  {successMsg}
                </div>
              ) : (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const res = await submitJobApplication({ ...formData, roleTitle: selectedRole });
                    setLoading(false);
                    if (res.success) {
                      setSuccessMsg("Müraciətiniz uğurla göndərildi. Təşəkkür edirik!");
                      setTimeout(() => setApplyModalOpen(false), 3000);
                    } else {
                      alert(res.error || "Xəta baş verdi");
                    }
                  }} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Ad və Soyad *</label>
                    <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors" placeholder="Adınız və Soyadınız" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email *</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors" placeholder="nümunə@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Mobil Nömrə *</label>
                    <input required type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors" placeholder="+994" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">CV və ya Portfolio Linki</label>
                    <input type="url" value={formData.portfolio} onChange={(e) => setFormData({...formData, portfolio: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors" placeholder="https://" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Əlavə Qeyd (İstəyə görə)</label>
                    <textarea rows={3} value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#006B8A] transition-colors" placeholder="Özünüz haqqında qısa məlumat verin..."></textarea>
                  </div>
                  
                  <button disabled={loading} type="submit" className="w-full py-4 mt-4 rounded-xl font-black bg-gradient-to-r from-[#004E64] to-[#006B8A] hover:bg-gradient-to-br text-white transition-all shadow-lg flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Müraciəti Göndər"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
