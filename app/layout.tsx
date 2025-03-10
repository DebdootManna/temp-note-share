import { AuthProvider } from "./contexts/auth-context"
import { Layout } from "./components/layout"
import { Toaster } from "./components/ui/toaster"
import "./globals.css"
import type React from "react" // Added import for React

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

