export function Spinner({ label = "Loading" }) {
  return (
    <span
      role="status"
      aria-label={label}
      className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}
export function EmptyState({ title, description }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <h2 className="font-semibold">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-foreground/70">{description}</p>
      )}
    </div>
  );
}
export function ErrorState({ title = "Something went wrong", onRetry }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-destructive/40 bg-destructive/10 p-6"
    >
      <h2 className="font-semibold">{title}</h2>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 min-h-11 rounded-md bg-destructive px-4 text-sm font-semibold text-white"
        >
          Try again
        </button>
      )}
    </div>
  );
}
