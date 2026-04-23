import { useAuth } from '@/hooks/useAuth'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function TopBar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  return (
    <header className="border-b border-black/10 bg-[#1e5317]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-white">
          FarmSync
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            className="bg-[#41b332] text-white hover:bg-[#389c2a]"
            onClick={() => navigate('/agent/dashboard')}
          >
            Dashboard
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="bg-[#41b332] text-white hover:bg-[#389c2a]"
            onClick={() => navigate('/agent/fields/new')}
          >
            Add Field
          </Button>
          <Button
            type="button"
            variant="outline"
            className="bg-[#41b332] text-white hover:bg-[#389c2a]"
            onClick={() => navigate('/agent/fields')}
          >
            My Fields
          </Button>
          <Button
            type="button"
            className="bg-[#41b332] text-white hover:bg-[#389c2a]"
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
