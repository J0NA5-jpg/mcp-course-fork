# Mistral Chat

A minimal web app that calls the [Mistral API](https://docs.mistral.ai) with the official
[`@mistralai/mistralai`](https://www.npmjs.com/package/@mistralai/mistralai) TypeScript SDK.

- TypeScript + Express server, static HTML/JS chat interface
- Model: `mistral-small-latest`
- `MISTRAL_API_KEY` is only read on the server (via `.env`); the browser only talks to the local `/api/chat` endpoint, so the key never reaches the client

## Prerequisites

- Node.js 20+ (developed on Node 22)
- A Mistral API key from the [Mistral console](https://console.mistral.ai/api-keys/)

## Install dependencies

```bash
cd projects/mistral-chat
npm install
```

## Configure the API key

```bash
cp .env.example .env
```

Then edit `.env` and set your key:

```
MISTRAL_API_KEY=your-mistral-api-key-here
```

`.env` is git-ignored and must never be committed.

## Run locally

Development (auto-reload with `tsx`):

```bash
npm run dev
```

Production-style build and run:

```bash
npm run build
npm start
```

Then open <http://localhost:3000> and start chatting.

## How it works

- `public/index.html` renders the chat UI and sends the conversation to `POST /api/chat`.
- `src/server.ts` serves the static UI and forwards `messages` to the Mistral API using the official SDK, returning `{ "reply": "..." }`.
- The server exits at startup if `MISTRAL_API_KEY` is not set.
