import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { HERMES_NEMOCLAW_PROMPT, HERMES_RESILIENCE_X_PROMPT } from "./server-prompt";

dotenv.config();

// Initialize Google Gen AI
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
} else {
  console.warn("GEMINI_API_KEY not found in environment. AI route will fail if called.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routing for the Agentic AI Orchestration System
  app.post("/api/orchestrate", async (req, res) => {
    try {
      if (!ai) {
        throw new Error("GEMINI_API_KEY is not configured.");
      }

      const { userPrompt } = req.body;
      
      if (!userPrompt) {
        return res.status(400).json({ error: "userPrompt is required" });
      }

      let responseText = "";
      let metadata = { provider: "gemini", status: "success" };

      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-pro",
          contents: userPrompt,
          config: {
            systemInstruction: HERMES_NEMOCLAW_PROMPT,
          }
        });
        responseText = response.text || "";
      } catch (primaryError: any) {
        console.error("[Circuit Breaker] Primary LLM failed:", primaryError.message);
        
        // Resilience Check / Fallback Mode (Graceful Degradation)
        metadata = { provider: "gemini-fallback", status: "degraded" };
        
        try {
          if (!ai) throw new Error("Fallback failed due to missing client.");
          // Attempt an intelligent recovery analysis using the Resilience-X prompt
          const fallbackResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash", // Using lightweight model as fallback
            contents: `[INCIDENT] Primary LLM (gemini-2.5-pro) failed processing request: "${userPrompt}". Error: ${primaryError.message}. Generate an incident report and execute gracefully degraded response.`,
            config: {
              systemInstruction: HERMES_RESILIENCE_X_PROMPT,
            }
          });
          responseText = fallbackResponse.text || "[RESILIENCE SYSTEM] Empty response from fallback.";
        } catch (secondaryError) {
          metadata = { provider: "static-cache", status: "critical-failure" };
          responseText = `[EMERGENCY FALLBACK ACTIVATED]
The orchestration layer experienced a complete intelligence failure. Both primary and secondary LLM providers are unreachable.

1. Objective
Fulfill user request: "${userPrompt}"

2. Agent Routing
[Fallback] Monitoring Agent (Auto-Recovery)

3. LLM Allocation
[Fallback] Static Baseline Cache (Graceful Degradation)

4. Findings
Circuit breaker is fully OPEN. Hard fallback engaged.

5. Analysis
The system is operating in a critical degraded mode to ensure basic availability.

6. Recommendations
Monitor system telemetry. Wait for provider stabilization.

7. Risks & Limitations
Responses are completely static.

8. Confidence Score
0.0

9. Final Summary
System is in a critical degraded state. Hard resilience workflows triggered.`;
        }
      }

      res.json({
        success: true,
        response: responseText,
        metadata: metadata
      });

    } catch (error: any) {
      console.error("Orchestration Error:", error);
      res.status(500).json({
         success: false, 
         error: error.message || "An internal error occurred during orchestration."
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "HERMES/NEMOCLAW Backend Online" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HERMES/NEMOCLAW Server running on http://localhost:${PORT}`);
  });
}

startServer();
