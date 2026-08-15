export interface MetricPoint {
  day: string;
  conversations: number;
  resolved: number;
}

export interface RecentConversation {
  id: string;
  question: string;
  category: string;
  status: "Resolved" | "Escalated" | "Deflected";
  responseMs: number;
  at: string;
}

export const analyticsSummary = {
  totalConversations: 1284,
  questionsAnswered: 1147,
  avgResponseMs: 1420,
  resolutionRate: 0.893,
  deflectionRate: 0.71,
  groundedRate: 0.94,
};

export const weeklyVolume: MetricPoint[] = [
  { day: "Mon", conversations: 164, resolved: 145 },
  { day: "Tue", conversations: 198, resolved: 179 },
  { day: "Wed", conversations: 221, resolved: 196 },
  { day: "Thu", conversations: 187, resolved: 168 },
  { day: "Fri", conversations: 243, resolved: 214 },
  { day: "Sat", conversations: 142, resolved: 129 },
  { day: "Sun", conversations: 129, resolved: 116 },
];

export const categoryBreakdown = [
  { category: "Billing", volume: 312 },
  { category: "Security", volume: 268 },
  { category: "Technical", volume: 241 },
  { category: "Refunds", volume: 186 },
  { category: "Shipping", volume: 154 },
  { category: "Account", volume: 123 },
];

export const recentConversations: RecentConversation[] = [
  { id: "c-9821", question: "How long does a refund take to arrive?", category: "Refunds", status: "Resolved", responseMs: 1180, at: "2 min ago" },
  { id: "c-9820", question: "My password reset link expired", category: "Security", status: "Resolved", responseMs: 940, at: "14 min ago" },
  { id: "c-9819", question: "Can I switch to annual billing mid-cycle?", category: "Billing", status: "Resolved", responseMs: 1620, at: "38 min ago" },
  { id: "c-9818", question: "Do you support on-premise deployment?", category: "Technical", status: "Escalated", responseMs: 2110, at: "1 hr ago" },
  { id: "c-9817", question: "Where is my hardware add-on parcel?", category: "Shipping", status: "Resolved", responseMs: 1275, at: "2 hr ago" },
  { id: "c-9816", question: "How do I add a VAT ID to invoices?", category: "Billing", status: "Deflected", responseMs: 1030, at: "3 hr ago" },
];