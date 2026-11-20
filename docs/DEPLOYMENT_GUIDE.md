# AWS ECS Graviton & Docker Production Deployment Guide

This guide covers deploying the **Real-Time Voice AI Agent** in high-throughput production environments with sub-second turnaround and zero TCP head-of-line blocking.

---

## 1. Architecture Summary

```
                      [ Client Web Audio / WebRTC ]
                                   │
                                   ▼
                    [ AWS Application Load Balancer ]
                        (TLS Termination / WSS)
                                   │
                                   ▼
          ┌─────────────────────────────────────────────────┐
          │      AWS ECS Fargate Task (ARM64 Graviton)      │
          │                                                 │
          │  ┌──────────────────────┐  ┌─────────────────┐  │
          │  │  Next.js 15 Web UI   │  │ Python FastRTC  │  │
          │  │  (Port 3000)         │  │ Media Server    │  │
          │  │                      │  │ (Port 8765)     │  │
          │  └──────────────────────┘  └────────┬────────┘  │
          └─────────────────────────────────────┼───────────┘
                                                │
                                                ▼ (IAM Role)
                                 [ Amazon Bedrock Streaming ]
                                  (Claude 3.5 Haiku / Sonnet)
```

---

## 2. Multi-Stage ARM64 Dockerfile

Using ARM64 Graviton images reduces compute costs by up to 40% and provides hardware Neon SIMD acceleration for WebRTC audio chunking:

```dockerfile
# Multi-stage Dockerfile for Next.js 15 + Audio Worker
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM python:3.11-slim AS runner
WORKDIR /app

# Install native audio dependencies for WebRTC
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libopus-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python streaming backend requirements
COPY server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Next.js frontend standalone build
COPY --from=frontend-builder /app/.next/standalone ./
COPY --from=frontend-builder /app/.next/static ./.next/static
COPY --from=frontend-builder /app/public ./public
COPY server ./server

EXPOSE 3000 8765

# Start health-checked processes
CMD ["python", "server/voice_server.py"]
```

---

## 3. Amazon Bedrock IAM Least-Privilege Policy

Attach this IAM policy to your ECS Task Execution Role (`ecsTaskExecutionRole`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BedrockConverseStreamingAccess",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream"
      ],
      "Resource": [
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-haiku-*",
        "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-5-sonnet-*"
      ]
    }
  ]
}
```

---

## 4. Production Checklist

- [x] **VAD Threshold:** Set to 110ms adaptive energy cutoff to minimize trailing silence.
- [x] **Audio Buffer:** Configure Web Audio API ring buffer with 20ms frame sizes.
- [x] **ARM64 Graviton:** Verify ECS task definition specifies `CPU_ARCHITECTURE: ARM64`.
- [x] **Health Check:** Expose `/healthz` on port 8765 returning `200 OK`.
- [x] **Barge-In:** Verify client interruptions emit instant flush datagrams (<80ms).

---

Crafted by **Md Zubair** ([@MDzubair933](https://github.com/MDzubair933)) — **Zubair Systems**.
