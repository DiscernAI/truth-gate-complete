# Soulframe Unified App

This project merges the original **Truth Gate / Discern.site** system with the full **Soulframe integrity architecture**, including moral filtering, alignment scoring, vault memory, fingerprinting, and refusal protocols.

---

## 🔧 Project Structure

```
/api              → API routes (e.g. /routeGPT)
/config           → Vault memory (vault.json)
/core             → Mirror, prompt, and refusal logic
/memory           → Alignment, chat history, truth logs
/public           → Frontend HTML interface
/scripts          → Seeding and simulation tools
/modules/         → Full Soulframe extensions (modular)
```

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Your OpenAI Key
Create a `.env` file in the root:

```
OPENAI_API_KEY=your-key-here
```

### 3. Start the App
```bash
npm start
```
Then open: [http://localhost:10000](http://localhost:10000)

---

## 📡 Key API Routes

| Route | Description |
|-------|-------------|
| `POST /api/routeGPT` | Main AI response engine |
| `POST /truth` | Truth Gate moral filter |
| `POST /truth-audit` | Recursive contradiction checker |
| `POST /vault` | Add new truth |
| `POST /vault/edit` | Edit truth with justification + audit |
| `GET  /vault/tiered?userId=...` | Tier-based truth access |
| `GET  /access-tier?userId=...` | Returns user trust level |
| `POST /interaction` | Auto-adjust alignment based on behavior |
| `POST /truth/fingerprint` | Hash check for memory integrity |

---

## 🧠 Alignment Tier System

- **Score 90+** → Full access
- **70–89** → Standard access
- **50–69** → Limited access
- **30–49** → Restricted
- **<30** → Blocked

Scores are adjusted automatically via `/interaction` and `/refusal-log-meta`.

---

## 📁 Vault + Fingerprint Protection

Every truth written through `/vault/secure` is:
- Saved to `vault.json`
- Hashed with SHA-256
- Logged in `fingerprint_log.json`
- Protected from silent edits

---

## 🗓️ Generated on May 21, 2025 by Soulframe system builder

For deployment guidance, Next.js/Render/cloud migration help, or expansion to multi-agent Soulframe AI, contact system architect.
