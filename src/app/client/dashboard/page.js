"use client";

import { useEffect, useState } from "react";
import { getProjectsByClient } from "@/lib/services/projects";
import { useAuth } from "@/lib/auth/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function ClientDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      if (user?.clientId) {
        try {
          const data = await getProjectsByClient(user.clientId);
          setProjects(data);
        } catch (error) {
          console.error("Error loading client projects:", error);
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
          <h1 className="page-title">My Projects</h1>
          <p className="page-subtitle">Track your active MakeWithUs project work</p>
        </div>
        <span className="badge badge-red">CLIENT</span>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1].map(i => (
            <div key={i} className="card animate-pulse" style={{ height: 128 }} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>You have no active projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map(project => (
            <div key={project.id} className="card" style={{ padding: 24 }}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{project.description || "No description provided."}</p>
                </div>
                <span className="badge badge-red">{project.status}</span>
              </div>
              <div className="space-y-4 text-sm max-w-xl" style={{ color: "var(--text-secondary)" }}>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Overall Progress</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{project.progress}% COMPLETE</span>
                  </div>
                  <div className="w-full h-3 overflow-hidden" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                    <div className="h-full transition-all duration-500" style={{ width: `${project.progress}%`, background: "var(--brand-red)" }} />
                  </div>
                </div>
                
                <Link href={`/client/projects/${project.id}`}>
                  <Button variant="outline" className="w-full sm:w-auto">View Details</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
