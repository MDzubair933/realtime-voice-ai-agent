"use client";

import React from "react";
import { Mic, MicOff, PhoneOff, PhoneCall, Radio, Sliders } from "lucide-react";

interface ControlBarProps {
  isConnected: boolean;
  isMuted: boolean;
  onToggleConnection: () => void;
  onToggleMute: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isConnected,
  isMuted,
  onToggleConnection,
  onToggleMute,
}) => {
  return (
    <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-[#121620]/90 backdrop-blur-md border border-white/10 shadow-2xl">
      {/* Mute Button */}
      <button
        onClick={onToggleMute}
        disabled={!isConnected}
        className={`p-3 rounded-full transition-all duration-200 ${
          isMuted
            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            : "bg-white/5 text-gray-300 hover:bg-white/10"
        } ${!isConnected && "opacity-40 cursor-not-allowed"}`}
        title={isMuted ? "Unmute Microphone" : "Mute Microphone"}
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      {/* Main Connection Action */}
      <button
        onClick={onToggleConnection}
        className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg ${
          isConnected
            ? "bg-rose-600/90 hover:bg-rose-600 text-white shadow-rose-600/20"
            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-[1.02]"
        }`}
      >
        {isConnected ? (
          <>
            <PhoneOff className="w-5 h-5" />
            <span>End Call</span>
          </>
        ) : (
          <>
            <PhoneCall className="w-5 h-5" />
            <span>Start Voice Session</span>
          </>
        )}
      </button>

      {/* Live Stream Status Indicator */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-gray-400">
        <Radio
          className={`w-3.5 h-3.5 ${
            isConnected ? "text-emerald-400 animate-pulse" : "text-gray-500"
          }`}
        />
        <span>{isConnected ? "Live 48kHz" : "Idle"}</span>
      </div>
    </div>
  );
};
