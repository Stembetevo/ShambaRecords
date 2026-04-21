import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function TopBar() {
  const { user, logout } = useAuth()
  const displayName = user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'Guest'

  return (
    <header className="flex items-center justify-between border-b p-4">
      <p className="text-sm text-muted-foreground">Logged in as {displayName}</p>
      <Button type="button" variant="outline" onClick={logout}>
        Logout
      </Button>
    </header>
  )
}
