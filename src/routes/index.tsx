import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Clock,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { knowledgeBase } from "@/data/knowledge-base";
import { analyticsSummary, recentConversations } from "@/lib/demo-analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexa AI Support Agent — Portfolio Demo" },
      {
        name: "description",
        content:
          "A portfolio demo of an AI customer support agent that answers strictly from a structured knowledge base, with dashboard, analytics, and offline demo mode.",
      },
      { property: "og:title", content: "Nexa AI Support Agent — Portfolio Demo" },
      {
        property: "og:description",
        content:
          "Knowledge-base grounded AI support agent demo built with TanStack Start, React, TypeScript, and Tailwind CSS.",
      },
    ],
  }),
  component: Index,
});

const capabilities = [
  {
    title: "Grounded answers",
    description:
      "Retrieval runs over the local knowledge base first; only matched articles are sent to the model as context.",
    icon: BookOpen,
  },
  {
    title: "Honest refusals",
    description:
      "If the knowledge base does not cover a question, the agent says it lacks enough information instead of inventing facts.",
    icon: ShieldCheck,
  },
  {
    title: "Works without a key",
    description:
      "An offline demo engine answers from predefined content so the project stays presentable with no API key configured.",
    icon: Sparkles,
  },
];

function Index() {
  return (
    <DashboardShell
      title="Overview"
      description="Nexa is a personal portfolio demonstration of an AI-powered customer support agent. It is not deployed for a real company."
      actions={
        <Button asChild size="sm">
          <Link to="/agent">
            Open the agent
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <section className="glass-panel relative overflow-hidden rounded-2xl p-6 sm:p-9">
          <Badge variant="outline" className="mb-4">
            Portfolio demonstration
          </Badge>
          <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            An AI support agent that answers{" "}
            <span className="text-gradient-accent">only from your knowledge base</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Ask a support question and the agent retrieves the relevant articles, answers from them,
            cites which ones it used, and declines when the answer is not covered.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/agent">
                Start a conversation
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/knowledge-base">Browse knowledge base</Link>
            </Button>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Conversations"
            value={analyticsSummary.totalConversations.toLocaleString()}
            hint="sample data"
            icon={MessageSquareText}
          />
          <StatCard
            label="Questions answered"
            value={analyticsSummary.questionsAnswered.toLocaleString()}
            hint="sample data"
            icon={Sparkles}
          />
          <StatCard
            label="Avg. response"
            value={`${(analyticsSummary.avgResponseMs / 1000).toFixed(2)}s`}
            hint="sample data"
            icon={Clock}
          />
          <StatCard
            label="KB articles"
            value={String(knowledgeBase.length)}
            hint="local demo content"
            icon={BookOpen}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <section
                key={capability.title}
                className="rounded-xl border border-border bg-card/50 p-5"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent/12">
                  <Icon className="size-4 text-accent" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-sm font-semibold tracking-tight">{capability.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {capability.description}
                </p>
              </section>
            );
          })}
        </div>

        <section className="rounded-xl border border-border bg-card/50">
          <div className="flex items-baseline justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold tracking-tight">Recent activity</h2>
            <Link
              to="/analytics"
              className="text-xs text-primary underline-offset-4 hover:underline"
            >
              View analytics
            </Link>
          </div>
          <ul className="divide-y divide-border/70">
            {recentConversations.slice(0, 4).map((conversation) => (
              <li
                key={conversation.id}
                className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5"
              >
                <span className="min-w-0 flex-1 truncate text-sm">{conversation.question}</span>
                <span className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{conversation.category}</span>
                  <span className="tabular-nums">
                    {(conversation.responseMs / 1000).toFixed(2)}s
                  </span>
                  <span>{conversation.at}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
