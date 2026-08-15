# Nexa AI Support Agent

A **personal portfolio demonstration** of an AI-powered customer support agent that answers
questions strictly from a structured knowledge base. This is not a product used by a real
company — all metrics and articles are sample data created for the demo.

## What it does

- **AI Support Agent** — a chat interface where you ask support questions and get answers grounded
  in the local knowledge base, with the source articles cited on each answer.
- **Honest refusals** — when the knowledge base does not cover a question, the agent explicitly
  says it does not have enough information instead of inventing facts.
- **Knowledge Base** — a browsable, searchable, category-filtered view of the demo articles
  (account management, password reset, billing, refund policy, technical support, shipping,
  contact information).
- **Analytics** — a polished dashboard of clearly labelled sample metrics: total conversations,
  questions answered, average response time, resolution rate, category breakdown, and recent
  conversations.
- **Settings** — model status and a toggle that forces the offline demo mode.

## Architecture

```
src/
  data/knowledge-base.ts        Local demo knowledge base (typed articles with markdown bodies)
  lib/knowledge-search.ts       Keyword retrieval + context builder over the knowledge base
  lib/demo-agent.ts             System prompt + offline demo answer engine (no API key needed)
  lib/support-agent.functions.ts Server functions: askSupportAgent, getAgentStatus
  lib/support-agent.types.ts    Shared chat/conversation/answer types
  lib/demo-analytics.ts         Sample analytics data
  hooks/use-demo-mode.ts        Browser-persisted demo-mode preference
  components/layout/            Dashboard shell: sidebar, mobile nav, page header
  components/agent/chat-panel   Chat UI: history, streaming-free request flow, states, errors
  components/dashboard/         Stat card + small markdown renderer
  routes/                       File-based routes: /, /agent, /knowledge-base, /analytics, /settings
```

Request flow for one question:

1. The browser calls the `askSupportAgent` server function.
2. The server retrieves the top matching knowledge-base articles by keyword score.
3. If nothing matches, it returns the "not enough information" answer without calling the model.
4. Otherwise the matched articles are injected into a strict system prompt and the LLM is called.
5. The answer plus source titles and latency are returned to the UI.

The API key is read only inside the server handler, so it never reaches the browser.

## Tech stack

- TanStack Start (React 19 full-stack framework, file-based routing, server functions)
- TypeScript with strict types
- Tailwind CSS v4 with a semantic dark design-token theme
- TanStack Query for request state
- Recharts for analytics charts
- Vite build tooling

> Note: the original brief mentioned Next.js App Router. This workspace is fixed to TanStack Start,
> which provides the same App-Router-style capabilities (file-based routes, server-side handlers,
> SSR). Routes live in `src/routes/`, and server logic uses `createServerFn` instead of route
> handlers.

## Running the project

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # production build
npm run lint     # eslint
```

## Configuring the LLM API

The agent calls an OpenAI-compatible chat-completions endpoint from the server.

Environment variable:

```
LOVABLE_API_KEY=<your key>
```

The model id is set in `src/lib/support-agent.functions.ts` (`google/gemini-3.6-flash`) and the
endpoint is `https://ai.gateway.lovable.dev/v1/chat/completions`. To use a different provider,
change the URL, header, and model in that single file — nothing else depends on it.

Gateway failures are surfaced in the UI rather than hidden: rate limits (429) and exhausted
quota (402) produce distinct, actionable messages.

## Demo mode

The project is fully usable with no API key:

- If `LOVABLE_API_KEY` is missing, every request is answered by the offline demo engine.
- You can also force it from **Settings → Force demo mode**.

The demo engine runs the same retrieval step and returns the matched article content, so it never
fabricates information. Demo answers are labelled with a "Demo mode" badge in the chat.

## Limitations

- Keyword retrieval, not embeddings/vector search — good enough for seven articles, not for a
  large corpus.
- Conversations are kept in memory only; refreshing the page clears history (no database).
- Analytics are static sample data, not measured traffic.
- No authentication, multi-tenancy, or ticket handoff.
- No response streaming; answers appear once complete.
