"use client";

import { useEffect, useState } from "react";
import { getProjectsByDeveloper } from "@/lib/services/projects";
import { useAuth } from "@/lib/auth/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { getCurrentStage } from "@/components/projects/MilestoneTracker";

export default function DeveloperDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      if (user?.uid) {
        try {
          const data = await getProjectsByDeveloper(user.uid);
          setProjects(data);
        } catch (error) {
          console.error("Error loading developer projects:", error);
          toast.error("Failed to load your projects");
        } finally {
          setLoading(false);
        }
      }
    }
    loadProjects();
  }, [user]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Assigned Projects</h1>
          <p className="page-subtitle">Manage implementation work and delivery status</p>
        </div>
        <span className="badge badge-red">DEVELOPER</span>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="card animate-pulse" style={{ height: 128 }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>No projects assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map(project => (
            <div key={project.id} className="card flex flex-col justify-between" style={{ padding: 24 }}>
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg leading-tight">{project.name}</h3>
                  <span className="badge badge-gray shrink-0 ml-2">{project.status}</span>
                </div>
                {project.description && (
                  <p className="text-sm line-clamp-2 mb-6" style={{ color: "var(--text-secondary)" }}>{project.description}</p>
                )}
              </div>
              
              <div className="space-y-6 text-sm mt-auto" style={{ color: "var(--text-secondary)" }}>
                <div className="space-y-2">
                  {getCurrentStage(project.milestones) && (
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Current Stage</span>
                      <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{getCurrentStage(project.milestones)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Health</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 700, textTransform: "capitalize" }}>{project.health?.replace('_', ' ') || 'On Track'}</span>
                  </div>
                  {project.expectedDeliveryDate && (
                    <div className="flex justify-between">
                      <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Delivery</span>
                      <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{new Date(project.expectedDeliveryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Progress</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 overflow-hidden" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                    <div className="h-full transition-all duration-500" style={{ width: `${project.progress}%`, background: "var(--brand-red)" }} />
                  </div>
                </div>
                
                <Link href={`/developer/projects/${project.id}`}>
                  <Button variant="outline" className="w-full">Manage Project</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
