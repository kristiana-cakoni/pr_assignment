import { useId, useState } from "react";
import type { FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../lib/session.ts";
import { useAuth } from "../state/auth-context.tsx";

type FieldErrors = {
  email?: string;
  password?: string;
};

export function LoginPage() {
  const { session, login } = useAuth();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  if (session) return <Navigate to="/" replace />;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    setFormError(null);
    if (nextErrors.email || nextErrors.password) return;

    setSubmitting(true);
    const message = await login(email, password);
    if (message) {
      setFormError(message);
      setSubmitting(false);
    }
  }

  return (
    <main className="login-screen">
      <form className="login-card" onSubmit={onSubmit} noValidate>
        <h1>MarketOne</h1>
        <p className="login-sub">Hyr për të vazhduar</p>

        <label className="field" htmlFor={emailId}>
          <span>E-mail</span>
          <input
            id={emailId}
            type="email"
            autoComplete="username"
            value={email}
            disabled={submitting}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            onChange={(event) => setEmail(event.target.value)}
          />
          {errors.email && (
            <small id={`${emailId}-error`} className="field-error">
              {errors.email}
            </small>
          )}
        </label>

        <label className="field" htmlFor={passwordId}>
          <span>Fjalëkalimi</span>
          <input
            id={passwordId}
            type="password"
            autoComplete="current-password"
            value={password}
            disabled={submitting}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? `${passwordId}-error` : undefined}
            onChange={(event) => setPassword(event.target.value)}
          />
          {errors.password && (
            <small id={`${passwordId}-error`} className="field-error">
              {errors.password}
            </small>
          )}
        </label>

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <button type="submit" className="btn btn-brand btn-block" disabled={submitting}>
          {submitting ? "Duke hyrë…" : "Hyr"}
        </button>

        <p className="login-hint">
          Hyrje e simuluar. Përdor <strong>{DEMO_EMAIL}</strong> dhe fjalëkalimin{" "}
          <strong>{DEMO_PASSWORD}</strong>.
        </p>
      </form>
    </main>
  );
}

function validate(email: string, password: string): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = email.trim();
  if (!trimmed) errors.email = "Shkruani email-in.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) errors.email = "Email-i nuk është i vlefshëm.";
  if (!password) errors.password = "Shkruani fjalëkalimin.";
  else if (password.length < 6) errors.password = "Fjalëkalimi duhet të ketë të paktën 6 karaktere.";
  return errors;
}
