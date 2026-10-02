import type { ReactNode } from "react";

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="state-card">
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state-card state-card-error" role="alert">
      <h3>Diçka shkoi keq</h3>
      <p>{message}</p>
      <button type="button" className="btn btn-navy" onClick={onRetry}>
        Provo përsëri
      </button>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="skeleton-list" aria-busy="true" aria-live="polite">
      <p className="sr-only">Duke ngarkuar produktet…</p>
      {["a", "b", "c", "d", "e", "f"].map((key) => (
        <div className="skeleton-row" key={key}>
          <span className="skeleton skeleton-lg" />
          <span className="skeleton" />
          <span className="skeleton skeleton-sm" />
        </div>
      ))}
    </div>
  );
}
