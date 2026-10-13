import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const strong = form.password.length >= 6;

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // Validate password length
    if (!strong) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setBusy(true);

    try {
      await register(
        form.name.trim(),
        form.email.trim(),
        form.password
      );

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      {/* Left Side: Branding and Features */}
      <aside className="auth__aside">
        <span className="brand brand--light">
          <span className="brand__mark">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9m-9 9a9 9 0 0 1 9-9" />
            </svg>
          </span>

          PaisaTrack
        </span>

        <div className="auth__pitch">
          <h2>
            Take control of your money.
            <br />
            Build better habits.
          </h2>

          <p>
            Create your account and start tracking your expenses
            in seconds. Understand your spending habits and make
            smarter financial decisions with PaisaTrack.
          </p>

          <ul className="auth__points">
            <li>
              <span />
              Secure password hashing
            </li>

            <li>
              <span />
              Private, user-specific expense data
            </li>

            <li>
              <span />
              Free to get started
            </li>
          </ul>
        </div>

        <p className="auth__aside-foot">
          Built with MERN Stack · React · Node.js · MongoDB
        </p>
      </aside>

      {/* Right Side: Registration Form */}
      <main className="auth__panel">
        <div className="auth__card">
          <div className="auth__head">
            <h1>Create your account</h1>

            <p>
              Get started with your personal expense tracker.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="alert alert--error"
              role="alert"
            >
              <AlertCircle size={15} />

              <span>{error}</span>
            </div>
          )}

          <form onSubmit={submit}>
            {/* Full Name */}
            <div className="field">
              <label htmlFor="name">Full Name</label>

              <div className="input-icon">
                <User size={15} aria-hidden="true" />

                <input
                  id="name"
                  className="input"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="field">
              <label htmlFor="email">Email Address</label>

              <div className="input-icon">
                <Mail size={15} aria-hidden="true" />

                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label htmlFor="password">Password</label>

              <div className="input-icon">
                <Lock size={15} aria-hidden="true" />

                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder="Enter at least 6 characters"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  minLength={6}
                  required
                />
              </div>

              {form.password && (
                <span
                  className={`field__hint${
                    strong ? " is-ok" : ""
                  }`}
                >
                  {strong ? <Check size={12} /> : null}

                  {strong
                    ? "Password meets the minimum length requirement."
                    : "Password must contain at least 6 characters."}
                </span>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              className="btn btn--primary btn--block"
              disabled={busy}
              style={{ marginTop: 8 }}
            >
              {busy ? (
                <>
                  <Loader2
                    size={15}
                    className="spin"
                  />

                  Creating account...
                </>
              ) : (
                <>
                  Create Account

                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="auth__switch">
            Already have an account?{" "}
            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}