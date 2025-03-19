"use client"

import type * as React from "react"
import { ThemeProvider } from "./theme-provider"
import { Header } from "./header"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </ThemeProvider>
  )
}
