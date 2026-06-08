import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ForgotPasswordDialog from "@/src/components/auth/ForgotPasswordDialog";
import {
  clearAuthSession,
  getBrowserLocation,
  loginSeller,
  saveAuthSession,
} from "@/src/api/auth";
import { logScreenView, trackLoginComplete } from "@/src/api/analytics";

/**
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  /** @type {[boolean, import("react").Dispatch<import("react").SetStateAction<boolean>>]} */
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  /** @type {[string, import("react").Dispatch<import("react").SetStateAction<string>>]} */
  const [email, setEmail] = useState("");
  /** @type {[string, import("react").Dispatch<import("react").SetStateAction<string>>]} */
  const [password, setPassword] = useState("");
  /** @type {[string, import("react").Dispatch<import("react").SetStateAction<string>>]} */
  const [message, setMessage] = useState("");
  /** @type {[boolean, import("react").Dispatch<import("react").SetStateAction<boolean>>]} */
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    clearAuthSession({ clearServerCookies: false });
    logScreenView("login_dialog", "Anonymous", "store");
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const isErrorMessage = Boolean(message) && !/^login successful\.?$/i.test(message);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const loc = await getBrowserLocation();
      const result = await loginSeller({ email: email.toLowerCase(), password, loc });
      saveAuthSession(result.data);
      trackLoginComplete();
      setMessage("Login successful.");
      setForgotPasswordOpen(false);
      onClose();
      await router.replace("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="theme-overlay fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
      <div className="theme-surface relative max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-[15px] border px-5 py-8 text-brand-white shadow-2xl sm:px-8 sm:py-10">
        <button
          className="theme-action-neutral absolute right-4 top-4 h-9 w-9 rounded-sm border transition-colors"
          type="button"
          aria-label="Close login dialog"
          onClick={onClose}
        >
          x
        </button>

        <form className="mx-auto max-w-md" onSubmit={handleSubmit}>
          <h2 className="text-center text-3xl font-extrabold tracking-wide">
            LOGIN
          </h2>
          <div className="mx-auto mt-3 h-0.5 w-8 bg-brand-gold" />

          <label className="theme-text-muted-strong mt-10 block text-sm font-semibold">
            Email
            <input
              className="theme-field mt-3 h-14 w-full rounded-sm border px-4 text-base outline-none transition-colors placeholder:text-white/35 focus:border-brand-gold"
              type="email"
              value={email}
              placeholder="Email"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="theme-text-muted-strong mt-8 block text-sm font-semibold">
            Password
            <input
              className="theme-field mt-3 h-14 w-full rounded-sm border px-4 text-base outline-none transition-colors placeholder:text-white/35 focus:border-brand-gold"
              type="password"
              value={password}
              placeholder="Password"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <div className="mt-4 text-right">
            <button
              className="text-sm font-bold text-brand-gold transition-colors hover:text-brand-white"
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
            >
              Forgot Password?
            </button>
          </div>

          {message ? (
            <p
              className={`mt-6 text-center text-sm ${
                isErrorMessage
                  ? "text-red-300 [html[data-theme='light']_&]:text-red-700"
                  : "text-brand-gold"
              }`}
            >
              {message}
            </p>
          ) : null}

          <button
            className="mt-12 h-14 w-full rounded-sm bg-brand-gold text-sm font-extrabold uppercase tracking-[0.18em] text-brand-black transition-colors hover:bg-brand-white disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="theme-text-muted mt-8 text-center text-sm">
            Don&apos;t have an account?
          </p>
          <Link
            className="mt-2 flex items-center justify-center gap-2 text-sm font-bold text-brand-red hover:text-brand-gold"
            href="/new-mobile-verify"
            onClick={onClose}
          >
            Sign Up
            <span aria-hidden="true">-&gt;</span>
          </Link>
        </form>
      </div>
      {forgotPasswordOpen ? (
        <ForgotPasswordDialog
          open={forgotPasswordOpen}
          initialEmail={email}
          onClose={() => setForgotPasswordOpen(false)}
        />
      ) : null}
    </div>
  );
}
