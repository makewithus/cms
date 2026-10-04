"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  BarChart3,
  ChevronLeft,
  ClipboardList,
  FolderOpen,
  LayoutDashboard,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const iconMap = {
  Dashboard: LayoutDashboard,
  Clients: Users,
  Developers: ShieldCheck,
  Projects: ClipboardList,
  "Audit Log": BarChart3,
  "My Projects": FolderOpen,
};

export function Sidebar({ items = [], title = "Portal", isOpen, setIsOpen, collapsed = false, onToggle, isMobile = false }) {
  const pathname = usePathname();
  const isCollapsed = collapsed && !isOpen;

  return (
    <>
      {isOpen && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 40,
          }}
          className="md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        style={{
          position: isOpen ? "fixed" : "relative",
          display: isMobile && !isOpen ? "none" : "flex",
          insetBlock: isOpen ? 0 : "auto",
          left: isOpen ? 0 : "auto",
          zIndex: isOpen ? 50 : "auto",
          width: isCollapsed ? 88 : 260,
          minWidth: isCollapsed ? 88 : 260,
          background: "var(--bg-dark)",
          borderRight: "1px solid var(--border)",
          flexDirection: "column",
          transition: "width 0.18s cubic-bezier(0.4,0,0.2,1), min-width 0.18s cubic-bezier(0.4,0,0.2,1)",
          willChange: "width",
          overflow: "hidden",
          height: "100vh",
          flexShrink: 0,
        }}
      >
        <div style={{ height: 80, display: "flex", alignItems: "center", padding: isCollapsed ? "0 24px" : "0 28px", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", opacity: isCollapsed ? 0 : 1, transform: isCollapsed ? "translateX(-15px)" : "translateX(0)", transition: "opacity 0.18s cubic-bezier(0.4,0,0.2,1), transform 0.18s cubic-bezier(0.4,0,0.2,1)", pointerEvents: isCollapsed ? "none" : "auto", whiteSpace: "nowrap", width: 148 }}>
            <Image
              src="/images/logo.png"
              alt="MakeWithUs"
              width={132}
              height={27}
              priority
              style={{
                display: "block",
                width: 132,
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          <button
            className="hidden md:flex"
            onClick={onToggle}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{ position: "absolute", right: isCollapsed ? 30 : 20, top: 26, width: 28, height: 28, border: "none", background: "transparent", color: "var(--text-muted)", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "right 0.18s cubic-bezier(0.4,0,0.2,1), color 0.15s" }}
            onMouseOver={(e) => { e.currentTarget.style.color = "var(--text-inverse)"; }}
            onMouseOut={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            <ChevronLeft size={18} style={{ transform: isCollapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)" }} />
          </button>

          <button className="md:hidden" style={{ position: "absolute", right: 20, top: 26, width: 28, height: 28, border: "none", background: "transparent", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav style={{ flex: 1, padding: "32px 16px", overflowY: "auto", overflowX: "hidden" }}>
          {!isCollapsed && (
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)", padding: "0 4px", marginBottom: 10 }}>
              {title}
            </div>
          )}
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = iconMap[item.name] || LayoutDashboard;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen && setIsOpen(false)}
                title={isCollapsed ? item.name : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: isCollapsed ? "12px 0" : "12px 16px",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  marginBottom: 2,
                  textDecoration: "none",
                  color: isActive ? "#fff" : "var(--text-inverse)",
                  background: isActive ? "var(--brand-red)" : "transparent",
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  transition: "background 0.12s, color 0.12s, padding 0.18s cubic-bezier(0.4,0,0.2,1)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  border: isActive ? "none" : "1px solid transparent",
                  borderRadius: 0,
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,49,49,0.12)";
                    e.currentTarget.style.color = "#fff";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-inverse)";
                  }
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} style={{ minWidth: 18, flexShrink: 0 }} />
                <span style={{ opacity: isCollapsed ? 0 : 1, maxWidth: isCollapsed ? 0 : 200, transition: "opacity 0.13s ease, max-width 0.18s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden", whiteSpace: "nowrap", letterSpacing: "-0.02em" }}>
                {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
