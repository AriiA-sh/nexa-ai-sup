import { Fragment, type ReactNode } from "react";

/** Minimal inline formatter: **bold**, _italic_, `code`. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("_") && part.endsWith("_") && part.length > 2) {
      return (
        <em key={key} className="text-muted-foreground">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={key} className="rounded bg-muted px-1.5 py-0.5 text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={key}>{part}</Fragment>;
  });
}

export interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * Small purpose-built markdown renderer for agent answers and KB articles.
 * Supports headings, unordered/ordered lists, and paragraphs.
 */
export function Markdown({ content, className }: MarkdownProps) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];
  let listOrdered = false;

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    const items = listBuffer.map((item, index) => (
      <li key={`${key}-li-${index}`} className="leading-relaxed">
        {renderInline(item, `${key}-li-${index}`)}
      </li>
    ));
    blocks.push(
      listOrdered ? (
        <ol key={key} className="ml-5 list-decimal space-y-1.5 text-sm">
          {items}
        </ol>
      ) : (
        <ul key={key} className="ml-5 list-disc space-y-1.5 text-sm">
          {items}
        </ul>
      ),
    );
    listBuffer = [];
  };

  lines.forEach((rawLine, index) => {
    const line = rawLine.trimEnd();
    const key = `block-${index}`;

    if (line.trim() === "") {
      flushList(`${key}-list`);
      return;
    }

    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.*)$/);

    if (bullet?.[1]) {
      if (listOrdered) flushList(`${key}-list`);
      listOrdered = false;
      listBuffer.push(bullet[1]);
      return;
    }
    if (ordered?.[1]) {
      if (!listOrdered) flushList(`${key}-list`);
      listOrdered = true;
      listBuffer.push(ordered[1]);
      return;
    }

    flushList(`${key}-list`);

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading?.[2]) {
      const level = heading[1]!.length;
      const text = heading[2];
      blocks.push(
        level <= 2 ? (
          <h3 key={key} className="mt-1 text-sm font-semibold tracking-tight text-foreground">
            {renderInline(text, key)}
          </h3>
        ) : (
          <h4 key={key} className="text-sm font-semibold text-foreground">
            {renderInline(text, key)}
          </h4>
        ),
      );
      return;
    }

    blocks.push(
      <p key={key} className="text-sm leading-relaxed">
        {renderInline(line, key)}
      </p>,
    );
  });

  flushList("tail-list");

  return <div className={className ? `space-y-3 ${className}` : "space-y-3"}>{blocks}</div>;
}
