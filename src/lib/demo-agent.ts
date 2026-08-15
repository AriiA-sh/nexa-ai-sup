import { searchKnowledgeBase } from "@/lib/knowledge-search";
import type { AgentAnswer } from "@/lib/support-agent.types";

export const NO_ANSWER_TEXT =
  "I don't have enough information in the knowledge base to answer that reliably. " +
  "I'd rather not guess — please rephrase the question, or contact the support team at support@nexa-demo.example.";

/**
 * Offline fallback used when no LLM API key is configured. It runs the same
 * retrieval step as the live agent and returns the matched article instead of
 * generating free-form text, so the demo never invents facts.
 */
export function answerFromDemoEngine(question: string): AgentAnswer {
  const started = Date.now();
  const matches = searchKnowledgeBase(question, 2);

  if (matches.length === 0) {
    return {
      answer: NO_ANSWER_TEXT,
      sources: [],
      grounded: false,
      demo: true,
      latencyMs: Date.now() - started,
    };
  }

  const best = matches[0]!.article;
  const body = best.content
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n");

  const answer = [
    `Here is what the knowledge base says about **${best.title.toLowerCase()}**:`,
    "",
    body,
    matches.length > 1 ? `\n_Related article: ${matches[1]!.article.title}._` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    answer,
    sources: matches.map((match) => match.article.title),
    grounded: true,
    demo: true,
    latencyMs: Date.now() - started,
  };
}

export function buildSystemPrompt(context: string): string {
  return `You are Nexa, an AI customer support agent for a demo SaaS product.

Rules:
- Answer ONLY using the knowledge base excerpts provided below.
- If the excerpts do not contain the answer, reply exactly: "${NO_ANSWER_TEXT}"
- Never invent policies, prices, dates, or contact details.
- Be concise and professional. Use short markdown sections or bullet lists when helpful.
- Do not mention "excerpts" or "context"; just answer the question.

Knowledge base excerpts:
${context}`;
}
