import { cn } from "@/lib/utils/styles";

export function Button({ className, variant = "primary", size = "default", ...props }) {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-secondary",
    ghost: "btn-ghost",
    destructive: "btn-danger",
  };
  
  const sizes = {
    default: "",
    sm: "px-3 py-2 text-xs",
    lg: "px-8 py-3",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      className={cn("btn", variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
