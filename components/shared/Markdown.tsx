"use client";

import { isValidElement, useRef, useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGE_LABELS: Record<string, string> = {
  js: "JavaScript",
  javascript: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  typescript: "TypeScript",
  tsx: "TSX",
  py: "Python",
  python: "Python",
  java: "Java",
  cs: "C#",
  csharp: "C#",
  cpp: "C++",
  go: "Go",
  rust: "Rust",
  php: "PHP",
  sql: "SQL",
  bash: "Terminal",
  sh: "Terminal",
  shell: "Terminal",
  json: "JSON",
  html: "HTML",
  css: "CSS",
};

const CodeBlock = ({ children }: { children?: React.ReactNode }) => {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const codeClass = isValidElement<{ className?: string }>(children) ? children.props.className ?? "" : "";
  const language = /language-([\w-]+)/.exec(codeClass)?.[1];
  const label = language ? LANGUAGE_LABELS[language] ?? language : "Código";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(preRef.current?.innerText ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="md-code">
      <div className="md-code-bar">
        <span>{label}</span>
        <button type="button" onClick={copy} className="md-code-copy" aria-label={copied ? "Código copiado" : "Copiar código"}>
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          <span aria-live="polite">{copied ? "Copiado" : "Copiar"}</span>
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
};

const baseComponents: Components = {
  pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer nofollow ugc">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="md-table">
      <table>{children}</table>
    </div>
  ),
};

const articleComponents: Components = {
  ...baseComponents,
  h1: ({ children }) => <h2>{children}</h2>,
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ""} loading="lazy" decoding="async" />
    ) : null,
};

const COMMENT_DISALLOWED = ["h1", "h2", "h3", "h4", "h5", "h6", "img", "table", "hr"];

interface MarkdownProps {
  content: string;
  variant?: "article" | "comment";
  className?: string;
}

const Markdown = ({ content, variant = "article", className }: MarkdownProps) => (
  <div className={cn("markdown", variant === "comment" && "markdown-comment", className)}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { detect: false }]]}
      components={variant === "article" ? articleComponents : baseComponents}
      disallowedElements={variant === "comment" ? COMMENT_DISALLOWED : undefined}
      unwrapDisallowed
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default Markdown;
