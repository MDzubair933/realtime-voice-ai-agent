"use client";

import React from "react";
import { Activity, Zap, Clock, ShieldCheck } from "lucide-react";

interface LatencyMetrics {
  vadMs: number;
  transportMs: number;
  inferenceMs: number;
  ttsMs: number;
  totalTurnaroundMs: number;
}

interface LatencyMonitorProps {
  metrics: LatencyMetrics;
}

export const LatencyMonitor: React.FC<LatencyMonitorProps> = ({ metrics }) => {
  const isOptimal = metrics.totalTurnaroundMs < 800;

  return (
    <div className="w-full max-w-md p-4 rounded-2xl bg-[#11141c]/80 border border-white/5 backdrop-blur-sm">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold tracking-wider uppercase text-gray-400">
            Real-Time Latency Breakdown
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Zap className="w-3 h-3 text-indigo-400" />
          <span>{metrics.totalTurnaroundMs}ms</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {/* VAD Silence Window */}
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            VAD Trim
          </p>
          <p className="text-sm font-mono font-semibold text-gray-200">
            {metrics.vadMs}ms
          </p>
        </div>

        {/* Transport Ping */}
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Transport
          </p>
          <p className="text-sm font-mono font-semibold text-emerald-400">
            {metrics.transportMs}ms
          </p>
        </div>

        {/* Inference TTFT */}
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Inference
          </p>
          <p className="text-sm font-mono font-semibold text-cyan-400">
            {metrics.inferenceMs}ms
          </p>
        </div>

        {/* TTS First Chunk */}
        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
            Audio TTS
          </p>
          <p className="text-sm font-mono font-semibold text-purple-400">
            {metrics.ttsMs}ms
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 flex items-center justify-between text-[11px] text-gray-500 border-t border-white/5">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-gray-400" />
          Budget: &lt;800ms
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          {isOptimal ? "Sub-second budget achieved" : "Degraded network"}
        </span>
      </div>
    </div>
  );
};
