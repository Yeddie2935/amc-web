interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="fmj-empty-state">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
