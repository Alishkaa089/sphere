"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PROJECT_NAME = "Sphere";
const characters = Array.from(PROJECT_NAME);

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<"initial" | "typing" | "paused" | "complete">("initial");

  useEffect(() => {
    const visited = sessionStorage.getItem("hasVisitedSplash");
    if (visited) {
      setStage("complete");
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

  // Pre-rendered layout for repeat visits
  if (stage === "complete" && sessionStorage.getItem("hasVisitedSplash")) {
    return <>{children}</>;
  }

  const customEase = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-black overflow-hidden font-sans">
      
      {/* ─── Animated Text Overlay ─── */}
      <AnimatePresence>
        {stage !== "complete" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black"
            // The background fades out cleanly over 0.8s
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: customEase }}
          >
            <motion.span 
              layoutId="brand-logo"
              // When this span unmounts, Framer Motion magically animates it
              // into the incoming Navbar logo that uses the exact same layoutId!
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white flex"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main UI Reveal ─── */}
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
