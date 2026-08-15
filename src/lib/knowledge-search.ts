import { knowledgeBase, type KnowledgeArticle } from "@/data/knowledge-base";

const STOP_WORDS = new Set([
  "the","a","an","and","or","of","to","in","is","are","how","do","i","my","can","you",
  "for","on","it","me","what","with","about","please","help","need","does","be","was",
  "if","that","this","there","get","got","have","has","from","when","why","should",
]);

export function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

export interface ScoredArticle {
  article: KnowledgeArticle;
  score: number;
}

/** Lightweight keyword retrieval over the local knowledge base. */
export function searchKnowledgeBase(query: string, limit = 3): ScoredArticle[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  return knowledgeBase
    .map((article) => {
      const haystack = `${article.title} ${article.summary} ${article.content}`.toLowerCase();
      const tagText = article.tags.join(" ").toLowerCase();
      let score = 0;

      for (const token of tokens) {
        if (article.title.toLowerCase().includes(token)) score += 5;
        if (tagText.includes(token)) score += 4;
        if (article.summary.toLowerCase().includes(token)) score += 2;
        const occurrences = haystack.split(token).length - 1;
        score += Math.min(occurrences, 4);
      }

      return { article, score };
    })
    .filter((entry) => entry.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function buildContext(matches: ScoredArticle[]): string {
  return matches
    .map(
      ({ article }) =>
        `### Article: ${article.title} (id: ${article.id}, category: ${article.category})\n${article.content}`,
    )
    .join("\n\n---\n\n");
}