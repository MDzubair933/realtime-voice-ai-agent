"use client";

import React, { useEffect, useRef } from "react";
import { User, Sparkles } from "lucide-react";

export interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

interface TranscriptFeedProps {
  messages: Message[];
}

export const TranscriptFeed: React.FC<TranscriptFeedProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="w-full max-w-xl h-44 overflow-y-auto px-4 py-3 rounded-2xl bg-[#0d1017]/70 border border-white/5 space-y-3 scrollbar-thin scrollbar-thumb-white/10"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-xs text-gray-500">
          Ready for speech. Press Start and speak into your microphone.
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 text-xs ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "assistant" && (
              <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400 mt-0.5">
                <Sparkles className="w-3 h-3" />
              </div>
            )}
            <div
              className={`max-w-[80%] px-3.5 py-2 rounded-2xl leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600/30 text-indigo-100 border border-indigo-500/30 rounded-tr-sm"
                  : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-sm"
              }`}
            >
              <p>{msg.text}</p>
              <span className="block text-[9px] text-gray-400 mt-1 text-right">
                {msg.timestamp}
              </span>
            </div>
            {msg.sender === "user" && (
              <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 mt-0.5">
                <User className="w-3 h-3" />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
