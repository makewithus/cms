import { cn } from "@/lib/utils/styles";

export function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "badge-green",
    secondary: "badge-gray",
    destructive: "badge-red",
    outline: "badge-gray",
  };

  return (
    <div
      className={cn(
        "badge",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
