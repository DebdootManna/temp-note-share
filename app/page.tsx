import { ThemeProvider } from './components/theme-provider'
import { Header } from './components/header'
import { ToastViewport } from './components/ui/toast'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" storageKey="temp-note-share-theme">
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <ToastViewport />
      </div>
    </ThemeProvider>
  )
}

