"use client";

import { Header } from "./Header";
import { ThemeProvider } from "@/providers/ThemeProvider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col bg-app-bg text-app-text">
        <Header />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
