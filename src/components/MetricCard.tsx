import { Activity, AlertTriangle, CheckCircle2, Cpu, Database, HardDrive, Info, Network, Server, Shield, BrainCircuit } from "lucide-react";
import { cn } from "../lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  icon: keyof typeof ICONS;
  status?: "normal" | "warning" | "critical";
  className?: string;
}

const ICONS = {
  cpu: Cpu,
  gpu: Database,
  network: Network,
  server: Server,
  shield: Shield,
  alert: AlertTriangle,
  activity: Activity,
  success: CheckCircle2,
  info: Info,
  memory: HardDrive,
  brain: BrainCircuit,
};

export function MetricCard({ title, value, subtitle, trend, icon, status = "normal", className }: MetricCardProps) {
  const Icon = ICONS[icon];

  return (
    <div className={cn("p-4 rounded-xl border bg-slate-900/50 backdrop-blur-sm relative overflow-hidden", 
      status === "normal" && "border-slate-800",
      status === "warning" && "border-amber-500/50 bg-amber-500/5",
      status === "critical" && "border-red-500/50 bg-red-500/5",
      className
    )}>
      {/* Decorative gradient blob */}
      <div className={cn("absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-20",
        status === "normal" && "bg-emerald-500",
        status === "warning" && "bg-amber-500",
        status === "critical" && "bg-red-500",
      )} />

      <div className="flex justify-between items-start mb-2 relative z-10">
        <h3 className="text-slate-400 font-medium text-sm">{title}</h3>
        <div className={cn("p-2 rounded-lg", 
          status === "normal" && "bg-slate-800 text-emerald-400",
          status === "warning" && "bg-amber-500/20 text-amber-500",
          status === "critical" && "bg-red-500/20 text-red-500",
        )}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="relative z-10">
        <div className="text-3xl font-semibold text-slate-100 font-mono tracking-tight">{value}</div>
        {(subtitle || trend !== undefined) && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {trend !== undefined && (
              <span className={cn("font-medium font-mono", trend >= 0 ? "text-emerald-400" : "text-red-400")}>
                {trend > 0 && '+'}{trend}%
              </span>
            )}
            {subtitle && <span className="text-slate-500">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
