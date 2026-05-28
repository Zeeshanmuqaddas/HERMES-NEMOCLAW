import { ActionLog, AgentStatus, Anomaly } from "../types";
import { AlertCircle, Terminal, Info, AlertTriangle, ShieldAlert, Send, ChevronDown, ChevronRight, X, Code } from "lucide-react";
import { cn } from "../lib/utils";
import React, { FormEvent, useEffect, useRef, useState } from "react";

export function AnomalyLog({ anomalies }: { anomalies: Anomaly[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
        <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          Detected Anomalies
        </h3>
        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
          {anomalies.length} ACTIVE
        </span>
      </div>
      <div className="p-4 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
        {anomalies.map((anomaly) => (
          <div key={anomaly.id} className="p-3 rounded-lg border border-slate-800 bg-slate-950/50 group hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {anomaly.severity === "critical" ? <ShieldAlert className="w-4 h-4 text-red-500" /> :
                 anomaly.severity === "high" ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
                 <Info className="w-4 h-4 text-emerald-500" />}
                <span className="font-medium text-sm text-slate-200">{anomaly.type}</span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                 {new Date(anomaly.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
               <div className="flex justify-between text-slate-400">
                 <span>ID: <span className="font-mono text-slate-300">{anomaly.id}</span></span>
                 <span>Confidence: <span className="font-mono text-emerald-400">{(anomaly.confidence * 100).toFixed(1)}%</span></span>
               </div>
               <div>
                  <span className="text-slate-500 block mb-1">Root Cause Analysis:</span>
                  <p className="text-slate-300 leading-relaxed">{anomaly.rootCause}</p>
               </div>
               <div className="pt-2 mt-2 border-t border-slate-800/50">
                  <span className="text-slate-500 block mb-1">AI Reasoning:</span>
                  <p className="text-slate-400 italic">"{anomaly.reasoning}"</p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const AgentListItem: React.FC<{ agent: AgentStatus }> = ({ agent }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-slate-800 rounded bg-slate-900/60 transition-all overflow-hidden">
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="w-full p-2 flex items-center gap-2 hover:bg-slate-800/50 transition-colors text-left"
      >
        {expanded ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", 
          agent.status === "active" ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
          agent.status === "executing" ? "bg-cyan-500 animate-pulse" :
          agent.status === "evaluating" ? "bg-amber-500" : "bg-slate-600"
        )} />
        <span className="text-slate-300 truncate text-[10px] uppercase tracking-wider flex-1 font-sans font-medium">{agent.name}</span>
        <span className="text-slate-500 text-[10px]">
          {agent.successRate}% <span className="hidden sm:inline">Win Rate</span>
        </span>
      </button>
      
      {expanded && (
        <div className="p-2 border-t border-slate-800 bg-slate-950/50 text-[10px]">
          <div className="flex justify-between items-center mb-2 px-1 text-slate-400">
             <span>Task History</span>
             <span>Duration / Status</span>
          </div>
          <div className="space-y-1">
            {agent.history?.map((task) => (
              <div key={task.id} className="flex justify-between items-center p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-300 truncate opacity-90 pr-2">
                  <span className="text-slate-500 mr-2">[{new Date(task.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
                  {task.task}
                </span>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-slate-400 font-mono">{task.durationMs.toFixed(0)}ms</span>
                  <span className={cn("uppercase w-12 text-right", task.success ? "text-emerald-500" : "text-red-500")}>
                    {task.success ? 'SUCCESS' : 'FAILED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PayloadModal({ 
  isOpen, 
  onClose, 
  payload 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  payload: any 
}) {
  if (!isOpen || !payload) return null;

  const rawString = JSON.stringify(payload, null, 2);

  const highlightSegments = () => {
    const highlightRegex = /(Reasoning|Action|Backend Actions Executed|Findings|Risk Analysis|Recommendations|Agent Routing|Safety Notes)/gi;
    
    // Split by regex to capture the keywords
    const parts = rawString.split(highlightRegex);
    return parts.map((part, i) => {
      if (part.match(highlightRegex)) {
        return <span key={i} className="bg-amber-500/20 text-amber-300 font-bold px-1 rounded mx-[1px]">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
           <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2 font-sans">
             <Code className="w-4 h-4 text-emerald-500" />
             Raw Orchestration Payload
           </h3>
           <button onClick={onClose} type="button" className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer">
              <X className="w-4 h-4" />
           </button>
        </div>
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 bg-[#0a0f1c] font-mono text-xs">
           <pre className="text-slate-300 whitespace-pre-wrap break-words leading-relaxed opacity-90">
              {highlightSegments()}
           </pre>
        </div>
      </div>
    </div>
  );
}

export function AgentWorkflowTerminal({ logs, agents }: { logs: ActionLog[], agents: AgentStatus[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [command, setCommand] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [modalPayload, setModalPayload] = useState<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isExecuting]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim() || isExecuting) return;

    setIsExecuting(true);
    const userPrompt = command;
    setCommand("");

    try {
      // Use the newly created HERMES/NEMOCLAW backend orchestration endpoint
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        console.error("Orchestration Error:", data);
      }
      setModalPayload(data);
    } catch (error: any) {
      console.error(error);
      setModalPayload({ error: error.message || "Failed to connect to the orchestration backend." });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden flex flex-col h-full font-mono text-xs">
       <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
        <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2 font-sans">
          <Terminal className="w-4 h-4 text-cyan-500" />
          Autonomous Execution Log & Command Node
        </h3>
       </div>

       {/* Agents Status Bar */}
       <div className="p-2 border-b border-slate-800 bg-slate-900/40">
         <div className="flex justify-between items-center px-1 mb-2">
            <span className="text-slate-500 text-[10px] uppercase font-sans font-medium tracking-wider">Agents Fleet</span>
            <span className="text-slate-500 text-[10px] uppercase font-sans">Status</span>
         </div>
         <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
           {agents.map(agent => (
             <AgentListItem key={agent.id} agent={agent} />
           ))}
         </div>
       </div>

       {/* Log Stream */}
       <div ref={scrollRef} className="p-4 overflow-y-auto flex-1 space-y-1.5 custom-scrollbar bg-[#0a0f1c]">
          {logs.map((log) => (
             <div key={log.id} className="flex gap-3 leading-tight opacity-90 animate-in fade-in slide-in-from-bottom-2">
               <span className="text-slate-500 shrink-0">
                 [{new Date(log.timestamp).toLocaleTimeString()}]
               </span>
               <span className={cn("shrink-0 uppercase w-16", 
                  log.type === "autonomous" ? "text-cyan-400" : "text-amber-400"
               )}>
                 {log.type === "autonomous" ? "EXEC" : "RECOM"}
               </span>
               <span className={cn("flex-1", 
                 log.status === "failed" ? "text-red-400" : "text-slate-300"
               )}>
                 {log.action}
               </span>
               <span className={cn("shrink-0 uppercase",
                  log.status === "success" ? "text-emerald-500" :
                  log.status === "failed" ? "text-red-500" : "text-amber-500 animate-pulse"
               )}>
                 [{log.status}]
               </span>
             </div>
          ))}
          {isExecuting && (
            <div className="flex gap-3 leading-tight mt-2 opacity-70">
                <span className="text-slate-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                <span className="shrink-0 uppercase w-16 text-cyan-400">ORCH</span>
                <span className="flex-1 text-cyan-300 animate-pulse">HERMES/NEMOCLAW is processing your request via Multi-LLM routing...</span>
                <span className="shrink-0 uppercase text-amber-500 animate-pulse">[WAIT]</span>
            </div>
          )}
          <div className="flex gap-3 leading-tight mt-2 opacity-50">
              <span className="text-emerald-500 animate-pulse">_</span>
          </div>
       </div>

       {/* Command Input Area */}
       <form onSubmit={handleCommandSubmit} className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center gap-3">
          <span className="text-cyan-500 font-bold ml-1">{'>'}</span>
          <input 
            type="text" 
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={isExecuting}
            placeholder="Instruct HERMES orchestration engine..."
            className="flex-1 bg-transparent border-none text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0 disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={isExecuting || !command.trim()}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 disabled:opacity-50 transition-colors"
          >
             <Send className="w-4 h-4" />
          </button>
       </form>
       
       <PayloadModal 
         isOpen={!!modalPayload} 
         onClose={() => setModalPayload(null)} 
         payload={modalPayload} 
       />
    </div>
  )
}
