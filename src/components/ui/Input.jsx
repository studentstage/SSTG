export function Input({ label, error, id, className = "", ...props }) {
  const inputId = id || props.name;
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`min-h-11 w-full rounded-md border bg-background px-3 text-sm text-foreground placeholder:text-foreground/50 ${className}`}
        {...props}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
