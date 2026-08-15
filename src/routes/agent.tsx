import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { ChatPanel } from "@/components/agent/chat-panel";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { getAgentStatus } from "@/lib/support-agent.functions";

export const Route = createFileRoute("/agent")({
  head: () => ({
    meta: [
      { title: "AI Support Agent — Nexa Demo" },
      {
        name: "description",
        content:
          "Chat with a knowledge-base grounded AI support agent that declines to answer when the docs do not cover a question.",
      },
      { property: "og:title", content: "AI Support Agent — Nexa Demo" },
      {
        property: "og:description",
        content:
          "A grounded AI support chat demo with conversation history and demo fallback mode.",
      },
    ],
  }),
  component: AgentPage,
});

function AgentPage() {
  const { demoMode, hydrated } = useDemoMode();
  const status = useServerFn(getAgentStatus);
  const { data } = useQuery({ queryKey: ["agent-status"], queryFn: () => status() });

  const usingDemo = demoMode || data?.liveModelConfigured === false;

  return (
    <DashboardShell
      title="AI Support Agent"
      description="Answers are grounded in the local knowledge base. Unsupported questions get an explicit “not enough information” response."
      actions={
        <Badge variant={usingDemo ? "outline" : "secondary"} className="hidden sm:inline-flex">
          {usingDemo ? "Demo mode" : "Live model"}
        </Badge>
      }
    >
      {hydrated ? (
        <ChatPanel demoMode={demoMode} />
      ) : (
        <div className="h-[32rem] animate-pulse rounded-xl border border-border bg-card/40" />
      )}
    </DashboardShell>
  );
}
