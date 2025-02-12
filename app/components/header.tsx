"use client"

import Link from "next/link"
import { useTheme } from "./theme-provider"
import { LoginDialog } from "./auth/login-dialog"
import { useAuth } from "../contexts/auth-context"
import { Button } from "./ui/button"
import { Moon, Sun } from "lucide-react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          TempNote
        </Link>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {user ? <span className="text-sm text-muted-foreground">{user.email}</span> : <LoginDialog />}
        </div>
      </div>
    </header>
  )
}

