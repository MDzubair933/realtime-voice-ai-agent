"use client";

import React, { useEffect, useRef } from "react";

interface VoiceVisualizerProps {
  isActive: boolean;
  volume: number; // 0.0 to 1.0 real-time audio energy
  mode: "listening" | "thinking" | "speaking" | "idle";
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isActive,
  volume,
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
    let smoothedVol = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Smooth volume transitions
      smoothedVol += (volume - smoothedVol) * 0.15;
      const baseRadius = 75 + smoothedVol * 45;

      // Color scheme based on active state
      let primaryColor = "rgba(99, 102, 241, 0.9)"; // Indigo
      let secondaryColor = "rgba(168, 85, 247, 0.6)"; // Purple
      let coreGlow = "rgba(99, 102, 241, 0.35)";

      if (mode === "speaking") {
        primaryColor = "rgba(56, 189, 248, 0.95)"; // Sky blue
        secondaryColor = "rgba(168, 85, 247, 0.8)";
        coreGlow = "rgba(56, 189, 248, 0.4)";
      } else if (mode === "thinking") {
        primaryColor = "rgba(251, 191, 36, 0.9)"; // Gold
        secondaryColor = "rgba(249, 115, 22, 0.7)";
        coreGlow = "rgba(251, 191, 36, 0.3)";
      } else if (mode === "listening") {
        primaryColor = "rgba(52, 211, 153, 0.95)"; // Emerald
        secondaryColor = "rgba(14, 165, 233, 0.7)";
        coreGlow = "rgba(52, 211, 153, 0.4)";
      }

      // Draw glowing central orb core
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        baseRadius * 0.8
      );
      coreGradient.addColorStop(0, coreGlow);
      coreGradient.addColorStop(1, "transparent");

      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Draw multi-layered organic oscillating sound waves
      const waves = 5;
      for (let w = 0; w < waves; w++) {
        ctx.beginPath();
        const numPoints = 140;
        const waveOffset = (w * Math.PI) / waves;
        const currentAmp = isActive ? 10 + smoothedVol * 50 : 2;

        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const harmonic1 = Math.sin(angle * 4 + phase + waveOffset * 2);
          const harmonic2 = Math.cos(angle * 3 - phase * 0.8);
          const noise = (harmonic1 + harmonic2 * 0.5) * currentAmp;
          const r = baseRadius + noise + w * 4;
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
        ctx.lineWidth = 2.2 + smoothedVol * 1.5;
        ctx.stroke();
      }

      phase += isActive ? 0.04 + smoothedVol * 0.08 : 0.015;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isActive, volume, mode]);

  return (
    <div className="relative flex items-center justify-center w-80 h-80 my-2">
      {/* Dynamic ambient backdrop glow */}
      <div
        className={`absolute inset-0 rounded-full blur-3xl transition-all duration-500 pointer-events-none ${
          isActive
            ? mode === "speaking"
              ? "bg-sky-500/25 scale-110"
              : mode === "thinking"
              ? "bg-amber-500/20 scale-105"
              : "bg-emerald-500/25 scale-110"
            : "bg-indigo-500/10 scale-90"
        }`}
      />
      <canvas
        ref={canvasRef}
        width={360}
        height={360}
        className="relative z-10 w-full h-full"
      />
    </div>
  );
};
