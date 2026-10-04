"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { Bell, ChevronDown, LogOut, Menu, Search, User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out");
      router.replace("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const initials = (user?.email || "U")
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

  return (
    <header
      style={{
        height: 60,
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px 0 16px",
        gap: 14,
        position: "sticky",
        top: 0,
        zIndex: 9,
        flexShrink: 0,
      }}
    >
      <button
        onClick={onMenuClick}
        className="btn btn-ghost topbar-menu-btn"
        style={{ padding: "6px 8px", flexShrink: 0 }}
        aria-label="Toggle menu"
      >
        <Menu size={18} />
      </button>

      <div className="topbar-search" style={{ flex: 1, maxWidth: 400, position: "relative" }}>
        <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
        <input
          type="text"
          placeholder="Search clients, projects..."
          className="input-base"
          style={{ paddingLeft: 32, paddingTop: 8, paddingBottom: 8, fontSize: 13, height: 36, background: "var(--bg-primary)" }}
        />
      </div>

      <div style={{ flex: 1 }} />

      <button className="btn btn-ghost" style={{ position: "relative", padding: "6px 8px", width: 36, height: 36, flexShrink: 0 }} title="Notifications">
        <Bell size={18} />
      </button>

      <div style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            background: "none",
            border: "1px solid transparent",
            cursor: "pointer",
            borderRadius: "var(--radius-sm)",
            transition: "background 0.15s",
            minWidth: 196,
            justifyContent: "flex-start",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--accent-blue-dim)",
              border: "1px solid var(--accent-blue)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--accent-blue)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div className="topbar-profile-text" style={{ textAlign: "left", display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.3 }}>
              {user?.email || "User"}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>
              {user?.role || "portal"}
            </span>
          </div>
          <ChevronDown size={13} color="var(--text-muted)" />
        </button>

        {menuOpen && (
          <div className="card" style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, minWidth: 180, padding: 6, zIndex: 100, boxShadow: "var(--shadow-lg)" }}>
            <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start", gap: 8, padding: "8px 10px" }} onClick={() => setMenuOpen(false)}>
              <User size={14} /> Profile
            </button>
            <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
            <button
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "flex-start", gap: 8, padding: "8px 10px", color: "var(--accent-red)" }}
              onClick={() => { setMenuOpen(false); setShowSignOutModal(true); }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </div>

      {showSignOutModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card" style={{ padding: 32, width: "100%", maxWidth: 400, boxShadow: "var(--shadow-lg)" }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Sign Out</div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
              Are you sure you want to sign out of your account?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleLogout}>Sign Out</button>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowSignOutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
