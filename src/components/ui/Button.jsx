export function Button({
  children,
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:brightness-95",
    ghost: "text-foreground hover:bg-surface-muted",
    destructive: "bg-destructive text-white hover:opacity-90",
  };
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;
