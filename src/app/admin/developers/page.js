"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase/client";
import { Card, CardContent } from "@/components/ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { CredentialsModal } from "@/components/ui/CredentialsModal";
import { toast } from "sonner";

export default function AdminDevelopersPage() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invite Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);

  async function fetchDevelopers() {
    setLoading(true);
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", "developer")
      );
      const snapshot = await getDocs(q);
      const developersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort in JS to avoid needing a composite index
      developersData.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
      setDevelopers(developersData);
    } catch (error) {
      console.error("Error fetching developers:", error);
      toast.error("Failed to fetch developers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsInviting(true);
    
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await fetch("/api/developers/invite", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: inviteName, email: inviteEmail }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to invite developer.");
      }
      
      toast.success(data.message || "Developer created successfully!");
      setIsModalOpen(false);
      setCreatedCredentials({ email: inviteEmail, tempPassword: data.tempPassword });
      setInviteName("");
      setInviteEmail("");

      // Use the record the API already returned instead of re-querying Firestore.
      setDevelopers(prev => [{ id: data.id, ...data.developer }, ...prev]);
    } catch (error) {
      console.error("Invite error:", error);
      toast.error(error.message);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="page-container relative">
      <div className="page-header">
        <div>
          <h1 className="page-title">Developers</h1>
          <p className="page-subtitle">Manage your development team members.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add Developer</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Assigned Projects</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">Loading developers...</TableCell>
                </TableRow>
              ) : developers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">No developers found.</TableCell>
                </TableRow>
              ) : (
                developers.map((dev) => (
                  <TableRow key={dev.id}>
                    <TableCell className="font-medium">{dev.name}</TableCell>
                    <TableCell>{dev.email}</TableCell>
                    <TableCell style={{ color: "var(--text-muted)" }}>--</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => toast.info("Developer management coming soon")}>Manage</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }}>
          <div className="card-elevated w-full max-w-md relative max-h-[90vh] overflow-y-auto" style={{ padding: 24 }}>
            <h2 className="page-title mb-4" style={{ fontSize: 18 }}>Add Developer</h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^A-Za-z\s]/g, '');
                    if (e.target.value !== val) e.target.value = val;
                    setInviteName(val);
                  }}
                  className="w-full h-10 border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-colors rounded-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-10 border border-border bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground transition-colors rounded-none"
                  placeholder="name@example.com"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isInviting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isInviting}>
                  {isInviting ? "Creating..." : "Create Developer"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {createdCredentials && (
        <CredentialsModal
          email={createdCredentials.email}
          tempPassword={createdCredentials.tempPassword}
          onClose={() => setCreatedCredentials(null)}
        />
      )}
    </div>
  );
}
