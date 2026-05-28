import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { AgentStatus } from "../types";
import { Activity } from "lucide-react";

interface AgentHeatmapProps {
  agents: AgentStatus[];
}

export function AgentHeatmap({ agents }: AgentHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || agents.length === 0) return;

    // Generate mock data for the last 24 hours
    const currentHour = new Date().getHours();
    const data: { agent: string; hour: number; intensity: number; successRate: number }[] = [];
    
    agents.forEach((agent) => {
      for (let i = 0; i < 24; i++) {
        const hour = (currentHour - 23 + i + 24) % 24;
        // Base intensity and success
        const baseIntensity = Math.random() * 100;
        const successRate = Math.min(100, Math.max(0, agent.successRate + (Math.random() * 20 - 10)));
        
        data.push({
          agent: agent.name,
          hour: hour,
          intensity: baseIntensity,
          successRate: successRate / 100 // mapped 0 to 1
        });
      }
    });

    // Clear previous SVG
    d3.select(containerRef.current).selectAll("*").remove();

    const parentNode = containerRef.current;
    if (!parentNode) return;

    // Use getBoundingClientRect to ensure we have actual dimensions, default to 300 if too small
    const rect = parentNode.getBoundingClientRect();
    const width = Math.max(rect.width, 300);
    const height = Math.max(rect.height || 250, 250); 
    const margin = { top: 20, right: 30, bottom: 30, left: 120 };
    
    // Check if the area is too small for rendering
    if (width <= margin.left + margin.right) return;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis (Hours)
    const sortedHours = Array.from({ length: 24 }, (_, i) => (currentHour - 23 + i + 24) % 24);
    
    const x = d3
      .scaleBand()
      .range([0, innerWidth])
      .domain(sortedHours.map(String))
      .padding(0.08);

    const xAxis = svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(x)
          .tickFormat((d, i) => (i % 3 === 0 ? `${d}:00` : ""))
      );
      
    xAxis.select(".domain").remove();
    xAxis.selectAll("line").remove();
    xAxis.selectAll("text").attr("class", "text-[10px] font-mono fill-slate-500");

    // Y axis (Agents)
    const y = d3
      .scaleBand()
      .range([0, innerHeight])
      .domain(agents.map(d => d.name))
      .padding(0.1);

    const yAxis = svg
      .append("g")
      .call(d3.axisLeft(y).tickSize(0));
      
    yAxis.select(".domain").remove();
    yAxis.selectAll("text")
      .attr("class", "text-[10px] font-sans font-medium fill-slate-400")
      .attr("dx", "-5");

    // Color scale for heatmap based on success rate (using emerald for high success, amber/red for lower)
    const colorScale = d3
      .scaleSequential(
        (t) => d3.interpolateCool(t * 0.8) // Nice tech/cool scale
      )
      .domain([0, 1]);

    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .attr("class", "absolute opacity-0 bg-slate-900 border border-slate-700 rounded-md p-2 text-xs font-mono text-slate-200 pointer-events-none z-10 transition-opacity drop-shadow-xl");

    // Draw cells
    svg
      .selectAll("rect.cell")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("x", (d) => x(String(d.hour))!)
      .attr("y", (d) => y(d.agent)!)
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .attr("rx", 2)
      .style("fill", (d) => colorScale(d.successRate))
      .style("opacity", (d) => 0.4 + (d.intensity / 100) * 0.6) // Opacity encodes intensity
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget)
          .style("stroke", "#06b6d4")
          .style("stroke-width", 2);
        
        tooltip.html(`
          <div class="mb-1 font-bold font-sans text-emerald-400">${d.agent}</div>
          <div class="flex justify-between gap-4">
            <span class="text-slate-500">Time:</span>
            <span>${d.hour}:00</span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-slate-500">Success:</span>
            <span class="${d.successRate > 0.9 ? 'text-emerald-400' : d.successRate > 0.8 ? 'text-amber-400' : 'text-red-400'}">${(d.successRate * 100).toFixed(1)}%</span>
          </div>
          <div class="flex justify-between gap-4">
            <span class="text-slate-500">Load:</span>
            <span>${d.intensity.toFixed(0)}</span>
          </div>
        `)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 40}px`)
          .style("opacity", 1);
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).style("stroke", "none");
        tooltip.style("opacity", 0);
      });

  }, [agents]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950/80 shrink-0">
        <h3 className="text-sm font-medium text-slate-200 flex items-center gap-2 font-sans">
          <Activity className="w-4 h-4 text-emerald-500" />
          Agent Telemetry (24h)
        </h3>
        <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500">
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[url('https://raw.githubusercontent.com/d3/d3-scale-chromatic/master/img/cool.png')] " style={{background: 'linear-gradient(to right, rgb(110, 64, 170), rgb(26, 199, 194))'}}></span> Success</span>
           <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-slate-400/40"></span> Intensity (Opacity)</span>
        </div>
      </div>
      <div className="flex-1 relative w-full h-full min-h-[250px] p-2" ref={containerRef}>
      </div>
    </div>
  );
}
