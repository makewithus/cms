"use client";

import { useEffect, useState } from "react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export function AppLayout({ children, items, title, allowedRoles }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handle = (event) => {
      setIsMobile(event.matches);
      setSidebarOpen(false);
    };
    handle(mq);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--bg-primary)", position: "relative" }}>
        <Sidebar
          items={items}
          title={title}
          isOpen={isMobile && sidebarOpen}
          setIsOpen={setSidebarOpen}
          collapsed={!isMobile && collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          isMobile={isMobile}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
