import { Terminal, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

export type Token = [text: string, className: string];
export type CodeLine = { indent?: boolean | 2; tokens: Token[] };

export const SYNTAX = {
  keyword: "text-purple-400",
  name: "text-blue-300",
  type: "text-green-300",
  string: "text-orange-300",
  fn: "text-yellow-200",
  brace: "text-yellow-300",
  comment: "text-gray-400",
  plain: "text-white",
  heading: "text-purple-300 font-semibold",
  marker: "text-codeAccent",
} as const;

interface EditorWindowProps {
  filename: string;
  language: string;
  lines: CodeLine[];
  className?: string;
}

const EditorWindow = ({ filename, language, lines, className }: EditorWindowProps) => (
  <div
    aria-hidden
    className={cn(
      "relative z-10 overflow-hidden rounded-2xl border border-white/8 bg-surface-elevated shadow-2xl shadow-black/60",
      className
    )}
  >
    <div className="flex items-center gap-2 border-b border-white/8 bg-surface-card/80 px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-red-500/80" />
      <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
      <span className="h-3 w-3 rounded-full bg-green-500/80" />
      <div className="ml-3 flex items-center gap-2 rounded-md bg-gray-900/60 px-3 py-1">
        <Terminal size={12} className="text-gray-200" />
        <span className="font-mono text-xs text-gray-200">{filename}</span>
      </div>
    </div>

    <div className="select-none overflow-x-auto bg-surface-base/60 p-5 font-mono text-sm leading-relaxed">
      {lines.map((line, index) => (
        <div key={index} className="flex whitespace-pre">
          <span className="mr-4 w-8 shrink-0 text-right text-gray-600">{index + 1}</span>
          <span className={line.indent === 2 ? "pl-12" : line.indent ? "pl-6" : undefined}>
            {line.tokens.map(([text, tokenClass], i) => (
              <span key={i} className={tokenClass}>
                {text}
              </span>
            ))}
          </span>
        </div>
      ))}
      <div className="mt-1 flex">
        <span className="mr-4 w-8 shrink-0 text-right text-gray-600">{lines.length + 1}</span>
        <span className="inline-block h-5 w-2 bg-codeAccent/80 motion-safe:animate-pulse" />
      </div>
    </div>

    <div className="flex items-center justify-between border-t border-white/6 bg-codePrimary/10 px-4 py-2">
      <div className="flex items-center gap-2">
        <GitBranch size={12} className="text-gray-200" />
        <span className="font-mono text-xs text-gray-200">main</span>
      </div>
      <span className="font-mono text-xs text-gray-400">{language}</span>
    </div>
  </div>
);

export default EditorWindow;
