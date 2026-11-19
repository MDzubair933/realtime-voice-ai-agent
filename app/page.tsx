"use client";

import React, { useState } from "react";
import { VoiceVisualizer } from "@/components/VoiceVisualizer";
import { ControlBar } from "@/components/ControlBar";
import { LatencyMonitor } from "@/components/LatencyMonitor";
import { TranscriptFeed, Message } from "@/components/TranscriptFeed";
import { Github, Volume2, Cpu, Globe, ExternalLink } from "lucide-react";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "assistant",
      text: "Hello! I am your real-time Voice AI agent. Connect and speak to test sub-800ms latency streaming.",
      timestamp: "12:00:00",
    },
  ]);

  const metrics = {
    vadMs: 115,
    transportMs: 38,
    inferenceMs: 295,
    ttsMs: 142,
    totalTurnaroundMs: 590,
  };

  const handleToggleConnection = () => {
    if (isConnected) {
      setIsConnected(false);
      setMode("idle");
    } else {
      setIsConnected(true);
      setMode("listening");
      // Add simulated user interaction after 2.5s for instant demo experience
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "user",
            text: "Can you explain how we eliminate WebSocket head-of-line blocking?",
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
        setMode("thinking");

        setTimeout(() => {
          setMode("speaking");
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: "assistant",
              text: "By isolating audio packets over WebRTC datagrams rather than single TCP queues, packet drops no longer freeze subsequent audio frames.",
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);

          setTimeout(() => {
            setMode("listening");
          }, 4000);
        }, 600);
      }, 2500);
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-between min-h-screen px-4 py-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="w-full flex items-center justify-between pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight">
              Real-Time Voice AI Agent
            </h1>
            <p className="text-xs text-gray-400">
              Sub-800ms Bidirectional Streaming Architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/MDzubair933/realtime-voice-ai-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-200 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repo</span>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </a>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <section className="flex flex-col items-center justify-center my-auto py-10 space-y-8">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/5 border border-white/10 text-gray-300">
          <span
            className={`w-2 h-2 rounded-full ${
              mode === "speaking"
                ? "bg-blue-400 animate-ping"
                : mode === "listening"
                ? "bg-emerald-400 animate-pulse"
                : mode === "thinking"
                ? "bg-amber-400 animate-bounce"
                : "bg-gray-500"
            }`}
          />
          <span className="capitalize">{mode} mode</span>
        </div>

        {/* Audio Visualizer Orb */}
        <VoiceVisualizer
          isActive={isConnected}
          isSpeaking={mode === "speaking" || mode === "listening"}
          mode={mode}
        />

        {/* Live Conversation Transcript */}
        <TranscriptFeed messages={messages} />

        {/* Controls */}
        <ControlBar
          isConnected={isConnected}
          isMuted={isMuted}
          onToggleConnection={handleToggleConnection}
          onToggleMute={() => setIsMuted(!isMuted)}
        />
      </section>

      {/* Latency & Telemetry Footer */}
      <footer className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
        <LatencyMonitor metrics={metrics} />

        <div className="flex flex-col gap-1 text-right text-xs text-gray-500">
          <p className="flex items-center justify-end gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Optimized for AWS Bedrock &amp; Graviton</span>
          </p>
          <p className="flex items-center justify-end gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Built by Md Zubair (Zubair Systems)</span>
          </p>
        </div>
      </footer>
    </main>
  );
}
