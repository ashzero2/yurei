# 👻 Yurei — Lightweight Server Watcher (WIP)

**Yurei** (幽霊) is a minimalist real-time monitoring daemon built with **TypeScript**, **Hono**, and **Redis**.  
It silently watches your servers, collects metrics, and alerts you when things start to break — all without dashboards or clutter.

---

## 🧩 Overview

Yurei is split into three small services:

| Service | Description |
|----------|--------------|
| **Agent** | Runs on each host. Collects system metrics (CPU, Memory, Disk) and sends them to the API. |
| **API** | A small Hono server that receives metrics and publishes them to Redis. |
| **Alert Engine** | Subscribes to Redis, detects threshold breaches, and sends notifications (Telegram / Discord). |

All three are fully decoupled — you can scale or replace any of them independently.

