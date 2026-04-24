import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function TopBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems =
    user?.role === 'admin'
      ? [
        { label: 'Dashboard', path: '/admin/dashboard' },
        { label: 'Fields', path: '/admin/fields' },
        { label: 'Add Field', path: '/admin/fields/new' },
      ]
      : [{ label: 'Dashboard', path: '/agent/dashboard' },
      { label: 'My Fields', path: '/agent/fields' }
      ]

  const navigateAndClose = (path: string) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  const confirmAndLogout = () => {
    const shouldLogout = window.confirm('Are you sure you want to logout?')
    if (shouldLogout) {
      logout()
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="border-b border-black/10 bg-[#1e5317]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white">
          FarmSync
        </Link>

        <div className="hidden items-center gap-2 sm:gap-3 md:flex">
          {navItems.map((item) => (
            <Button
              key={item.label}
              type="button"
              variant="outline"
              className="bg-[#41b332] text-white hover:bg-[#389c2a]"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Button>
          ))}
          <Button
            type="button"
            className="bg-[#41b332] text-white hover:bg-[#389c2a]"
            onClick={confirmAndLogout}
          >
            Logout
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="border-white/40 bg-transparent text-white hover:bg-white/10 md:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/15 px-4 pb-4 pt-2 md:hidden sm:px-6">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Button
                key={item.label}
                type="button"
                variant="outline"
                className="w-full justify-start bg-[#41b332] text-white hover:bg-[#389c2a]"
                onClick={() => navigateAndClose(item.path)}
              >
                {item.label}
              </Button>
            ))}
            <Button
              type="button"
              className="w-full justify-start bg-[#41b332] text-white hover:bg-[#389c2a]"
              onClick={confirmAndLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
