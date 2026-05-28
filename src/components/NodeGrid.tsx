import { ClusterNode } from "../types";
import { cn } from "../lib/utils";
import { Server, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

interface NodeGridProps {
  nodes: ClusterNode[];
}

export function NodeGrid({ nodes }: NodeGridProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden flex flex-col h-full">
      <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
        <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2 font-sans">
          <Server className="w-4 h-4 text-emerald-500" />
          Cluster Topology
        </h3>
        <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
          {nodes.length} NODES
        </span>
      </div>
      <div className="p-4 overflow-y-auto flex-1 bg-[#0a0f1c] custom-scrollbar">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-2">
          {nodes.map((node) => (
            <div 
              key={node.id} 
              className={cn(
                "group relative aspect-square rounded-md border flex items-center justify-center transition-all cursor-crosshair",
                node.status === "healthy" ? "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50" :
                node.status === "degraded" ? "bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60" :
                node.status === "critical" ? "bg-red-500/10 border-red-500/40 hover:border-red-500/70" :
                "bg-slate-800/20 border-slate-700 hover:border-slate-500"
              )}
            >
              <div className="flex flex-col items-center">
                 {node.status === "healthy" ? <CheckCircle2 className="w-4 h-4 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" /> :
                  node.status === "degraded" ? <AlertTriangle className="w-4 h-4 text-amber-500/70 group-hover:text-amber-400 transition-colors" /> :
                  node.status === "critical" ? <ShieldAlert className="w-4 h-4 text-red-500/70 group-hover:text-red-400 animate-pulse transition-colors" /> :
                  <Server className="w-4 h-4 text-slate-500 group-hover:text-slate-400 transition-colors" />}
              </div>
              
              {/* Tooltip */}
              <div className="absolute inset-x-0 -top-12 hidden group-hover:block z-50 pointer-events-none">
                <div className="bg-slate-800 text-xs rounded px-2 py-1 shadow-xl border border-slate-700 w-max mx-auto translate-y-1">
                  <div className="font-mono text-slate-200">{node.name}</div>
                  <div className="text-slate-400">Load: {node.load.toFixed(0)}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
