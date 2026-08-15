import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { answerFromDemoEngine, buildSystemPrompt, NO_ANSWER_TEXT } from "@/lib/demo-agent";
import { buildContext, searchKnowledgeBase } from "@/lib/knowledge-search";
import type { AgentAnswer } from "@/lib/support-agent.types";

const AskInput = z.object({
  question: z.string().min(1).max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      }),
    )
    .max(20)
    .default([]),
  forceDemoMode: z.boolean().default(false),
});

export const askSupportAgent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data }): Promise<AgentAnswer> => {
    const apiKey = process.env["LOVABLE_API_KEY"];

    if (data.forceDemoMode || !apiKey) {
      return answerFromDemoEngine(data.question);
    }

    const matches = searchKnowledgeBase(data.question, 3);
    if (matches.length === 0) {
      return {
        answer: NO_ANSWER_TEXT,
        sources: [],
        grounded: false,
        demo: false,
        latencyMs: 0,
      };
    }

    const started = Date.now();

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        stream: false,
        messages: [
          { role: "system", content: buildSystemPrompt(buildContext(matches)) },
          ...data.history,
          { role: "user", content: data.question },
        ],
      }),
    });

    if (response.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    if (response.status === 402) {
      throw new Error("CREDITS_EXHAUSTED");
    }
    if (!response.ok) {
      throw new Error(`AI_GATEWAY_ERROR_${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const answer = payload.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error("EMPTY_RESPONSE");
    }

    const grounded = !answer.includes("don't have enough information");

    return {
      answer,
      sources: grounded ? matches.map((match) => match.article.title) : [],
      grounded,
      demo: false,
      latencyMs: Date.now() - started,
    };
  });

export const getAgentStatus = createServerFn({ method: "GET" }).handler(async () => ({
  liveModelConfigured: Boolean(process.env["LOVABLE_API_KEY"]),
  model: "google/gemini-3.6-flash",
}));