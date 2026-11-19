"use client";

import React, { useEffect, useRef } from "react";

interface VoiceVisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
  mode: "listening" | "thinking" | "speaking" | "idle";
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isActive,
  isSpeaking,
  mode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 80;

      // Color scheme based on active state
      let primaryColor = "rgba(99, 102, 241, 0.8)"; // Indigo
      let secondaryColor = "rgba(168, 85, 247, 0.5)"; // Purple

      if (mode === "speaking") {
        primaryColor = "rgba(59, 130, 246, 0.9)"; // Cyan/Blue
        secondaryColor = "rgba(147, 51, 234, 0.7)";
      } else if (mode === "thinking") {
        primaryColor = "rgba(234, 179, 8, 0.8)"; // Yellow/Amber
        secondaryColor = "rgba(249, 115, 22, 0.5)";
      } else if (mode === "listening") {
        primaryColor = "rgba(34, 197, 94, 0.8)"; // Emerald
        secondaryColor = "rgba(16, 185, 129, 0.5)";
      }

      // Draw multi-layered organic oscillating waves
      const waves = 4;
      for (let w = 0; w < waves; w++) {
        ctx.beginPath();
        const numPoints = 120;
        const waveOffset = (w * Math.PI) / waves;

        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const amp = isActive ? (isSpeaking ? 16 : 8) : 2;
          const noise =
            Math.sin(angle * 5 + phase + waveOffset) *
            Math.cos(angle * 3 - phase) *
            amp;
          const r = baseRadius + noise + w * 6;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();
        ctx.strokeStyle = w % 2 === 0 ? primaryColor : secondaryColor;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      phase += isActive ? 0.04 : 0.01;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, isSpeaking, mode]);

  return (
    <div className="relative flex items-center justify-center w-72 h-72">
      {/* Outer ambient glow */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
          isActive ? "glow-active bg-indigo-500/20" : "glow-orb bg-indigo-500/10"
        }`}
      />
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="relative z-10 w-full h-full"
      />
    </div>
  );
};
