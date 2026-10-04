"use client";

import { useEffect, useState } from "react";
import { getClients } from "@/lib/services/clients";
import { getProjects } from "@/lib/services/projects";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    completedProjects: 0,
    atRisk: 0,
    nearingDeadline: 0,
    waitingForClient: 0,
    recentlyUpdated: 0,
    noRecentUpdates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [clients, projects] = await Promise.all([
          getClients(),
          getProjects()
        ]);
        
        const now = new Date();
        const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

        setStats({
          totalClients: clients.length,
          activeProjects: projects.filter(p => !['completed', 'delivered'].includes(p.status)).length,
          completedProjects: projects.filter(p => ['completed', 'delivered'].includes(p.status)).length,
          atRisk: projects.filter(p => p.health === 'at_risk' || p.health === 'delayed').length,
          nearingDeadline: projects.filter(p => p.expectedDeliveryDate && new Date(p.expectedDeliveryDate) <= sevenDaysFromNow && new Date(p.expectedDeliveryDate) >= now && !['completed', 'delivered'].includes(p.status)).length,
          waitingForClient: projects.filter(p => p.status === 'client_review').length,
          recentlyUpdated: projects.filter(p => p.updatedAt && new Date(p.updatedAt) >= threeDaysAgo).length,
          noRecentUpdates: projects.filter(p => p.updatedAt && new Date(p.updatedAt) < sevenDaysAgo && !['completed', 'delivered'].includes(p.status)).length,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Project, client, and delivery health overview</p>
        </div>
        <span className="badge badge-red">CMS</span>
      </div>
      
      {loading ? (
        <div className="stats-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="card animate-pulse" style={{ height: 112 }} />
          ))}
        </div>
      ) : (
        <div className="stats-grid">
          <StatCard title="TOTAL CLIENTS" value={stats.totalClients} />
          <StatCard title="ACTIVE PROJECTS" value={stats.activeProjects} />
          <StatCard title="COMPLETED" value={stats.completedProjects} />
          <StatCard title="AT RISK" value={stats.atRisk} />
          <StatCard title="NEARING DEADLINE" value={stats.nearingDeadline} />
          <StatCard title="WAITING FOR CLIENT" value={stats.waitingForClient} />
          <StatCard title="RECENTLY UPDATED" value={stats.recentlyUpdated} />
          <StatCard title="NO RECENT UPDATES" value={stats.noRecentUpdates} />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="badge badge-gray">{title}</div>
      <div className="stat-divider" />
      <div style={{ fontSize: 30, lineHeight: 1, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.04em" }}>{value}</div>
    </div>
  );
}
