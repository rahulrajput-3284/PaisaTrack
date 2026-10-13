import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!form.email.trim() || !form.password) {
      setError("Please enter both your email and password.");
      return;
    }

    setBusy(true);

    try {
      await login(form.email.trim(), form.password);

      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your email and password and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      {/* Left Side: Brand and Features */}
      <aside className="auth__aside">
        <Link
          to="/login"
          className="brand brand--light"
          style={{ textDecoration: "none" }}
        >
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
        </Link>

        <div className="auth__pitch">
          <h2>
            Every rupee counts.
            <br />
            Every expense matters.
          </h2>

          <p>
            Take control of your finances with a simple and
            intuitive expense tracker. Monitor your spending,
            understand your habits, and make smarter financial
            decisions.
          </p>

          <ul className="auth__points">
            <li>
              <span />
              Secure authentication
            </li>

            <li>
              <span />
              Category-wise spending analytics
            </li>

            <li>
              <span />
              Monthly financial insights
            </li>
          </ul>
        </div>

        <p className="auth__aside-foot">
          Built with MERN Stack · React · Node.js · MongoDB
        </p>
      </aside>

      {/* Right Side: Login Form */}
      <main className="auth__panel">
        <div className="auth__card">
          <div className="auth__head">
            <h1>Welcome back</h1>

            <p>Sign in to access your account.</p>
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
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="field">
              <label htmlFor="password">Password</label>

              <div className="input-icon">
                <Lock size={15} aria-hidden="true" />

                <input
                  id="password"
                  className="input"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Login Button */}
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

                  Signing in...
                </>
              ) : (
                <>
                  Sign In

                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Registration Link */}
          <p className="auth__switch">
            Don't have an account?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}