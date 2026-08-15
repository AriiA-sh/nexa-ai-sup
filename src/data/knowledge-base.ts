export type KnowledgeCategory =
  | "Account"
  | "Security"
  | "Billing"
  | "Refunds"
  | "Technical"
  | "Shipping"
  | "Contact";

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: KnowledgeCategory;
  summary: string;
  tags: string[];
  updatedAt: string;
  /** Markdown body used as grounding context for the AI agent. */
  content: string;
}

export const knowledgeBase: KnowledgeArticle[] = [
  {
    id: "kb-account-basics",
    title: "Creating and managing your account",
    category: "Account",
    summary: "How to sign up, update profile details, and close an account.",
    tags: ["account", "signup", "profile", "delete account", "email"],
    updatedAt: "2026-05-12",
    content: `## Creating an account
Sign up at the Nexa demo portal with an email address and a password of at least 10 characters. A verification email arrives within 5 minutes.

## Updating profile details
Go to **Settings → Profile** to change your name, email, avatar, and notification preferences. Changing the primary email requires re-verification.

## Closing an account
Account deletion is self-service under **Settings → Danger zone**. Deletion is queued for 14 days, during which signing back in cancels the request. After 14 days all workspace data is permanently removed.`,
  },
  {
    id: "kb-password-reset",
    title: "Resetting a forgotten password",
    category: "Security",
    summary: "Password reset flow, link expiry, and two-factor recovery.",
    tags: ["password", "reset", "forgot", "login", "2fa", "mfa", "locked out"],
    updatedAt: "2026-06-02",
    content: `## Reset your password
1. On the sign-in screen choose **Forgot password**.
2. Enter the email on the account.
3. Open the reset email and follow the link. Reset links expire after **60 minutes** and can only be used once.
4. Choose a new password of at least 10 characters that you have not used before.

## Account lockouts
After 10 failed attempts sign-in is blocked for 30 minutes. A successful password reset clears the lockout immediately.

## Two-factor recovery
If you lost your authenticator device, use one of the 8 single-use recovery codes issued when 2FA was enabled. Without a recovery code, identity verification by the support team is required and takes up to 2 business days.`,
  },
  {
    id: "kb-billing-plans",
    title: "Billing, invoices, and plan changes",
    category: "Billing",
    summary: "Billing cycles, accepted payment methods, invoices, and proration.",
    tags: ["billing", "invoice", "payment", "plan", "upgrade", "downgrade", "vat", "card"],
    updatedAt: "2026-06-18",
    content: `## Plans and cycles
Plans are billed monthly or annually. Annual billing is discounted by 20%. The billing date is the day the subscription started.

## Payment methods
Credit and debit cards (Visa, Mastercard, American Express) and SEPA direct debit are accepted. Bank transfer is available on annual invoices above $5,000.

## Invoices
Every invoice is emailed to the billing contact and archived under **Settings → Billing → Invoices** as a PDF. VAT/tax IDs added before an invoice is issued appear on that invoice.

## Upgrades and downgrades
Upgrades take effect immediately and are prorated for the remainder of the cycle. Downgrades take effect at the start of the next cycle; no partial credit is issued for the current one.

## Failed payments
A failed charge is retried on days 1, 3, and 7. After the third failure the workspace moves to read-only until payment succeeds.`,
  },
  {
    id: "kb-refund-policy",
    title: "Refund policy",
    category: "Refunds",
    summary: "14-day refund window, eligibility, and processing times.",
    tags: ["refund", "money back", "cancel", "chargeback", "credit"],
    updatedAt: "2026-04-28",
    content: `## Refund window
New subscriptions can be refunded in full within **14 days** of the first payment. Renewals are refundable within 7 days of the charge if no usage was recorded in that period.

## Not eligible
- Usage-based overage charges that have already been consumed.
- Annual plans past the 14-day window (the plan can be cancelled for the next term instead).
- Workspaces suspended for violating the acceptable use policy.

## Processing
Approved refunds are issued to the original payment method and appear within 5–10 business days depending on the bank. Refunds cannot be redirected to another card or account.

## How to request
Reply to any invoice email or open a support request with the invoice number.`,
  },
  {
    id: "kb-technical-support",
    title: "Technical support and troubleshooting",
    category: "Technical",
    summary: "Common errors, first-line troubleshooting, and escalation path.",
    tags: ["error", "bug", "api", "500", "rate limit", "slow", "troubleshoot", "status"],
    updatedAt: "2026-06-25",
    content: `## First-line checks
1. Reload the page and clear cached assets.
2. Confirm the incident page shows all systems operational.
3. Retry the request and capture the request ID shown in the error toast.

## Common API errors
- **401 Unauthorized** — the API key is missing, revoked, or sent in the wrong header.
- **429 Too Many Requests** — the workspace exceeded its rate limit. Back off exponentially and retry.
- **500 Internal Error** — transient; retry once, then report the request ID.

## Escalation
Include the request ID, timestamp in UTC, and reproduction steps. First response targets are 8 business hours on Standard and 1 hour on Enterprise support.`,
  },
  {
    id: "kb-shipping",
    title: "Shipping and delivery of hardware add-ons",
    category: "Shipping",
    summary: "Delivery windows, tracking, and damaged-shipment handling.",
    tags: ["shipping", "delivery", "tracking", "customs", "returns", "hardware"],
    updatedAt: "2026-05-30",
    content: `## Delivery windows
Hardware add-ons ship from the EU and US warehouses on business days. Standard delivery is 3–5 business days domestically and 7–12 business days internationally.

## Tracking
A tracking number is emailed once the parcel leaves the warehouse and is also shown under **Settings → Orders**. Tracking can take up to 24 hours to become active.

## Customs and duties
International orders may incur import duties payable by the recipient. These charges are set by the destination country and are not refundable by us.

## Damaged or missing parcels
Report damage within 7 days of delivery with photos of the packaging. Parcels not scanned for 10 consecutive days are treated as lost and replaced free of charge.`,
  },
  {
    id: "kb-contact",
    title: "Contacting support",
    category: "Contact",
    summary: "Support channels, hours, and response targets.",
    tags: ["contact", "support", "email", "hours", "phone", "sla"],
    updatedAt: "2026-06-10",
    content: `## Channels
- **In-app chat** — fastest route for account and billing questions; staffed Monday to Friday, 09:00–18:00 UTC.
- **Email** — support@nexa-demo.example, monitored 24/7 with responses during business hours.
- **Phone callback** — available on Enterprise plans; request a slot from the in-app chat.

## Response targets
Standard: first response within 8 business hours. Priority: 4 business hours. Enterprise: 1 hour, 24/7 for outages.

## What to include
Workspace name, the email on the account, and, for technical issues, a request ID. Never send passwords or full card numbers.`,
  },
];

export const knowledgeCategories: KnowledgeCategory[] = [
  "Account",
  "Security",
  "Billing",
  "Refunds",
  "Technical",
  "Shipping",
  "Contact",
];