"use client";

import { useState } from "react";
import { Button } from "./Button";
import { toast } from "sonner";

export function CredentialsModal({ email, tempPassword, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      toast.success("Password copied");
    } catch {
      toast.error("Couldn't copy - select and copy manually");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }}>
      <div className="card-elevated w-full max-w-md space-y-5" style={{ padding: 24 }}>
        <h2 className="page-title" style={{ fontSize: 20 }}>Account Created</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Share these credentials with the account owner directly (chat, phone, in person). This password is shown only once and cannot be retrieved later - use &quot;Forgot password&quot; on the login page if it&apos;s lost.
        </p>
        <div className="flex flex-col gap-5 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="w-full flex h-10 items-center rounded-none border border-input bg-background px-3 text-sm text-foreground/90">{email}</div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Temporary Password</label>
            <div className="flex gap-2">
              <div className="flex-1 flex h-10 items-center rounded-none border border-input bg-background px-3 text-sm font-bold text-foreground/90">{tempPassword}</div>
              <Button type="button" variant="outline" className="h-10 px-4" onClick={handleCopy}>{copied ? "Copied" : "Copy"}</Button>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6 pt-2 border-t border-border">
          <Button type="button" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}
