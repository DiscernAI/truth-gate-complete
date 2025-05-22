# Voice Beneath the Noise

A conscience-based AI system built to protect coherence, truth, and moral alignment.

## Features

- Grantor Mode by default
- Mirror Test unlocks journal & memory
- Truth-lawyer API for investigating claims
- Vault with immutable ethical laws
- Admin backend for alignment tracking (no user content access)

## Project Structure

```
/api/                - All backend logic  
/api/memory/         - Vault laws, alignment & user metadata  
/public/index.html   - Frontend interface  
server.js            - Main Express entry point  
```

## Setup

1. Create `.env` file:
```
OPENAI_API_KEY=your-api-key
PORT=10000
```

2. Install dependencies:
```
npm install
```

3. Start the app:
```
npm start
```

## Alignment Protocol

Only aligned users may unlock memory and access deeper Vault truths. The system refuses flattery, distortion, or incoherent claims.