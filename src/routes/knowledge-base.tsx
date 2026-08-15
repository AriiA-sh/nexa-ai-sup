import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Markdown } from "@/components/dashboard/markdown";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  knowledgeBase,
  knowledgeCategories,
  type KnowledgeCategory,
} from "@/data/knowledge-base";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/knowledge-base")({
  head: () => ({
    meta: [
      { title: "Knowledge Base — Nexa AI Support Agent" },
      {
        name: "description",
        content:
          "Browse the seven demo support articles covering accounts, passwords, billing, refunds, technical issues, shipping, and contact details.",
      },
      { property: "og:title", content: "Knowledge Base — Nexa AI Support Agent" },
      {
        property: "og:description",
        content: "The local demo knowledge base that grounds every AI answer.",
      },
    ],
  }),
  component: KnowledgeBasePage,
});

function KnowledgeBasePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<KnowledgeCategory | "All">("All");
  const [selectedId, setSelectedId] = useState(knowledgeBase[0]!.id);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return knowledgeBase.filter((article) => {
      const matchesCategory = category === "All" || article.category === category;
      const matchesQuery =
        needle.length === 0 ||
        `${article.title} ${article.summary} ${article.tags.join(" ")}`
          .toLowerCase()
          .includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  const selected =
    filtered.find((article) => article.id === selectedId) ?? filtered[0] ?? null;

  return (
    <DashboardShell
      title="Knowledge Base"
      description="Local demo content used as the agent's only source of truth. Edit the files to change what the agent knows."
      actions={
        <Badge variant="outline" className="hidden sm:inline-flex">
          {knowledgeBase.length} articles
        </Badge>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="kb-search" className="sr-only">
              Search articles
            </label>
            <Input
              id="kb-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles, tags, or topics…"
              className="bg-card/60 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...knowledgeCategories] as const).map((item) => (
              <Button
                key={item}
                size="sm"
                variant={category === item ? "secondary" : "ghost"}
                onClick={() => setCategory(item)}
                className="text-xs"
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <BookOpen className="mx-auto size-6 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium">No articles match this search</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different keyword or clear the category filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[22rem_1fr]">
            <ul className="space-y-2">
              {filtered.map((article) => (
                <li key={article.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(article.id)}
                    aria-current={selected?.id === article.id ? "true" : undefined}
                    className={cn(
                      "w-full rounded-xl border p-4 text-left transition-colors",
                      selected?.id === article.id
                        ? "border-primary/40 bg-card"
                        : "border-border bg-card/40 hover:border-primary/25",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{article.title}</span>
                      <Badge variant="secondary" className="shrink-0 text-[10px] font-normal">
                        {article.category}
                      </Badge>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                      {article.summary}
                    </p>
                  </button>
                </li>
              ))}
            </ul>

            {selected && (
              <article className="rounded-xl border border-border bg-card/50 p-5 sm:p-7">
                <header className="border-b border-border pb-4">
                  <h2 className="text-lg font-semibold tracking-tight">{selected.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">
                      Updated {selected.updatedAt}
                    </span>
                    {selected.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </header>
                <Markdown content={selected.content} className="pt-5" />
              </article>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}