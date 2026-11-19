# Sub-800ms Latency Budget Architecture

## Overview
Traditional voice AI architectures suffer from cumulative latency:
1. Waiting for user sentence completion (300ms–800ms silence threshold).
2. Audio upload over TCP/HTTP (80ms–200ms).
3. Speech-to-Text inference (150ms–350ms).
4. LLM Time to First Token (TTFT) (300ms–600ms).
5. Full sentence Text-to-Speech synthesis (300ms–600ms).
6. Audio playback buffering (100ms).
**Total Latency: 1,230ms – 2,550ms** (felt as awkward lag).

---

## The Optimized Architecture (<800ms Budget)

```
[ User Microphone ]
        │  (20ms raw PCM chunks)
        ▼
[ Client VAD (110ms threshold) ]
        │
        ▼ (WebSockets / WebRTC)
[ Edge Ingress / AWS Graviton ECS ]
        │
        ├──► [ Amazon Bedrock Streaming (Claude 3.5 Haiku) ] (TTFT: ~280ms)
        │           │ (Token Delta Streaming at clause boundary)
        │           ▼
        └──► [ Streaming TTS Chunk Synthesizer ] (~120ms first byte)
                    │
                    ▼
          [ Client Audio Playback ] (Immediate audio playback)
```

### Breakdown of Budget:
| Stage | Optimization | Latency |
|---|---|---|
| **VAD Silence Detection** | Adaptive energy classification | **110ms** |
| **Transport Ingress** | WebSockets / WebRTC over UDP | **35ms** |
| **LLM Inference TTFT** | Amazon Bedrock streaming | **295ms** |
| **First Audio Chunk (TTS)** | Clause-boundary token synthesis | **140ms** |
| **Client Audio Buffer** | Low-latency AudioContext ring buffer | **10ms** |
| **Total Turnaround** | **Roundtrip human conversational response** | **~590ms** |

---

## Barge-In / Interruption Handling
When the user speaks while the assistant is streaming:
1. Client VAD detects energy threshold (>80ms duration).
2. Client immediately halts local AudioContext playback and flushes buffer.
3. Client dispatches `{"type": "stop"}` over WebSocket.
4. Server cancels Bedrock HTTP/2 stream and stops TTS generation in **<80ms**.
