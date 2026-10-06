import { cn } from "@/lib/utils";

export const Spinner = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center min-h-screen", className)}>
    <div className="animate-spin rounded-full h-16 w-16 border-2 border-t-codeAccent border-b-transparent border-l-transparent border-r-transparent" />
  </div>
);
