export type Severity = "critical" | "high" | "medium" | "low" | "info";

export interface Anomaly {
  id: string;
  timestamp: string;
  type: string;
  severity: Severity;
  rootCause: string;
  confidence: number;
  reasoning: string;
}

export interface ClusterNode {
  id: string;
  name: string;
  status: "healthy" | "degraded" | "critical" | "offline";
  role: "worker" | "control-plane";
  load: number;
}

export interface MetricPoint {
  time: string;
  gpuUtilization: number;
  cpuUtilization: number;
  memoryUsage: number;
  inferenceLatency: number;
  gpuTemp: number;
}

export interface AgentTaskHistory {
  id: string;
  task: string;
  durationMs: number;
  success: boolean;
  timestamp: string;
}

export interface AgentStatus {
  id: string;
  name: string;
  status: "active" | "idle" | "evaluating" | "executing";
  lastAction: string;
  successRate: number;
  history: AgentTaskHistory[];
}

export interface SystemStatus {
  clusterHealth: "healthy" | "degraded" | "critical";
  activeIncidents: number;
  riskLevel: number;
  uptime: string;
}

export interface ActionLog {
  id: string;
  timestamp: string;
  action: string;
  type: "autonomous" | "recommendation";
  status: "success" | "pending" | "failed";
}
