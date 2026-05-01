"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser } from "@/lib/actions";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await loginUser({ email, password });
    
    if (res.error) {
      setError(res.error);
      setIsLoading(false);
      return;
    }
    
    if (res.success && res.user) {
      localStorage.setItem("userEmail", res.user.email);
      localStorage.setItem("userName", res.user.name || "");
      localStorage.setItem("userRole", res.user.role);
      localStorage.setItem("userAvatar", res.user.avatar || "");
      localStorage.setItem("userLoggedIn", "true");
      window.dispatchEvent(new Event("avatarChanged"));
      window.dispatchEvent(new Event("roleChanged"));
      
      if (res.user.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/";
      }
    }
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
            className="bg-white/60 focus-visible:ring-[#006B8A]"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none text-slate-700">Password</label>
            <a href="/forgot-password" className="text-xs font-medium text-[#004E64] hover:text-blue-700 hover:underline">Forgot password?</a>
          </div>
          <Input 
            id="password" 
            type="password"
            placeholder="••••••••"
            required
            disabled={isLoading}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white/60 focus-visible:ring-[#006B8A]"
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
