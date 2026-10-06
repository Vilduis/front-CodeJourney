import EditorWindow, { CodeLine } from "@/components/shared/EditorWindow";

interface AuthShellProps {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  aside: { filename: string; language: string; lines: CodeLine[]; caption: string };
  children: React.ReactNode;
}

const AuthShell = ({ title, subtitle, footer, aside, children }: AuthShellProps) => (
  <div className="grid overflow-hidden rounded-xl border border-white/8 bg-surface-card text-white shadow-2xl shadow-black/40 md:grid-cols-[1fr_1.1fr]">
    <div className="flex flex-col gap-6 p-6 sm:p-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-white/70">{subtitle}</p>
      </div>
      {children}
      <p className="text-sm text-white/70">{footer}</p>
    </div>

    <div className="relative hidden flex-col justify-center gap-6 overflow-hidden border-l border-white/6 bg-surface-elevated p-10 md:flex">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 0%, rgba(124,58,237,0.22) 0%, transparent 60%)" }}
      />
      <EditorWindow filename={aside.filename} language={aside.language} lines={aside.lines} />
      <p className="relative max-w-sm text-sm leading-relaxed text-white/70">{aside.caption}</p>
    </div>
  </div>
);

export default AuthShell;
