import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CircleCheck, CircleSlash, KeyRound } from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDemoMode } from "@/hooks/use-demo-mode";
import { getAgentStatus } from "@/lib/support-agent.functions";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Nexa AI Support Agent" },
      {
        name: "description",
        content:
          "Configure the Nexa demo: switch between the live language model and the offline demo agent, and review model configuration.",
      },
      { property: "og:title", content: "Settings — Nexa AI Support Agent" },
      {
        property: "og:description",
        content: "Model configuration and demo-mode controls for the Nexa AI support agent demo.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { demoMode, setDemoMode, hydrated } = useDemoMode();
  const status = useServerFn(getAgentStatus);
  const { data, isLoading } = useQuery({ queryKey: ["agent-status"], queryFn: () => status() });

  return (
    <DashboardShell
      title="Settings"
      description="Runtime configuration for the demo. Nothing here is persisted to a server — preferences stay in your browser."
    >
      <div className="grid max-w-3xl gap-4">
        <section className="rounded-xl border border-border bg-card/50 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Language model</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The agent calls the model through a server function, so the API key never reaches the
                browser.
              </p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <KeyRound className="size-4 text-primary" aria-hidden="true" />
            </span>
          </div>

          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border/70 bg-background/40 p-4">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">Model</dt>
              <dd className="mt-1.5 font-mono text-sm">{data?.model ?? "—"}</dd>
            </div>
            <div className="rounded-lg border border-border/70 bg-background/40 p-4">
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">API key</dt>
              <dd className="mt-1.5 flex items-center gap-2 text-sm">
                {isLoading ? (
                  <span className="text-muted-foreground">Checking…</span>
                ) : data?.liveModelConfigured ? (
                  <>
                    <CircleCheck className="size-4 text-primary" aria-hidden="true" />
                    Configured
                  </>
                ) : (
                  <>
                    <CircleSlash className="size-4 text-muted-foreground" aria-hidden="true" />
                    Not configured — demo mode active
                  </>
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-xl border border-border bg-card/50 p-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <Label htmlFor="demo-mode" className="text-sm font-semibold">
                Force demo mode
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">
                Answer from the offline retrieval engine using predefined knowledge-base content
                instead of calling the model. Useful for demoing without an API key or quota.
              </p>
            </div>
            <Switch
              id="demo-mode"
              checked={demoMode}
              disabled={!hydrated}
              onCheckedChange={setDemoMode}
              aria-label="Force demo mode"
            />
          </div>
          <div className="mt-4">
            <Badge variant={demoMode ? "outline" : "secondary"}>
              {demoMode ? "Offline demo answers" : "Live model answers"}
            </Badge>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/50 p-5">
          <h2 className="text-sm font-semibold tracking-tight">Grounding policy</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Retrieval runs over the local knowledge base before every model call.</li>
            <li>· Only matched articles are sent to the model as context.</li>
            <li>
              · When nothing matches, the agent replies that it lacks enough information instead of
              guessing.
            </li>
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}