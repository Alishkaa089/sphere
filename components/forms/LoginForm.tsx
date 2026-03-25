"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate auth request delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Admin check
      if (email === "adminyekdi@gmail.com" && password === "AdminYekdi") {
        localStorage.setItem("userLoggedIn", "true");
        window.location.href = "/dashboard";
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }, 1500);
  }

  return (
    <div className="w-full">
      <form onSubmit={onSubmit} className="space-y-4">
        
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3 bg-red-50/50 border border-red-200 text-red-600 text-sm rounded-xl font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-slate-700">Email Address</label>
          <Input 
            id="email"
            type="email" 
            placeholder="adminyekdi@gmail.com" 
            required
            disabled={isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/60 focus-visible:ring-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none text-slate-700">Password</label>
            <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</a>
          </div>
          <Input 
            id="password" 
            type="password"
            placeholder="••••••••"
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/60 focus-visible:ring-blue-500"
          />
        </div>

        <Button className="w-full mt-4" type="submit" disabled={isLoading}>
          {isLoading ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : null}
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
