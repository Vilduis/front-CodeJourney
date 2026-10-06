"use client";

import { useId, useRef, useState } from "react";
import { Bold, Code, Heading2, Italic, Link2, List, SquareCode } from "lucide-react";
import Markdown from "@/components/shared/Markdown";
import { cn } from "@/lib/utils";

type Action = {
  label: string;
  icon: typeof Bold;
  shortcut?: string;
  apply: (selected: string) => { text: string; cursor: [number, number] };
  articleOnly?: boolean;
};

const wrap = (before: string, after: string, placeholder: string) => (selected: string) => {
  const body = selected || placeholder;
  return { text: `${before}${body}${after}`, cursor: [before.length, before.length + body.length] as [number, number] };
};

const prefixLines = (prefix: string, placeholder: string) => (selected: string) => {
  const body = (selected || placeholder)
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
  return { text: body, cursor: [prefix.length, body.length] as [number, number] };
};

const ACTIONS: Action[] = [
  { label: "Título", icon: Heading2, apply: prefixLines("## ", "Título de sección"), articleOnly: true },
  { label: "Negrita", icon: Bold, shortcut: "b", apply: wrap("**", "**", "texto en negrita") },
  { label: "Cursiva", icon: Italic, shortcut: "i", apply: wrap("_", "_", "texto en cursiva") },
  { label: "Código en línea", icon: Code, shortcut: "e", apply: wrap("`", "`", "código") },
  { label: "Bloque de código", icon: SquareCode, apply: wrap("\n```js\n", "\n```\n", "// tu código aquí") },
  { label: "Lista", icon: List, apply: prefixLines("- ", "elemento") },
  { label: "Enlace", icon: Link2, apply: wrap("[", "](https://)", "texto del enlace") },
];

interface MarkdownEditorProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  variant?: "article" | "comment";
  placeholder?: string;
  label?: string;
  invalid?: boolean;
  describedBy?: string;
  minHeight?: string;
}

const MarkdownEditor = ({
  id,
  value,
  onChange,
  variant = "article",
  placeholder,
  label,
  invalid,
  describedBy,
  minHeight = "min-h-[240px]",
}: MarkdownEditorProps) => {
  const generatedId = useId();
  const textareaId = id ?? `${generatedId}-input`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const actions = ACTIONS.filter((action) => variant === "article" || !action.articleOnly);

  const runAction = (action: Action) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const { text, cursor } = action.apply(value.slice(start, end));
    onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + cursor[0], start + cursor[1]);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const action = actions.find((a) => a.shortcut === e.key.toLowerCase());
    if (action) {
      e.preventDefault();
      runAction(action);
    }
  };

  const tabClass = (active: boolean) =>
    cn(
      "h-9 rounded-md px-3 text-sm font-medium transition-colors",
      active ? "bg-white/10 text-white" : "text-white/65 hover:text-white"
    );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-white/4 transition-colors focus-within:border-codePrimary",
        invalid ? "border-red-500/60" : "border-white/12"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/8 px-2 py-1.5">
        <div role="tablist" aria-label={label ?? "Editor"} className="flex gap-1">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "write"}
            aria-controls={`${generatedId}-write`}
            className={tabClass(tab === "write")}
            onClick={() => setTab("write")}
          >
            Escribir
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "preview"}
            aria-controls={`${generatedId}-preview`}
            className={tabClass(tab === "preview")}
            onClick={() => setTab("preview")}
          >
            Vista previa
          </button>
        </div>

        {tab === "write" && (
          <div role="toolbar" aria-label="Formato" aria-controls={textareaId} className="flex flex-wrap gap-0.5">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                title={action.shortcut ? `${action.label} (Ctrl+${action.shortcut.toUpperCase()})` : action.label}
                aria-label={action.label}
                onClick={() => runAction(action)}
                className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/10 hover:text-white"
              >
                <action.icon size={16} aria-hidden />
              </button>
            ))}
          </div>
        )}
      </div>

      <div id={`${generatedId}-write`} role="tabpanel" hidden={tab !== "write"}>
        <textarea
          ref={textareaRef}
          id={textareaId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          spellCheck
          className={cn(
            "block w-full resize-y bg-transparent px-4 py-3 font-mono text-sm leading-relaxed text-white placeholder:text-white/50 focus:outline-none",
            minHeight
          )}
        />
      </div>

      <div
        id={`${generatedId}-preview`}
        role="tabpanel"
        hidden={tab !== "preview"}
        className={cn("px-4 py-3", minHeight)}
      >
        {value.trim() ? (
          <Markdown content={value} variant={variant} />
        ) : (
          <p className="text-sm text-white/60">Todavía no hay nada que previsualizar.</p>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
