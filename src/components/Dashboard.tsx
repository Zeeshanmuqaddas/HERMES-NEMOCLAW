import { useState, useEffect } from "react";
import { MetricCard } from "./MetricCard";
import { TelemetryChart } from "./TelemetryChart";
import { AnomalyLog, AgentWorkflowTerminal } from "./AnomalyLog";
import { NodeGrid } from "./NodeGrid";
import { initialMetrics, initialAnomalies, initialAgents, initialLogs, generateNextMetric, generateRandomLog, initialNodes } from "../data";
import { Activity, ShieldCheck, Cpu, LogOut } from "lucide-react";

import { AgentWorkflowGraph } from "./AgentWorkflowGraph";
import { AgentHeatmap } from "./AgentHeatmap";

interface DashboardProps {
  onLogout?: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [logs, setLogs] = useState(initialLogs);
  const [nodes, setNodes] = useState(initialNodes);
  
  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(current => {
        const next = [...current.slice(1), generateNextMetric(current[current.length - 1])];
        return next;
      });

      setNodes(current => current.map(node => ({
        ...node,
        load: Math.max(0, Math.min(100, node.load + (Math.random() * 6 - 3)))
      })));

      // Randomly occasionally add a log
      if (Math.random() > 0.7) {
        setLogs(current => [...current.slice(-40), generateRandomLog()]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestMetric = metrics[metrics.length - 1];

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 lg:p-8 text-slate-200">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                <Cpu className="w-5 h-5 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-100">HERMES / NEMOCLAW</h1>
            </div>
            <p className="text-sm text-slate-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              CRUSOE CLOUD · NVIDIA NEMOTRON · AUTONOMOUS AGENT RUNTIME
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 rounded-lg p-2 px-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium">System Risk:</span>
              <span className="text-sm font-mono text-emerald-400">LOW</span>
            </div>
            <div className="w-px h-4 bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-medium">Active Agents:</span>
              <span className="text-sm font-mono text-cyan-400">7/7</span>
            </div>
            {onLogout && (
              <>
                <div className="w-px h-4 bg-slate-800 hidden md:block"></div>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-md py-1 px-2 transition-colors group ml-2"
                >
                  <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium uppercase tracking-wider hidden sm:block">Logout</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Top KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            title="Cluster Health" 
            value="DEGRADED" 
            icon="server" 
            status="warning"
            subtitle="crusoe-node-04 unstable" 
          />
          <MetricCard 
            title="Global GPU Utilization" 
            value={`${latestMetric.gpuUtilization.toFixed(1)}%`} 
            icon="gpu" 
            trend={+2.4}
            status={latestMetric.gpuUtilization > 85 ? "critical" : "normal"}
          />
          <MetricCard 
            title="Network Ingress" 
            value="4.2 TB/s" 
            icon="network" 
            status="normal"
            trend={-0.8}
            subtitle="Stable routing"
          />
          <MetricCard 
            title="Avg. Inference Latency" 
            value={`${latestMetric.inferenceLatency.toFixed(1)}ms`}
            icon="activity" 
            status={latestMetric.inferenceLatency > 50 ? "warning" : "normal"}
            trend={+12.5}
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:h-[800px]">
          {/* Left Column: Anomalies & Nodes */}
          <div className="col-span-1 flex flex-col gap-6 h-full min-h-0">
            <div className="flex-[3] min-h-0">
               <AnomalyLog anomalies={initialAnomalies} />
            </div>
            <div className="flex-[4] min-h-0">
               <NodeGrid nodes={nodes} />
            </div>
          </div>

          {/* Middle & Right Column: Telemetry & Terminal & Heatmap */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6 h-full min-h-0">
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 shrink-0">
               <TelemetryChart 
                 title="GPU Util" 
                 data={metrics} 
                 dataKey="gpuUtilization" 
                 color="#06b6d4" // cyan-500
               />
               <TelemetryChart 
                 title="GPU Temp" 
                 data={metrics} 
                 dataKey="gpuTemp" 
                 color="#ef4444" // red-500
                 unit="°C"
               />
               <TelemetryChart 
                 title="CPU Util" 
                 data={metrics} 
                 dataKey="cpuUtilization" 
                 color="#3b82f6" // blue-500
               />
               <TelemetryChart 
                 title="Memory Usage" 
                 data={metrics} 
                 dataKey="memoryUsage" 
                 color="#a855f7" // purple-500
                 unit="%"
               />
               <TelemetryChart 
                 title="p99 Latency" 
                 data={metrics} 
                 dataKey="inferenceLatency" 
                 color="#8b5cf6" // violet-500
                 unit="ms"
               />
            </div>
            {/* Terminal and Graph Row */}
            <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-2 gap-6">
               <AgentWorkflowGraph agents={initialAgents} />
               <AgentWorkflowTerminal logs={logs} agents={initialAgents} />
            </div>
            {/* Heatmap Row */}
            <div className="flex-1 min-h-0">
               <AgentHeatmap agents={initialAgents} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Global CSS adjustments for scrollbar specific to this app look */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.8); 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 1); 
        }
      `}</style>
    </div>
  );
}
