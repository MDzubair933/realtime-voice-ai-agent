# ⚡ Real-Time Voice AI Agent

> **Sub-Second Bidirectional Voice Streaming Architecture with Next.js 15, Dynamic Audio Visualizer & Amazon Bedrock**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Bedrock_Streaming-FF9900?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/bedrock/)
[![Latency Target](https://img.shields.io/badge/Latency-<800ms_Budget-emerald?style=flat-square)](docs/ARCHITECTURE.md)

---

## 🎯 Overview

Most Voice AI applications suffer from awkward conversational lag (1.5s–3.0s total turnaround). This starter template demonstrates how to compress conversational roundtrip latency down to **sub-800ms (p50 ~590ms)** using:

1. **Adaptive Voice Activity Detection (VAD):** Trims trailing silence down to 110ms.
2. **Clause-Boundary Token Chunking:** Streams LLM tokens directly to TTS at commas and periods instead of waiting for full sentences.
3. **Instant Barge-in (<80ms):** Automatically cancels audio synthesis and clears playback buffers the microsecond a user interrupts.
4. **Dynamic Canvas Visualizer:** Multi-layered organic oscillating sound orb reacting in real-time to speech frequencies.

---

## 🏗️ Architecture Pipeline

```text
[ User Microphone ]
        │  (20ms raw audio frames)
        ▼
[ Client VAD (110ms threshold) ]
        │
        ▼ (Bidirectional WebSockets / WebRTC)
[ Voice Server (Graviton / Node / Python) ]
        │
        ├──► [ Amazon Bedrock Streaming ] (TTFT: ~295ms)
        │           │ (Clause-boundary token chunks)
        │           ▼
        └──► [ Streaming TTS Synthesizer ] (~140ms first byte)
                    │
                    ▼
          [ Client Audio Playback ] (Sub-800ms Total Turnaround)
```

---

## ✨ Features

- **⚡ Sub-800ms Latency Budget:** Tested and structured for conversational responsiveness.
- **🎙️ Canvas Glowing Sound Orb:** Beautiful multi-state visualizer (Listening, Thinking, Speaking).
- **🛑 Sub-80ms Barge-In:** Immediate client-side interruption with server stream cancellation.
- **📊 Real-Time Telemetry Monitor:** Live breakdown of VAD trim, transport, LLM TTFT, and audio playback.
- **🔒 Production Ready & Secure:** Zero hardcoded API keys; clean `.env.example` workflow.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/MDzubair933/realtime-voice-ai-agent.git
cd realtime-voice-ai-agent
```

### 2. Install dependencies & configure environment
```bash
npm install
cp .env.example .env.local
```

### 3. Run the Next.js development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Click **Start Voice Session** and test real-time speech interaction!

---

## 🐍 Optional: Run the Python Streaming Backend
For raw WebSocket streaming benchmarks:
```bash
cd server
pip install -r requirements.txt
python voice_server.py
```

---

## 📁 Project Structure

```text
realtime-voice-ai-agent/
├── app/
│   ├── layout.tsx            # Global layout with dark theme
│   ├── page.tsx              # Main Voice AI Stage & Telemetry
│   └── globals.css           # Glowing orb & radial animations
├── components/
│   ├── VoiceVisualizer.tsx   # Canvas-based multi-frequency oscillating orb
│   ├── ControlBar.tsx        # Mic toggle, mute, and call controls
│   ├── LatencyMonitor.tsx    # Live p50/p99 latency budget telemetry
│   └── TranscriptFeed.tsx    # Real-time streaming conversation transcript
├── server/
│   ├── voice_server.py       # Standalone Python ultra-low latency WebSocket/VAD handler
│   └── requirements.txt      # Python dependencies
├── docs/
│   └── ARCHITECTURE.md       # Deep-dive into sub-800ms latency engineering
├── .env.example              # Environment variables template
└── README.md
```

---

## 👨‍💻 Author

**Md Zubair**
- Founder & AI Systems Architect at **[Zubair Systems](https://zubairsystems.tech)**
- Alumnus, **IIT (ISM) Dhanbad**
- AWS Community Author: **[@zubair1112 on AWS Builder Center](https://builder.aws.com/community/@zubair1112)**
- GitHub: **[@MDzubair933](https://github.com/MDzubair933)**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Feel free to use and adapt it in your projects!

⭐ If you find this starter helpful, please consider **starring the repository** on GitHub!
