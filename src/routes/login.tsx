import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <div className="app-shell py-12">
      <div className="panel-surface mx-auto max-w-md p-6 sm:p-8">
        <p className="eyebrow">Salty & Clever</p>
        <h1 className="mt-2 font-display text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-stone-deep">
          Optional. The desk works locally. Sign in only if you want a household
          inventory saved to your account.
        </p>
        <div className="mt-6 space-y-3">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/inventory" })}
                className="btn btn-primary w-full"
              >
                Continue with {p.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
        <Link to="/" className="btn btn-ghost mt-4 w-full">
          Back to the report
        </Link>
      </div>
    </div>
  );
}
