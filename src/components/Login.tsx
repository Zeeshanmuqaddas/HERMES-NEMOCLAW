import React, { FormEvent, useState } from "react";
import { ShieldCheck, Lock, User, Terminal } from "lucide-react";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    console.log("Login attempt:", email, password);
    
    // Simulate backend auth delay for visual effect
    setTimeout(() => {
      localStorage.setItem("hermes_auth", "true");
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-700 rounded-full mix-blend-screen filter blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-700 rounded-full mix-blend-screen filter blur-[128px]"></div>
      </div>

      <div className="z-10 w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-8 border-b border-slate-800/80 bg-slate-950/80 flex flex-col items-center">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
             <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight font-sans">HERMES / NEMOCLAW</h2>
          <p className="text-xs font-mono text-cyan-500 mt-2 tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            Secure Access Terminal
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1" htmlFor="email">
              OPERATOR ID
            </label>
            <div className="relative group">
               <User className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5 group-focus-within:text-cyan-500 transition-colors" />
               <input 
                 id="email" 
                 type="email" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm shadow-inner"
                 placeholder="Enter your email" 
               />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1" htmlFor="password">
              PASSKEY
            </label>
            <div className="relative group">
               <Lock className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5 group-focus-within:text-cyan-500 transition-colors" />
               <input 
                 id="password" 
                 type="password" 
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-200 placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono text-sm shadow-inner"
                 placeholder="Enter your password" 
               />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isAuthenticating}
            className="w-full relative flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg transition-all mt-4 text-sm shadow-[0_0_15px_rgba(8,145,178,0.3)] hover:shadow-[0_0_25px_rgba(8,145,178,0.5)] disabled:opacity-70 disabled:hover:bg-cyan-600 group overflow-hidden"
          >
            {isAuthenticating ? (
              <span className="flex items-center gap-2 font-mono tracking-widest uppercase">
                <Terminal className="w-4 h-4 animate-pulse" />
                AUTHENTICATING...
              </span>
            ) : (
              <span className="font-mono tracking-widest uppercase">INITIALIZE SESSION</span>
            )}
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
          </button>
        </form>
      </div>
      
      {/* Footer text */}
      <div className="z-10 mt-8 text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
        Cruse Cloud • AI Orchestration Layer • v2.0.4
      </div>
    </div>
  );
}
