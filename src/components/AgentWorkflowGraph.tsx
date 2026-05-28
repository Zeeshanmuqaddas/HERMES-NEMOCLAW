import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { AgentStatus } from "../types";
import { Network } from "lucide-react";
import { cn } from "../lib/utils";

interface AgentWorkflowGraphProps {
  agents: AgentStatus[];
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  status: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
}

export function AgentWorkflowGraph({ agents }: AgentWorkflowGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  
  useEffect(() => {
    if (!containerRef.current || agents.length === 0) return;

    // Fixed relationships for the pipeline
    const graphLinks: { source: string; target: string }[] = [
      { source: "A1", target: "A2" }, // Supervisor -> DevOps
      { source: "A1", target: "A3" }, // Supervisor -> K8s
      { source: "A1", target: "A4" }, // Supervisor -> ML
      { source: "A1", target: "A5" }, // Supervisor -> Security
      { source: "A2", target: "A6" }, // DevOps -> Incident Res
      { source: "A3", target: "A6" }, // K8s -> Incident Res
      { source: "A5", target: "A6" }, // Security -> Incident Res
      { source: "A4", target: "A7" }, // ML -> Predictive
      { source: "A6", target: "A7" }, // Incident Res -> Predictive
    ];

    const graphNodes: Node[] = agents.map(a => ({
      ...a,
      x: undefined,
      y: undefined
    }));

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 300;

    const simulation = d3.forceSimulation<Node>(graphNodes)
      .force("link", d3.forceLink<Node, Link>(graphLinks).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(40))
      .force("y", d3.forceY(height / 2).strength(0.1));

    simulation.on("tick", () => {
      setNodes([...simulation.nodes()]);
      setLinks([...graphLinks as Link[]]);
    });

    return () => {
      simulation.stop();
    };
  }, [agents]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "stroke-emerald-500 fill-emerald-500/10";
      case "executing": return "stroke-cyan-500 fill-cyan-500/10";
      case "evaluating": return "stroke-amber-500 fill-amber-500/10";
      default: return "stroke-slate-600 fill-slate-800/50";
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "active": return "text-emerald-400";
      case "executing": return "text-cyan-400";
      case "evaluating": return "text-amber-400";
      default: return "text-slate-400";
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/80 shrink-0">
        <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2 font-sans">
          <Network className="w-4 h-4 text-cyan-500" />
          Agent Dependency Graph
        </h3>
      </div>
      
      <div className="flex-1 relative bg-[#0a0f1c] overflow-hidden" ref={containerRef}>
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <marker id="arrow" viewBox="0 -5 10 10" refX="25" refY="0" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M0,-5L10,0L0,5" fill="#334155" />
            </marker>
          </defs>
          <g>
            {links.map((link, i) => {
              const source = link.source as Node;
              const target = link.target as Node;
              if (source.x === undefined || target.x === undefined) return null;
              
              return (
                <line
                  key={`link-${i}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke="#334155"
                  strokeWidth="1.5"
                  markerEnd="url(#arrow)"
                  className="opacity-60 hover:opacity-100 hover:stroke-cyan-500/50 transition-colors duration-300"
                />
              );
            })}
          </g>
          <g>
            {nodes.map(node => {
              if (node.x === undefined || node.y === undefined) return null;
              
              const isExecuting = node.status === "executing";
              
              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x},${node.y})`}
                  className="cursor-pointer group"
                >
                  <circle 
                    r="18" 
                    className={cn(
                      "stroke-2 transition-all duration-500", 
                      getStatusColor(node.status),
                      isExecuting ? "animate-pulse" : ""
                    )} 
                  />
                  {/* Subtle outer glow for active executing agents */}
                  {isExecuting && (
                     <circle r="24" className="fill-cyan-500/20 blur-sm animate-ping" />
                  )}
                  {/* Label background */}
                  <rect 
                    x="-40" 
                    y="22" 
                    width="80" 
                    height="18" 
                    rx="4" 
                    className="fill-slate-900/80 stroke-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" 
                  />
                  {/* Node label */}
                  <text 
                    y="34" 
                    textAnchor="middle" 
                    className="text-[9px] font-mono fill-slate-300 pointer-events-none drop-shadow-md select-none opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {node.name}
                  </text>
                  
                  {/* Center Dot or Initials */}
                  <text 
                    y="3" 
                    textAnchor="middle" 
                    className="text-[10px] font-bold fill-slate-400 select-none pointer-events-none"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
