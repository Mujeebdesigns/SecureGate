interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ backgroundColor: "var(--background-page)" }}>
      <div className="w-full max-w-md rounded-lg p-8"
           style={{
             backgroundColor: "var(--background-surface)",
             boxShadow: "var(--shadow-md)",
             border: "1px solid var(--border-default)",
           }}>
        <div className="mb-6 text-center">
          <h1 style={{
            fontSize: "var(--heading-h2-size)",
            lineHeight: "var(--heading-h2-lh)",
            fontWeight: "var(--heading-h2-weight)",
            color: "var(--text-primary)",
          }}>
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2"
               style={{
                 fontSize: "var(--body-small-size)",
                 color: "var(--text-secondary)",
               }}>
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
