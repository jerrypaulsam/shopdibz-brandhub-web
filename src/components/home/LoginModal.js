import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  clearAuthSession,
  getBrowserLocation,
  loginSeller,
  saveAuthSession,
} from "@/src/api/auth";
import { logScreenView } from "@/src/api/analytics";

/**
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
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

    clearAuthSession();
    logScreenView("login_dialog", "Anonymous", "store");
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

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
      const result = await loginSeller({ email, password, loc });
      saveAuthSession(result.data);
      setMessage("Login successful.");
      onClose();
      await router.replace("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <div className="relative max-h-[90vh] w-full max-w-[600px] overflow-y-auto rounded-[15px] border border-white/10 bg-brand-black px-5 py-8 text-brand-white shadow-2xl sm:px-8 sm:py-10">
        <button
          className="absolute right-4 top-4 h-9 w-9 rounded-sm border border-white/20 text-brand-white hover:border-brand-gold hover:text-brand-gold"
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

          <label className="mt-10 block text-sm font-semibold text-white/80">
            Email
            <input
              className="mt-3 h-14 w-full rounded-sm border border-white/20 bg-transparent px-4 text-base text-brand-white outline-none transition-colors placeholder:text-white/35 focus:border-brand-gold"
              type="email"
              value={email}
              placeholder="Email"
              autoComplete="email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="mt-8 block text-sm font-semibold text-white/80">
            Password
            <input
              className="mt-3 h-14 w-full rounded-sm border border-white/20 bg-transparent px-4 text-base text-brand-white outline-none transition-colors placeholder:text-white/35 focus:border-brand-gold"
              type="password"
              value={password}
              placeholder="Password"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {message ? (
            <p className="mt-6 text-center text-sm text-brand-gold">{message}</p>
          ) : null}

          <button
            className="mt-12 h-14 w-full rounded-sm bg-brand-gold text-sm font-extrabold uppercase tracking-[0.18em] text-brand-black transition-colors hover:bg-brand-white disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="mt-8 text-center text-sm text-white/45">
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
    </div>
  );
}
