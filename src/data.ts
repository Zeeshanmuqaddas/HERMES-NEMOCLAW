import { Anomaly, MetricPoint, AgentStatus, ActionLog, ClusterNode } from "./types";

export const initialNodes: ClusterNode[] = Array.from({ length: 24 }, (_, i) => ({
  id: `node-${i}`,
  name: `crusoe-node-${String(i).padStart(2, '0')}`,
  status: i === 4 ? "critical" : Math.random() > 0.9 ? "degraded" : "healthy",
  role: i < 3 ? "control-plane" : "worker",
  load: 30 + Math.random() * 40,
}));

export const initialMetrics: MetricPoint[] = Array.from({ length: 20 }, (_, i) => ({
  time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  gpuUtilization: 40 + Math.random() * 40,
  cpuUtilization: 30 + Math.random() * 30,
  memoryUsage: 50 + Math.random() * 20,
  inferenceLatency: 15 + Math.random() * 10,
  gpuTemp: 60 + Math.random() * 20,
}));

export const generateNextMetric = (lastMetric: MetricPoint): MetricPoint => {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  // Random walk for metrics
  const walk = (val: number, min: number, max: number, maxChange: number) => {
    let newVal = val + (Math.random() * maxChange * 2 - maxChange);
    return Math.max(min, Math.min(newVal, max));
  };

  return {
    time,
    gpuUtilization: walk(lastMetric.gpuUtilization, 10, 95, 5),
    cpuUtilization: walk(lastMetric.cpuUtilization, 10, 90, 4),
    memoryUsage: walk(lastMetric.memoryUsage, 20, 85, 2),
    inferenceLatency: walk(lastMetric.inferenceLatency, 10, 100, 5),
    gpuTemp: walk(lastMetric.gpuTemp, 40, 95, 3),
  };
};

export const initialAnomalies: Anomaly[] = [
  {
    id: "ANM-001",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: "Memory Leak Detected",
    severity: "high",
    rootCause: "Agentic DAG Orchestrator process retaining stale tensor objects.",
    confidence: 0.92,
    reasoning: "Correlated memory pressure on Node pool 'inference-alpha' with increasing OOM kills in LangGraph worker pods.",
  },
  {
    id: "ANM-002",
    timestamp: new Date(Date.now() - 1500000).toISOString(),
    type: "Inference Latency Spike",
    severity: "medium",
    rootCause: "GPU thermal throttling on crusoe-node-04.",
    confidence: 0.88,
    reasoning: "Observed T4 GPU temp > 85C coinciding with 400% increase in p99 inference latency for Nemotron model.",
  }
];

const generateHistory = (successProb: number) => {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `HIST-${Math.floor(Math.random() * 10000)}`,
    task: ["Execute query", "Analyze logs", "Scale pod", "Profile memory", "Compute embeddings"][Math.floor(Math.random() * 5)],
    durationMs: 200 + Math.random() * 1800,
    success: Math.random() < successProb,
    timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
  })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const initialAgents: AgentStatus[] = [
  { id: "A1", name: "Supervisor Agent", status: "active", lastAction: "Coordinating multi-agent workflow", successRate: 98.5, history: generateHistory(0.98) },
  { id: "A2", name: "DevOps Monitoring", status: "executing", lastAction: "Scaling GPU nodes", successRate: 94.2, history: generateHistory(0.94) },
  { id: "A3", name: "Kubernetes Intel", status: "idle", lastAction: "Analyzed ingress traffic", successRate: 99.1, history: generateHistory(0.99) },
  { id: "A4", name: "ML Pipeline", status: "active", lastAction: "Validating Nemotron outputs", successRate: 88.4, history: generateHistory(0.88) },
  { id: "A5", name: "Security Intel", status: "evaluating", lastAction: "Scanning auth logs", successRate: 95.7, history: generateHistory(0.95) },
  { id: "A6", name: "Incident Response", status: "idle", lastAction: "Restarted failed worker", successRate: 91.3, history: generateHistory(0.91) },
  { id: "A7", name: "Predictive Analytics", status: "active", lastAction: "Forecasting capacity", successRate: 97.6, history: generateHistory(0.97) },
];

export const initialLogs: ActionLog[] = [
  { id: "LOG-1", timestamp: new Date(Date.now() - 1400000).toISOString(), action: "Rerouted traffic away from crusoe-node-04", type: "autonomous", status: "success" },
  { id: "LOG-2", timestamp: new Date(Date.now() - 1350000).toISOString(), action: "Recommend isolating crusoe-node-04 for diagnostics", type: "recommendation", status: "pending" },
  { id: "LOG-3", timestamp: new Date(Date.now() - 3500000).toISOString(), action: "Restarted Agentic DAG container to clear memory", type: "autonomous", status: "success" },
];

export const generateRandomLog = (): ActionLog => {
  const actions = [
    "Scaling up inference replicas",
    "Optimizing GPU workload distribution",
    "Analyzing anomalous network spike",
    "Validating model drift metrics",
    "Checking namespace health",
    "Polling cluster metrics",
  ];
  return {
    id: `LOG-${Math.floor(Math.random()*10000)}`,
    timestamp: new Date().toISOString(),
    action: actions[Math.floor(Math.random() * actions.length)],
    type: "autonomous",
    status: Math.random() > 0.1 ? "success" : "pending"
  }
}
