"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROJECT_NAME = "Valorum";
const characters = Array.from(PROJECT_NAME);

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<"initial" | "typing" | "paused" | "complete">("initial");
  const [isRepeatVisit, setIsRepeatVisit] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem("hasVisitedSplash");
    if (visited) {
      setStage("complete");
      setIsRepeatVisit(true);
      return;
    }
    
    setStage("typing");

    const typingDuration = characters.length * 60;
    const pauseDuration = 400;

    const pauseTimer = setTimeout(() => {
      setStage("paused");
    }, typingDuration);

    const completeTimer = setTimeout(() => {
      setStage("complete");
      sessionStorage.setItem("hasVisitedSplash", "true");
    }, typingDuration + pauseDuration);

    return () => {
      clearTimeout(pauseTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  if (stage === "initial") {
    return <div className="min-h-screen w-full bg-white dark:bg-black" />;
  }

  if (isRepeatVisit) {
    return <>{children}</>;
  }

  const customEase = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-black overflow-hidden font-sans">
      
      <AnimatePresence>
        {stage !== "complete" && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a09]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-[#004E64]/40 mb-6"
            >
              <img src="/valorum-logo.png" alt="Valorum" className="w-full h-full object-cover" />
            </motion.div>

            <motion.span 
              layoutId="brand-logo"
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white flex"
              style={{ display: "inline-block" }}
            >
              <span className="flex">
                {characters.map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.1,
                      delay: index * 0.06,
                      ease: "easeOut"
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
            </motion.span>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-4 text-sm font-bold text-slate-600 uppercase tracking-widest"
            >
              Premium Platform
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {stage === "complete" && (
        <motion.div
          className="w-full min-h-screen relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: customEase,
          }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
