/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Dashboard } from "./components/Dashboard";
import { Login } from "./components/Login";

type AuthState = "login" | "dashboard" | "logged_out";

export default function App() {
  const [authState, setAuthState] = useState<AuthState>("login");

  useEffect(() => {
    const isAuthed = localStorage.getItem("hermes_auth");
    if (isAuthed) {
      setAuthState("dashboard");
    }
  }, []);

  const handleLogin = () => {
    setAuthState("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("hermes_auth");
    sessionStorage.clear();
    console.log("User logged out");
    setAuthState("logged_out");
  };

  if (authState === "login") {
    return <Login onLogin={handleLogin} />;
  }

  if (authState === "logged_out") {
    return (
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4 relative overflow-hidden text-slate-200 text-center font-mono">
        <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl shadow-2xl p-8 space-y-6 animate-in fade-in duration-500">
           <h2 className="text-xl font-medium tracking-tight text-slate-100 flex items-center justify-center gap-3">
             <span className="w-2 h-2 rounded-full bg-amber-500"></span>
             Session Terminated
           </h2>
           <p className="text-slate-500 text-sm">You have been logged out successfully.</p>
           <button 
             onClick={() => setAuthState("login")} 
             className="text-cyan-500 hover:text-cyan-400 underline decoration-cyan-500/30 underline-offset-4 transition-colors"
           >
             Initialize New Session
           </button>
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

