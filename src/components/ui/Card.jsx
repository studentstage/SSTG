export function Card({ children, className = "", ...props }) {
  return (
    <section
      className={`rounded-lg border bg-surface text-foreground shadow-sm ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

Card.Header = ({ children, className = "", ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);
Card.Title = ({ children, className = "", ...props }) => (
  <h2 className={`text-lg font-semibold ${className}`} {...props}>
    {children}
  </h2>
);
Card.Content = ({ children, className = "", ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);
Card.Footer = ({ children, className = "", ...props }) => (
  <div className={`mt-6 border-t pt-4 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
