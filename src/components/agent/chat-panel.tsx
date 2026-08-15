import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, ArrowUp, Bot, Loader2, Plus, Sparkles, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Markdown } from "@/components/dashboard/markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askSupportAgent } from "@/lib/support-agent.functions";
import type { ChatMessage, Conversation } from "@/lib/support-agent.types";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "How do I reset my password?",
  "What is your refund policy?",
  "How long does international shipping take?",
  "Why did my payment fail?",
];

function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function newConversation(): Conversation {
  return { id: createId(), title: "New conversation", createdAt: Date.now(), messages: [] };
}

function errorMessageFor(error: unknown): string {
  const raw = error instanceof Error ? error.message : "";
  if (raw.includes("RATE_LIMIT")) {
    return "The assistant is rate limited right now. Please wait a moment and try again.";
  }
  if (raw.includes("CREDITS_EXHAUSTED")) {
    return "The AI usage quota for this demo is exhausted. Switch on demo mode in Settings to keep exploring.";
  }
  return "The assistant could not be reached. Please retry — if it keeps failing, enable demo mode.";
}

export interface ChatPanelProps {
  demoMode: boolean;
}

export function ChatPanel({ demoMode }: ChatPanelProps) {
  const [conversations, setConversations] = useState<Conversation[]>(() => [newConversation()]);
  const [activeId, setActiveId] = useState<string>(() => "");
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const ask = useServerFn(askSupportAgent);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0]!,
    [conversations, activeId],
  );

  useEffect(() => {
    if (!activeId && conversations[0]) setActiveId(conversations[0].id);
  }, [activeId, conversations]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active.messages.length]);

  const appendMessage = (conversationId: string, message: ChatMessage) => {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              title:
                conversation.messages.length === 0 && message.role === "user"
                  ? message.content.slice(0, 46)
                  : conversation.title,
              messages: [...conversation.messages, message],
            }
          : conversation,
      ),
    );
  };

  const mutation = useMutation({
    mutationFn: async (question: string) => {
      const history = active.messages.slice(-8).map((message) => ({
        role: message.role,
        content: message.content,
      }));
      return ask({ data: { question, history, forceDemoMode: demoMode } });
    },
    onSuccess: (result) => {
      appendMessage(active.id, {
        id: createId(),
        role: "assistant",
        content: result.answer,
        createdAt: Date.now(),
        sources: result.sources,
        grounded: result.grounded,
        demo: result.demo,
      });
    },
    onError: (error) => {
      appendMessage(active.id, {
        id: createId(),
        role: "assistant",
        content: errorMessageFor(error),
        createdAt: Date.now(),
        error: true,
      });
    },
  });

  const send = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || mutation.isPending) return;
    appendMessage(active.id, {
      id: createId(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    });
    setInput("");
    mutation.mutate(trimmed);
  };

  const startNewConversation = () => {
    const conversation = newConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
    setInput("");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[19rem_1fr]">
      <section
        aria-label="Conversation history"
        className="order-2 rounded-xl border border-border bg-card/50 p-3 lg:order-1"
      >
        <div className="flex items-center justify-between px-1 pb-3">
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Conversations
          </h2>
          <Button size="sm" variant="secondary" onClick={startNewConversation}>
            <Plus className="size-3.5" aria-hidden="true" />
            New
          </Button>
        </div>
        <ul className="max-h-64 space-y-1 overflow-y-auto lg:max-h-[28rem]">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => setActiveId(conversation.id)}
                aria-current={conversation.id === active.id ? "true" : undefined}
                className={cn(
                  "w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  conversation.id === active.id
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <span className="block truncate">{conversation.title}</span>
                <span className="mt-0.5 block text-[11px] text-muted-foreground">
                  {conversation.messages.length} message
                  {conversation.messages.length === 1 ? "" : "s"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-label="Chat with the AI support agent"
        className="order-1 flex min-h-[32rem] flex-col rounded-xl border border-border bg-card/50 lg:order-2 lg:min-h-[38rem]"
      >
        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {active.messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/12 ring-1 ring-primary/25">
                <Sparkles className="size-5 text-primary" aria-hidden="true" />
              </span>
              <div className="max-w-sm">
                <h3 className="text-base font-semibold tracking-tight">
                  Ask about the support knowledge base
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Answers are grounded in seven demo articles. Anything outside them is answered
                  with an explicit “not enough information”.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            active.messages.map((message) => (
              <article
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    message.role === "user"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary/12 text-primary",
                  )}
                  aria-hidden="true"
                >
                  {message.role === "user" ? (
                    <User className="size-4" />
                  ) : (
                    <Bot className="size-4" />
                  )}
                </span>
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-4 py-3",
                    message.role === "user"
                      ? "bg-secondary"
                      : message.error
                        ? "border border-destructive/40 bg-destructive/10"
                        : "glass-panel",
                  )}
                >
                  <p className="sr-only">
                    {message.role === "user" ? "You said" : "Assistant replied"}
                  </p>
                  {message.error ? (
                    <p className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
                      {message.content}
                    </p>
                  ) : (
                    <Markdown content={message.content} />
                  )}
                  {(message.sources?.length || message.demo) && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-2.5">
                      {message.demo && (
                        <Badge variant="outline" className="text-[10px]">
                          Demo mode
                        </Badge>
                      )}
                      {message.sources?.map((source) => (
                        <Badge key={source} variant="secondary" className="text-[10px] font-normal">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))
          )}

          {mutation.isPending && (
            <div className="flex items-center gap-3 text-sm text-muted-foreground" role="status">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12">
                <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
              </span>
              Searching the knowledge base…
            </div>
          )}
        </div>

        <form
          className="border-t border-border p-3 sm:p-4"
          onSubmit={(event) => {
            event.preventDefault();
            send(input);
          }}
        >
          <div className="flex items-end gap-2">
            <label htmlFor="agent-input" className="sr-only">
              Your question
            </label>
            <Textarea
              id="agent-input"
              rows={1}
              value={input}
              placeholder="Ask a support question…"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send(input);
                }
              }}
              className="max-h-40 min-h-11 resize-none bg-background/60"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send question"
              disabled={!input.trim() || mutation.isPending}
              className="size-11 shrink-0"
            >
              <ArrowUp className="size-4" aria-hidden="true" />
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Enter to send · Shift + Enter for a new line
          </p>
        </form>
      </section>
    </div>
  );
}