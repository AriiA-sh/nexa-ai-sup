import { createFileRoute } from "@tanstack/react-router";
import { Clock, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { StatCard } from "@/components/dashboard/stat-card";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import {
  analyticsSummary,
  categoryBreakdown,
  recentConversations,
  weeklyVolume,
} from "@/lib/demo-analytics";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Nexa AI Support Agent" },
      {
        name: "description",
        content:
          "Sample support analytics: conversation volume, questions answered, average response time, and resolution rate.",
      },
      { property: "og:title", content: "Analytics — Nexa AI Support Agent" },
      {
        property: "og:description",
        content: "Illustrative support metrics dashboard for the Nexa AI agent demo.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const statusStyles: Record<string, string> = {
  Resolved: "bg-primary/12 text-primary",
  Escalated: "bg-destructive/15 text-destructive",
  Deflected: "bg-secondary text-secondary-foreground",
};

function AnalyticsPage() {
  return (
    <DashboardShell
      title="Analytics"
      description="All numbers on this page are sample data generated for the portfolio demo — no real customer traffic is measured."
      actions={
        <Badge variant="outline" className="hidden sm:inline-flex">
          Sample data
        </Badge>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total conversations"
            value={analyticsSummary.totalConversations.toLocaleString()}
            trend="+12.4%"
            hint="vs. previous 30 days"
            icon={MessageSquareText}
          />
          <StatCard
            label="Questions answered"
            value={analyticsSummary.questionsAnswered.toLocaleString()}
            trend={`${Math.round(analyticsSummary.groundedRate * 100)}% grounded`}
            icon={Sparkles}
          />
          <StatCard
            label="Avg. response time"
            value={`${(analyticsSummary.avgResponseMs / 1000).toFixed(2)}s`}
            trend="-320ms"
            hint="median 1.19s"
            icon={Clock}
          />
          <StatCard
            label="Resolution rate"
            value={`${(analyticsSummary.resolutionRate * 100).toFixed(1)}%`}
            trend={`${Math.round(analyticsSummary.deflectionRate * 100)}% deflected`}
            icon={ShieldCheck}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <section
            aria-label="Weekly conversation volume"
            className="rounded-xl border border-border bg-card/50 p-5 xl:col-span-2"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold tracking-tight">Weekly volume</h2>
              <span className="text-xs text-muted-foreground">Conversations vs. resolved</span>
            </div>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVolume} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={32}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.6rem",
                      color: "var(--popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="conversations" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section
            aria-label="Volume by category"
            className="rounded-xl border border-border bg-card/50 p-5"
          >
            <h2 className="text-sm font-semibold tracking-tight">By category</h2>
            <div className="mt-5 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryBreakdown} layout="vertical" barSize={14}>
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="category"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={70}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: "0.6rem",
                      color: "var(--popover-foreground)",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="volume" radius={[0, 4, 4, 0]}>
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={entry.category} fill={`var(--chart-${(index % 5) + 1})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section
          aria-label="Recent conversations"
          className="rounded-xl border border-border bg-card/50"
        >
          <div className="flex items-baseline justify-between border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold tracking-tight">Recent conversations</h2>
            <span className="text-xs text-muted-foreground">Sample records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[38rem] text-sm">
              <thead>
                <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th scope="col" className="px-5 py-3 font-medium">Question</th>
                  <th scope="col" className="px-5 py-3 font-medium">Category</th>
                  <th scope="col" className="px-5 py-3 font-medium">Status</th>
                  <th scope="col" className="px-5 py-3 font-medium">Response</th>
                  <th scope="col" className="px-5 py-3 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {recentConversations.map((conversation) => (
                  <tr key={conversation.id} className="border-t border-border/70">
                    <td className="max-w-[18rem] truncate px-5 py-3.5">{conversation.question}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{conversation.category}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-medium",
                          statusStyles[conversation.status],
                        )}
                      >
                        {conversation.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums text-muted-foreground">
                      {(conversation.responseMs / 1000).toFixed(2)}s
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{conversation.at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}