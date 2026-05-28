import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { MetricPoint } from "../types";

interface TelemetryChartProps {
  data: MetricPoint[];
  dataKey: keyof MetricPoint;
  color: string;
  className?: string;
  title: string;
  unit?: string;
}

export function TelemetryChart({ data, dataKey, color, className, title, unit = "%" }: TelemetryChartProps) {
  return (
    <div className={`p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm ${className || ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-slate-300">{title}</h3>
        <div className="flex items-center gap-2">
           <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{ backgroundColor: color }}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2`} style={{ backgroundColor: color }}></span>
          </span>
          <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">Live</span>
        </div>
      </div>
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={10} 
              tickMargin={10} 
              tick={{fill: '#64748b'}}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickFormatter={(val) => `${val}${unit}`}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', fontSize: '12px', color: '#f1f5f9' }}
              itemStyle={{ color: color }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey as string} 
              stroke={color} 
              strokeWidth={2} 
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: '#0f172a', strokeWidth: 2 }}
              isAnimationActive={false} // Disable animation for real-time feel
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
