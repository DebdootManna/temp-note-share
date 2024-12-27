'use client'

import Link from 'next/link'
import { useTheme } from './theme-provider'
import { LoginDialog } from './auth/login-dialog'
import { useAuth } from './context/auth-context'
import { Button } from '../components/ui/button'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()

  return (
    <header className="bg-gray-100 dark:bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          TempNote
        </Link>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </Button>
          {user ? (
            <span>{user.email}</span>
          ) : (
            <LoginDialog />
          )}
        </div>
      </div>
    </header>
  )
}

