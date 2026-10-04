import { AuthProvider } from "@/lib/auth/AuthContext";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata = {
  title: "MakeWithUs | Client Portal",
  description: "MakeWithUs Client Project Tracking Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster 
              position="top-right" 
              expand={true} 
              theme="system" 
              toastOptions={{
                classNames: {
                  toast: "bg-background border border-border text-foreground font-sans shadow-sm rounded-none",
                  title: "text-foreground font-bold",
                  description: "text-muted-foreground",
                  error: "border-destructive text-destructive bg-background",
                  success: "border-foreground text-foreground bg-background",
                  warning: "border-muted-foreground text-muted-foreground bg-background",
                  info: "border-foreground text-foreground bg-background",
                }
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
