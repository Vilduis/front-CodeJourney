import { cn } from "@/lib/utils";

const AuthorAvatar = ({ name, className }: { name: string; className?: string }) => (
  <span
    aria-hidden
    className={cn(
      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-codePrimary to-codeAccent font-bold text-white",
      className
    )}
  >
    {name.charAt(0).toUpperCase() || "U"}
  </span>
);

export default AuthorAvatar;
