import { cn } from "@/lib/cn";

const variants = {
  success:
    "bg-green-100 text-green-800 border-green-200",
  warn: "bg-amber-100 text-amber-800 border-amber-200",
  neutral:
    "bg-zinc-100 text-zinc-700 border-zinc-200",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
