"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { AlertCircle, Building2, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // True once Firebase auth has confirmed the credentials; we stay in a loading
  // state through this until the user's role resolves and we redirect, so the
  // form never looks "done" while it's actually still waiting on that lookup.
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") router.replace("/admin/dashboard");
      else if (user.role === "developer") router.replace("/developer/dashboard");
      else if (user.role === "client") router.replace("/client/dashboard");
      else router.replace("/unauthorized");
    } else if (isSignedIn && !loading && !user) {
      // Sign-in succeeded but no valid account profile could be loaded
      // (AuthContext already signed the session back out) - don't hang forever.
      setIsSignedIn(false);
      setIsLoading(false);
      toast.error("Unable to load your account. Please contact an admin.");
    }
  }, [user, loading, router, isSignedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Successfully logged in!");
      setIsSignedIn(true);
      // Keep isLoading true - the effect above redirects once the role resolves.
    } catch (err) {
      console.error(err);
      let errorMessage = "Invalid email or password. Please try again.";
      if (err.code) {
        switch (err.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            errorMessage = "Invalid email or password.";
            break;
          case 'auth/too-many-requests':
            errorMessage = "Too many failed attempts. Please try again later.";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Network error. Please check your internet connection.";
            break;
          default:
            errorMessage = "An error occurred during sign in. Please try again.";
        }
      } else if (err.message) {
        if (err.message.includes("Firebase API key missing")) {
            errorMessage = "Server configuration error. Please contact support.";
        }
      }
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  // Only the true initial bootstrap check should show the full-page loader.
  // Once a submit is in flight (isSignedIn), `loading` also flips true again while
  // the profile lookup resolves - the submit button's own "Redirecting..." label
  // already covers that, so don't blank out the form underneath it.
  if (loading && !isSignedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 32,
              height: 32,
              border: "2.5px solid var(--accent-blue)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.75s linear infinite",
            }}
          />
          <span style={{ fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.02em" }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="split-layout" style={{ height: "100dvh", width: "100%", overflow: "hidden" }}>
      <section
        className="hidden md:flex w-full md:w-[55%]"
        style={{
          background: "var(--bg-dark)",
          position: "relative",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
            paddingTop: "clamp(24px, 4vw, 48px)",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-inverse)", letterSpacing: "-0.08em", textTransform: "uppercase" }}>
            makewithus
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
            paddingTop: "clamp(20px, 3vw, 40px)",
            paddingBottom: "clamp(20px, 3vw, 40px)",
          }}
        >
          <h1
            style={{
              fontFamily: "'Helvetica', Arial, sans-serif",
              fontSize: "clamp(48px, 6vw, 84px)",
              lineHeight: 0.95,
              fontWeight: 800,
              color: "var(--text-inverse)",
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
            }}
          >
            Client<br />
            Project<br />
            <span style={{ color: "var(--brand-red)" }}>Portal</span>
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "clamp(14px, 1.2vw, 16px)",
              lineHeight: 1.5,
              fontWeight: 400,
              marginTop: 40,
              maxWidth: 430,
              letterSpacing: "-0.01em",
            }}
          >
            Track milestones, manage clients, coordinate developers, and keep every project phase transparent from kickoff to delivery.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginTop: 48, border: "1px solid var(--border-strong)", width: "fit-content" }}>
            {[
              { label: "Projects", value: "360°" },
              { label: "Updates", value: "Live" },
              { label: "Access", value: "24/7" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "16px 24px",
                  background: "transparent",
                  borderRight: index !== 2 ? "1px solid var(--border-strong)" : "none",
                  minWidth: 100,
                }}
              >
                <span style={{ fontSize: 24, fontWeight: 700, color: "var(--text-inverse)", lineHeight: 1, letterSpacing: "-0.04em" }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            borderTop: "1px solid var(--border-strong)",
            paddingTop: 24,
            paddingBottom: "clamp(24px, 3vw, 40px)",
            paddingLeft: "clamp(24px, 4vw, 48px)",
            paddingRight: "clamp(24px, 4vw, 48px)",
          }}
        >
          <p style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.05em", fontWeight: 500 }}>
            TRANSPARENT · ACCOUNTABLE · OPERATIONAL
          </p>
        </div>
      </section>

      <section
        className="w-full md:w-[45%]"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "var(--bg-primary)",
          padding: "clamp(16px, 4vw, 48px)",
          position: "relative",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div style={{ position: "absolute", bottom: -50, right: -50, opacity: 0.03, pointerEvents: "none" }}>
          <Building2 size={400} />
        </div>

        <div style={{ width: "100%", maxWidth: 400, margin: "auto", position: "relative", zIndex: 10 }}>
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck size={18} style={{ color: "var(--text-primary)" }} strokeWidth={1.5} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              CMS PORTAL
            </span>
          </div>

          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.04em",
              marginBottom: 6,
              lineHeight: 1.1,
              textTransform: "uppercase",
            }}
          >
            Sign In
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 32, lineHeight: 1.5 }}>
            Enter your credentials to access your workspace.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="block" style={{ fontSize: 11, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", fontWeight: 500 }}>
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "transparent",
                    border: "1px solid var(--border-strong)",
                    borderRadius: 0,
                    fontSize: 14,
                    color: "var(--text-primary)",
                    outline: "none",
                    transition: "border-color 0.15s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--text-primary)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                />
              </div>

              <div>
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <label className="block" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", fontWeight: 500 }}>
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 500, textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.05em" }}
                  >
                    Forgot?
                  </Link>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    style={{
                      width: "100%",
                      padding: "12px 42px 12px 14px",
                      background: "transparent",
                      border: "1px solid var(--border-strong)",
                      borderRadius: 0,
                      fontSize: 14,
                      color: "var(--text-primary)",
                      outline: "none",
                      transition: "border-color 0.15s",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "var(--text-primary)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--text-muted)",
                      display: "flex",
                      padding: 0,
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: isLoading ? "var(--text-muted)" : "var(--bg-dark)",
                  color: "var(--text-inverse)",
                  padding: "14px 16px",
                  borderRadius: 0,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
                onMouseOver={(e) => {
                  if (!isLoading) e.currentTarget.style.background = "var(--brand-red)";
                }}
                onMouseOut={(e) => {
                  if (!isLoading) e.currentTarget.style.background = "var(--bg-dark)";
                }}
              >
                {isLoading && <Loader2 size={15} className="animate-spin" />}
                {isSignedIn ? "Redirecting" : isLoading ? "Signing in" : "Sign in"}
              </button>
            </div>
          </form>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 32, padding: "12px 14px", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
            <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, lineHeight: 1.5 }}>
              Access is restricted to assigned client, developer, and admin accounts.
            </p>
          </div>

          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 48, lineHeight: 1.5, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            MWU INTERNAL PLATFORM · Encrypted Session
          </p>
        </div>
      </section>
    </div>
  );
}
