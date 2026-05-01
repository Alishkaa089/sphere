"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

function HouseSVG() {
  return (
    <svg viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020d12" />
          <stop offset="100%" stopColor="#061620" />
        </linearGradient>
        <linearGradient id="houseWall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d2030" />
          <stop offset="100%" stopColor="#091520" />
        </linearGradient>
        <linearGradient id="roofG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1d2a" />
          <stop offset="100%" stopColor="#061420" />
        </linearGradient>
        <linearGradient id="winGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00A3CC" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#004E64" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="poolG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#006B8A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#004E64" stopOpacity="0.4" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect width="480" height="320" fill="url(#skyG)" rx="16" />

      {[
        [30, 18], [80, 35], [130, 12], [200, 25], [290, 15], [370, 28], [430, 10], [50, 50], [160, 42], [320, 38], [410, 45]
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.5 : 1} fill="white" opacity={0.3} />
      ))}

      <circle cx="410" cy="38" r="22" fill="#d0cfc8" opacity="0.85" />
      <circle cx="420" cy="32" r="17" fill="#061620" />

      <rect x="0" y="245" width="480" height="75" fill="#040e14" rx="0" />
      <ellipse cx="240" cy="247" rx="210" ry="8" fill="#0a2015" />

      <rect x="80" y="130" width="320" height="130" fill="url(#houseWall)" rx="3" />

      <polygon points="55,130 240,45 425,130" fill="url(#roofG)" />
      <polygon points="55,130 240,52 425,130" fill="#0d2535" />
      <line x1="55" y1="130" x2="240" y2="52" stroke="#006B8A" strokeWidth="1" opacity="0.4" />
      <line x1="425" y1="130" x2="240" y2="52" stroke="#006B8A" strokeWidth="1" opacity="0.4" />

      <rect x="100" y="145" width="70" height="95" fill="url(#winGlow)" rx="3" />
      <rect x="102" y="147" width="66" height="91" fill="#00A3CC" fillOpacity="0.08" rx="2" />
      <line x1="135" y1="147" x2="135" y2="238" stroke="#00A3CC" strokeWidth="0.5" opacity="0.3" />
      <line x1="102" y1="192" x2="168" y2="192" stroke="#00A3CC" strokeWidth="0.5" opacity="0.2" />
      <rect x="98" y="143" width="74" height="99" fill="#00A3CC" fillOpacity="0.04" rx="4" filter="url(#softGlow)" />

      <rect x="192" y="145" width="70" height="95" fill="url(#winGlow)" rx="3" />
      <rect x="194" y="147" width="66" height="91" fill="#00A3CC" fillOpacity="0.07" rx="2" />
      <line x1="227" y1="147" x2="227" y2="238" stroke="#00A3CC" strokeWidth="0.5" opacity="0.25" />

      <rect x="282" y="185" width="34" height="60" fill="#04111c" rx="3" />
      <rect x="284" y="187" width="30" height="56" fill="#050f18" rx="2" />
      <circle cx="313" cy="215" r="3" fill="#00A3CC" opacity="0.9" filter="url(#glow)" />

      <rect x="332" y="145" width="50" height="65" fill="url(#winGlow)" rx="3" />
      <rect x="334" y="147" width="46" height="61" fill="#00A3CC" fillOpacity="0.06" rx="2" />

      <rect x="332" y="210" width="58" height="50" fill="#04111c" rx="2" />
      <line x1="334" y1="222" x2="388" y2="222" stroke="#006B8A" strokeWidth="1" opacity="0.5" />
      <line x1="334" y1="232" x2="388" y2="232" stroke="#006B8A" strokeWidth="1" opacity="0.4" />
      <line x1="334" y1="242" x2="388" y2="242" stroke="#006B8A" strokeWidth="1" opacity="0.3" />

      <rect x="95" y="247" width="140" height="18" fill="url(#poolG)" rx="9" />
      <rect x="97" y="249" width="136" height="14" fill="#00A3CC" fillOpacity="0.12" rx="8" />
      <line x1="110" y1="256" x2="220" y2="256" stroke="#7FD4E8" strokeWidth="0.8" opacity="0.3" />

      <rect x="44" y="195" width="9" height="55" fill="#082015" />
      <ellipse cx="49" cy="178" rx="26" ry="28" fill="#0a2010" />
      <ellipse cx="49" cy="175" rx="20" ry="22" fill="#0c2a14" />
      <ellipse cx="49" cy="172" rx="14" ry="16" fill="#0e3018" />

      <rect x="435" y="205" width="8" height="45" fill="#082015" />
      <ellipse cx="439" cy="188" rx="22" ry="24" fill="#0a2010" />
      <ellipse cx="439" cy="185" rx="16" ry="18" fill="#0c2a14" />

      <ellipse cx="155" cy="248" rx="18" ry="10" fill="#091f0e" />
      <ellipse cx="340" cy="248" rx="16" ry="9" fill="#091f0e" />

      <rect x="282" y="245" width="34" height="28" fill="#09202c" rx="1" opacity="0.6" />

      <rect x="88" y="243" width="4" height="4" fill="#00A3CC" rx="1" opacity="0.7" filter="url(#glow)" />
      <rect x="388" y="243" width="4" height="4" fill="#00A3CC" rx="1" opacity="0.7" filter="url(#glow)" />

      <ellipse cx="135" cy="246" rx="35" ry="6" fill="#004E64" opacity="0.25" />
      <ellipse cx="227" cy="246" rx="35" ry="6" fill="#004E64" opacity="0.2" />
    </svg>
  );
}

function CarSVG() {
  return (
    <svg viewBox="0 0 480 280" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="nightSkyC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#020509" />
          <stop offset="100%" stopColor="#040d14" />
        </linearGradient>
        <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d2535" />
          <stop offset="50%" stopColor="#083045" />
          <stop offset="100%" stopColor="#051520" />
        </linearGradient>
        <linearGradient id="carTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3a50" />
          <stop offset="100%" stopColor="#0d2535" />
        </linearGradient>
        <linearGradient id="groundG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#040d14" />
          <stop offset="100%" stopColor="#020508" />
        </linearGradient>
        <linearGradient id="reflectG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#006B8A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#004E64" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="headlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00A3CC" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#004E64" stopOpacity="0"/>
        </radialGradient>
        <filter id="carGlow">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="wheelBlur">
          <feGaussianBlur stdDeviation="2"/>
        </filter>
      </defs>

      <rect width="480" height="280" fill="url(#nightSkyC)" rx="16"/>

      {[[20,15],[60,30],[120,10],[200,22],[300,12],[380,25],[440,15],[50,45],[170,38],[340,42]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={i%2===0?1:1.5} fill="white" opacity={0.2}/>
      ))}

      <rect x="0" y="210" width="480" height="70" fill="url(#groundG)" />
      <line x1="0" y1="240" x2="480" y2="240" stroke="#0d2535" strokeWidth="1" />
      {[0,80,160,240,320,400].map(x=>(
        <rect key={x} x={x} y="236" width="50" height="3" fill="#0d3545" rx="1.5" opacity="0.6"/>
      ))}

      <ellipse cx="240" cy="215" rx="140" ry="12" fill="#006B8A" opacity="0.08"/>

      <ellipse cx="240" cy="212" rx="160" ry="10" fill="#000" opacity="0.5"/>

      <path d="M90,180 L10,165 L10,195 Z" fill="url(#headlight)" opacity="0.15"/>
      <path d="M90,185 L5,175 L5,210 Z" fill="url(#headlight)" opacity="0.08"/>

      <rect x="375" y="173" width="14" height="8" fill="#cc2200" rx="2" opacity="0.9" filter="url(#carGlow)"/>
      <rect x="375" y="181" width="14" height="5" fill="#ff3300" rx="1" opacity="0.6"/>

      <rect x="78" y="198" width="320" height="14" fill="#040e18" rx="4"/>

      <path d="
        M 85,200
        L 78,198
        L 78,175
        C 78,160 90,145 115,140
        L 160,130
        C 185,122 210,118 245,118
        C 278,118 308,120 330,128
        L 370,145
        C 395,155 405,168 405,178
        L 405,198
        L 395,200
        Z
      " fill="url(#carBody)"/>

      <path d="
        M 160,130
        C 180,108 205,98 245,97
        C 280,97 310,106 335,125
        L 330,128
        C 308,120 278,118 245,118
        C 210,118 185,122 160,130
        Z
      " fill="url(#carTop)"/>

      <path d="
        M 168,128
        C 190,106 215,97 248,97
        C 278,97 300,105 320,122
        L 315,126
        C 295,110 275,102 248,102
        C 220,102 197,110 175,130
        Z
      " fill="#051828" opacity="0.95"/>
      <path d="
        M 175,128
        C 195,108 218,100 245,100
        L 248,102
        C 220,102 197,110 178,130
        Z
      " fill="#00A3CC" opacity="0.08"/>

      <path d="M 320,122 L 332,128 L 328,132 L 316,126 Z" fill="#051828" opacity="0.9"/>

      <path d="
        M 178,130
        L 165,132
        L 165,160
        L 178,158
        Z
      " fill="#041220" opacity="0.9"/>

      <path d="M 88,180 C 150,172 250,170 400,178" stroke="#006B8A" strokeWidth="1.2" fill="none" opacity="0.5"/>
      <path d="M 88,185 C 150,177 250,175 400,183" stroke="#004E64" strokeWidth="0.8" fill="none" opacity="0.3"/>

      <rect x="218" y="178" width="44" height="10" fill="#004E64" rx="2" opacity="0.6"/>
      <text x="240" y="186" textAnchor="middle" fill="#7FD4E8" fontSize="5" fontWeight="bold" letterSpacing="1" opacity="0.9">VALORUM</text>

      <rect x="220" y="168" width="22" height="4" fill="#006B8A" rx="2" opacity="0.7"/>

      <path d="M 80,194 C 80,185 85,178 95,175 L 112,172 L 110,198 Z" fill="#040e18"/>
      <path d="M 90,178 L 112,173 L 112,185 L 90,188 Z" fill="#051e2e" rx="2"/>
      <path d="M 92,180 L 110,175 L 110,183 L 92,186 Z" fill="#00A3CC" opacity="0.8" filter="url(#carGlow)"/>
      <line x1="92" y1="179" x2="110" y2="175" stroke="#00A3CC" strokeWidth="2" opacity="0.9" filter="url(#carGlow)"/>

      <path d="M 375,175 L 396,178 L 400,198 L 370,198 Z" fill="#040e18"/>

      <circle cx="148" cy="207" r="34" fill="#060e14"/>
      <circle cx="148" cy="207" r="28" fill="#08121a"/>
      <circle cx="148" cy="207" r="20" fill="#040c14"/>
      {[0,60,120,180,240,300].map((angle,i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={i}
            x1={148 + Math.cos(rad)*6} y1={207 + Math.sin(rad)*6}
            x2={148 + Math.cos(rad)*19} y2={207 + Math.sin(rad)*19}
            stroke="#006B8A" strokeWidth="3" strokeLinecap="round" opacity="0.8"
          />
        );
      })}
      <circle cx="148" cy="207" r="6" fill="#004E64" opacity="0.9"/>
      <circle cx="148" cy="207" r="3" fill="#00A3CC" opacity="0.8" filter="url(#carGlow)"/>
      <path d="M 122,192 A 34,34 0 0,1 155,174" stroke="#0d2535" strokeWidth="2" fill="none" opacity="0.6"/>

      <circle cx="340" cy="207" r="34" fill="#060e14"/>
      <circle cx="340" cy="207" r="28" fill="#08121a"/>
      <circle cx="340" cy="207" r="20" fill="#040c14"/>
      {[0,60,120,180,240,300].map((angle,i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={i}
            x1={340 + Math.cos(rad)*6} y1={207 + Math.sin(rad)*6}
            x2={340 + Math.cos(rad)*19} y2={207 + Math.sin(rad)*19}
            stroke="#006B8A" strokeWidth="3" strokeLinecap="round" opacity="0.8"
          />
        );
      })}
      <circle cx="340" cy="207" r="6" fill="#004E64" opacity="0.9"/>
      <circle cx="340" cy="207" r="3" fill="#00A3CC" opacity="0.8" filter="url(#carGlow)"/>

      <rect x="392" y="194" width="14" height="5" fill="#030a10" rx="2.5"/>
      <rect x="394" y="195" width="10" height="3" fill="#051520" rx="1.5"/>
    </svg>
  );
}

function TiltCard({
  children,
  onClick,
  isActive,
  label,
  sublabel,
  stats,
  href,
  accentColor,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  label: string;
  sublabel: string;
  stats: { label: string; value: string }[];
  href: string;
  accentColor: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springCfg = { stiffness: 180, damping: 22 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [14, -14]), springCfg);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-14, 14]), springCfg);
  const glowX = useSpring(useTransform(rawX, [-0.5, 0.5], [0, 100]), springCfg);
  const glowY = useSpring(useTransform(rawY, [-0.5, 0.5], [0, 100]), springCfg);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - left) / width - 0.5);
    rawY.set((e.clientY - top) / height - 0.5);
  }, [rawX, rawY]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <div style={{ perspective: "900px" }} className="w-full">
      <motion.div
        ref={cardRef}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.025 }}
        transition={{ scale: { duration: 0.3 } }}
        className="relative w-full cursor-pointer select-none"
      >
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none z-10 opacity-0 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, ${accentColor}18 0%, transparent 65%)`
            ),
          }}
        />

        <div
          className={`relative rounded-3xl overflow-hidden border transition-all duration-500 ${
            isActive
              ? `border-[${accentColor}]/60 shadow-2xl`
              : "border-white/8 hover:border-white/20"
          }`}
          style={{
            background: "linear-gradient(135deg, #0d1e2c 0%, #081520 50%, #050e18 100%)",
            boxShadow: isActive
              ? `0 0 60px ${accentColor}25, 0 20px 60px rgba(0,0,0,0.6)`
              : "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div className="relative h-[260px] overflow-hidden" style={{ transform: "translateZ(20px)" }}>
            {children}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d1e2c] to-transparent pointer-events-none" />
          </div>

          <div className="px-6 pb-6 pt-2" style={{ transform: "translateZ(30px)" }}>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h3
                  className="text-2xl font-black text-white leading-tight"
                  style={{ fontFamily: "'Grailga', serif" }}
                >
                  {label}
                </h3>
                <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: accentColor }}>
                  {sublabel}
                </p>
              </div>
              <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/3 border border-white/5 px-3 py-1.5 rounded-full">
                {t.showcase_hint_3d}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {stats.map((s) => (
                <div key={s.label} className="bg-black/30 border border-white/5 rounded-2xl px-3 py-2.5 text-center">
                  <div className="text-base font-black text-white">{s.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <Link
              href={href}
              className="group/btn flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-black text-sm text-white transition-all hover:scale-[1.02]"
              style={{ background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor}88)` }}
            >
              {t.showcase_btn_view}
              <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    y: 5 + Math.random() * 90,
    size: 1 + Math.random() * 2.5,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#00A3CC]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.2,
          }}
          animate={{
            y: [-12, 12, -12],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function Interactive3DShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<"house" | "car">("house");
  const { t } = useLanguage();

  return (
    <section
      ref={sectionRef}
      className="relative py-28 border-t border-white/5 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0a09 0%, #050e14 50%, #0a0a09 100%)" }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#004E64]/6 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-[20%] w-[400px] h-[300px] bg-[#006B8A]/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-[15%] w-[350px] h-[280px] bg-[#004E64]/4 blur-[120px] rounded-full pointer-events-none" />

      <Particles />

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#004E64]/15 border border-[#006B8A]/25 px-5 py-2 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A3CC] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest text-[#7FD4E8]">{t.showcase_badge}</span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Grailga', serif" }}
          >
            {t.showcase_title_1}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3CC] to-[#004E64]">
              {t.showcase_title_2}
            </span>
          </h2>
          <p className="text-slate-400 font-medium text-base max-w-lg mx-auto">
            {t.showcase_desc}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1.5 gap-1">
            {(["house", "car"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setActive(type)}
                className={`px-8 py-2.5 rounded-full font-black text-sm uppercase tracking-wider transition-all duration-300 ${
                  active === type
                    ? "bg-[#004E64] text-white shadow-lg shadow-[#004E64]/30"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {type === "house" ? t.showcase_toggle_property : t.showcase_toggle_transport}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <TiltCard
              label={t.showcase_property_label}
              sublabel={t.showcase_property_sublabel}
              href="/property"
              isActive={active === "house"}
              onClick={() => setActive("house")}
              accentColor="#00A3CC"
              stats={[
                { label: t.showcase_stat_assets, value: "5K+" },
                { label: t.showcase_stat_countries, value: "50+" },
                { label: t.showcase_stat_rating, value: "4.9★" },
              ]}
            >
              <HouseSVG />
            </TiltCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <TiltCard
              label={t.showcase_transport_label}
              sublabel={t.showcase_transport_sublabel}
              href="/transport"
              isActive={active === "car"}
              onClick={() => setActive("car")}
              accentColor="#006B8A"
              stats={[
                { label: t.showcase_stat_models, value: "300+" },
                { label: t.showcase_stat_brands, value: "40+" },
                { label: t.showcase_stat_speed, value: "2.8s" },
              ]}
            >
              <CarSVG />
            </TiltCard>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-slate-800" />
            {t.showcase_hint_mouse}
            <span className="w-12 h-[1px] bg-slate-800" />
          </p>
        </motion.div>
      </div>
    </section>
  );
}
