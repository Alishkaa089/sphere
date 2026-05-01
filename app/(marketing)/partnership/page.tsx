"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Building2, CheckCircle2, Globe, Layout, 
  Rocket, ShieldCheck, Users, Zap, 
  ChevronRight, Play, Server, LineChart, Mail, Phone,
  BadgeCheck
} from "lucide-react";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import { submitEliteContact } from "@/lib/actions";

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function PartnershipPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "", company: "", email: "", phone: "", type: "", message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const [userPlan, setUserPlan] = useState("BASIC");

  useEffect(() => {
    window.scrollTo(0, 0);
    setUserPlan(localStorage.getItem("userPlan") || "BASIC");

    const onPlanChange = () => {
       setUserPlan(localStorage.getItem("userPlan") || "BASIC");
    };
    window.addEventListener("planChanged", onPlanChange);
    return () => window.removeEventListener("planChanged", onPlanChange);
  }, []);

  const PLANS = [
    {
      name: t.partner_tier_1_name,
      price: t.partner_tier_1_price,
      features: [t.partner_tier_1_f1, t.partner_tier_1_f2, t.partner_tier_1_f3, t.partner_tier_1_f4],
      btn: t.partner_btn_start,
      popular: false,
      value: "BASIC"
    },
    {
      name: t.partner_tier_2_name,
      price: t.partner_tier_2_price,
      features: [t.partner_tier_2_f1, t.partner_tier_2_f2, t.partner_tier_2_f3, t.partner_tier_2_f4, t.partner_tier_2_f5, t.partner_tier_2_f6],
      btn: t.partner_btn_start,
      popular: true,
      tag: t.partner_tier_2_tag,
      value: "PRO"
    },
    {
      name: t.partner_tier_3_name,
      price: t.partner_tier_3_price,
      features: [t.partner_tier_3_f1, t.partner_tier_3_f2, t.partner_tier_3_f3, t.partner_tier_3_f4, t.partner_tier_3_f5, t.partner_tier_3_f6],
      btn: t.partner_hero_btn_contact,
      popular: false,
      value: "ELITE"
    }
  ];

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^A-Za-zƏəŞşÇçĞğÜüÖöİı\s]/g, "");
    setFormData({...formData, name: val});
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^A-Za-z0-9ƏəŞşÇçĞğÜüÖöİı\s]/g, "");
    setFormData({...formData, company: val});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localStorage.getItem("userLoggedIn") !== "true") {
       alert("Zəhmət olmasa əvvəlcə sistemə daxil olun.");
       router.push("/login");
       return;
    }
    setIsSubmitting(true);
    const email = localStorage.getItem("userEmail") || "";
    const res = await submitEliteContact(formData, email);
    setIsSubmitting(false);
    
    if (res.success) {
      setIsSubmitted(true);
    } else {
      alert(res.error || "Xəta baş verdi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a09] text-white flex flex-col overflow-hidden">
      <style jsx global>{`
        .react-tel-input .form-control {
          background: rgba(0, 0, 0, 0.4) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          width: 100% !important;
          height: 56px !important;
          border-radius: 1rem !important;
          color: white !important;
          padding-left: 60px !important;
          font-family: inherit !important;
        }
        .react-tel-input .flag-dropdown {
          background: transparent !important;
          border: none !important;
          padding: 0 10px !important;
        }
        .react-tel-input .selected-flag {
          background: transparent !important;
          border-radius: 1rem 0 0 1rem !important;
        }
        .react-tel-input .selected-flag:hover, .react-tel-input .selected-flag:focus {
          background: rgba(255, 255, 255, 0.05) !important;
        }
        .react-tel-input .country-list {
          background: #18181b !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 1rem !important;
          color: white !important;
        }
        .react-tel-input .country-list .country:hover {
          background: #27272a !important;
        }
        .react-tel-input .country-list .country.highlight {
          background: #004E64 !important;
        }
      `}</style>
      
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#004E64]/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#006B8A]/15 rounded-full blur-[140px]" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#004E64]/20 border border-[#006B8A]/30 backdrop-blur-md px-5 py-2.5 rounded-full mb-10"
          >
            <Users className="w-3.5 h-3.5 text-[#00A3CC]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#7FD4E8]">{t.partner_badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white mb-6"
            style={{ fontFamily: "'Grailga', serif" }}
          >
            {t.partner_hero_title_1}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3CC] via-[#7FD4E8] to-[#004E64]">
              {t.partner_hero_title_2}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed mb-12"
          >
            {t.partner_hero_desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#plans" className="px-10 py-4 rounded-full bg-[#004E64] hover:bg-[#006B8A] text-white font-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#004E64]/30">
              {t.partner_hero_btn_plans} <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#contact" className="px-10 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black transition-all">
              {t.partner_hero_btn_contact}
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 bg-zinc-900/10">
          <div className="max-w-7xl mx-auto px-6 text-center mb-16">
            <div className="text-[#00A3CC] font-black uppercase tracking-widest text-xs mb-3">{t.partner_who_badge}</div>
            <h2 className="text-3xl md:text-5xl font-black text-white" style={{ fontFamily: "'Grailga', serif" }}>
              {t.partner_who_title}
            </h2>
          </div>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, title: t.partner_type_1_title, desc: t.partner_type_1_desc },
              { icon: Rocket, title: t.partner_type_2_title, desc: t.partner_type_2_desc },
              { icon: Layout, title: t.partner_type_3_title, desc: t.partner_type_3_desc },
              { icon: Server, title: t.partner_type_4_title, desc: t.partner_type_4_desc },
            ].map((type, i) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-zinc-900/40 border border-white/5 p-8 rounded-3xl hover:bg-zinc-800/50 transition-all hover:border-[#006B8A]/40"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#004E64]/20 border border-[#006B8A]/30 flex items-center justify-center mb-6 group-hover:bg-[#004E64] transition-all">
                  <type.icon className="w-6 h-6 text-[#00A3CC] group-hover:text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-4" style={{ fontFamily: "'Grailga', serif" }}>{type.title}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{type.desc}</p>
              </motion.div>
            ))}
          </div>
      </section>

      <section className="py-24 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="text-[#00A3CC] font-black uppercase tracking-widest text-xs mb-3">{t.partner_benefits_badge}</div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8" style={{ fontFamily: "'Grailga', serif" }}>
              {t.partner_benefits_title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
              {[
                { icon: Globe, title: t.partner_benefit_1_title, desc: t.partner_benefit_1_desc },
                { icon: LineChart, title: t.partner_benefit_2_title, desc: t.partner_benefit_2_desc },
                { icon: ShieldCheck, title: t.partner_benefit_3_title, desc: t.partner_benefit_3_desc },
                { icon: Zap, title: t.partner_benefit_4_title, desc: t.partner_benefit_4_desc },
                { icon: Users, title: t.partner_benefit_5_title, desc: t.partner_benefit_5_desc },
                { icon: Rocket, title: t.partner_benefit_6_title, desc: t.partner_benefit_6_desc },
              ].map((benefit) => (
                <div key={benefit.title} className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-5 h-5 text-[#00A3CC]" /></div>
                  <div>
                    <h4 className="font-black text-white text-sm mb-1">{benefit.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative bg-zinc-900 border border-white/5 rounded-3xl p-2 aspect-video overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" className="w-full h-full object-cover opacity-50" alt="Analytics" />
            <div className="absolute inset-x-8 bottom-8 z-20">
              <div className="w-12 h-12 rounded-full bg-[#00A3CC] flex items-center justify-center text-white shadow-lg mb-4 cursor-pointer hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">Valorum B2B Dashboard Demo</h3>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="plans" className="py-24 border-t border-white/5 bg-zinc-900/20">
        <div className="max-w-7xl mx-auto px-6 text-center mb-16">
          <div className="text-[#00A3CC] font-black uppercase tracking-widest text-xs mb-3">{t.partner_plans_badge}</div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4" style={{ fontFamily: "'Grailga', serif" }}>
            {t.partner_plans_title}
          </h2>
          <p className="text-slate-400 font-medium">{t.partner_plans_desc}</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col p-8 rounded-3xl border transition-all ${plan.popular ? 'bg-zinc-900 border-[#006B8A]/60 shadow-2xl shadow-[#004E64]/20 scale-105 z-10' : 'bg-transparent border-white/5 hover:border-white/10'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#004E64] to-[#006B8A] text-[10px] font-black uppercase tracking-widest">
                  {plan.tag}
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-black text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                </div>
              </div>
              <div className="flex-grow space-y-4 mb-8">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm font-medium text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-[#00A3CC]" /> {f}
                  </div>
                ))}
              </div>
              <button 
                onClick={() => {
                   if (userPlan === plan.value) return;
                   if (plan.value === "PRO") {
                      if (localStorage.getItem("userLoggedIn") !== "true") {
                         router.push("/login");
                      } else {
                         router.push("/checkout-plan");
                      }
                   } else if (plan.value === "ELITE") {
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                   }
                }}
                disabled={userPlan === plan.value}
                className={`w-full py-4 rounded-full font-black text-sm transition-all ${
                  userPlan === plan.value ? 'bg-zinc-800 text-slate-500 cursor-not-allowed hidden md:block' : 
                  plan.popular ? 'bg-[#004E64] hover:bg-[#006B8A] text-white cursor-pointer' : 
                  'bg-white/5 hover:bg-white/10 text-white cursor-pointer'
                }`}
              >
                {userPlan === plan.value ? "Mövcud Plan" : plan.btn}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-24 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="text-[#00A3CC] font-black uppercase tracking-widest text-xs mb-3">{t.partner_contact_badge}</div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6" style={{ fontFamily: "'Grailga', serif" }}>
              {t.partner_contact_title}
            </h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed mb-10">{t.partner_contact_desc}</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center"><Mail className="w-5 h-5 text-[#00A3CC]" /></div>
                <div><div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</div><div className="font-black text-white">partnerships@Valorum.app</div></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center"><Phone className="w-5 h-5 text-[#00A3CC]" /></div>
                <div><div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Support</div><div className="font-black text-white">+1 (800) VALORUM</div></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center"><Globe className="w-5 h-5 text-[#00A3CC]" /></div>
                <div><div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Headquarters</div><div className="font-black text-white">Dubai, United Arab Emirates</div></div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-white/8 rounded-[40px] p-8 md:p-12 backdrop-blur-xl relative">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.partner_form_name}</label>
                      <input required type="text" value={formData.name} onChange={handleNameChange} placeholder={t.partner_form_name_ph} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#004E64] outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.partner_form_company}</label>
                       <input required type="text" value={formData.company} onChange={handleCompanyChange} placeholder={t.partner_form_company_ph} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#004E64] outline-none transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.partner_form_email}</label>
                       <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder={t.partner_form_email_ph} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#004E64] outline-none transition-all" />
                    </div>
                    <div className="space-y-2 relative">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.partner_form_phone}</label>
                      <PhoneInput 
                        country={'az'}
                        value={formData.phone}
                        onChange={(val) => setFormData({...formData, phone: val})}
                        placeholder={t.partner_form_phone_ph}
                        enableSearch={true}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.partner_form_type}</label>
                    <div className="relative">
                      <select required value={formData.type} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#004E64] outline-none transition-all appearance-none" onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option value="">{t.partner_form_type_select}</option>
                        <option value="agency">{t.partner_type_option_agency}</option>
                        <option value="dealer">{t.partner_type_option_dealer} </option>
                        <option value="developer">{t.partner_type_option_investor}</option>
                        <option value="tech">{t.partner_type_option_tech}</option>
                        <option value="other">{t.partner_type_option_other}</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><ChevronRight className="w-4 h-4 rotate-90" /></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">{t.partner_form_message}</label>
                    <textarea rows={4} value={formData.message} placeholder={t.partner_form_message_ph} className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#004E64] outline-none transition-all resize-none" onChange={(e) => setFormData({...formData, message: e.target.value})} />
                  </div>
                  <button disabled={isSubmitting} type="submit" className="w-full py-5 rounded-2xl bg-gradient-to-r from-[#004E64] to-[#006B8A] hover:from-[#006B8A] hover:to-[#00A3CC] text-white font-black text-lg transition-all shadow-xl shadow-[#004E64]/30 group disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? "Göndərilir..." : t.partner_form_btn} <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.form>
              ) : (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8"><BadgeCheck className="w-10 h-10 text-emerald-500" /></div>
                  <h3 className="text-3xl font-black text-white mb-4" style={{ fontFamily: "'Grailga', serif" }}>{t.partner_contact_success_title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">{t.partner_contact_success_desc}</p>
                  <button onClick={() => setIsSubmitted(false)} className="mt-10 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all font-bold">Back to Form</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
