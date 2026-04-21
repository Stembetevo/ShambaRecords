import { Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function Sidebar() {
  const { user } = useAuth()

  return (
    <aside className="w-64 border-r p-4">
      <h2 className="mb-4 text-lg font-semibold">Shamba Records</h2>
      <nav className="flex flex-col gap-2">
        {user?.role === 'admin' && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/fields">Fields</Link>
            <Link to="/admin/fields/new">Create Field</Link>
          </>
        )}

        {user?.role === 'agent' && (
          <>
            <Link to="/agent/dashboard">Dashboard</Link>
            <Link to="/agent/fields">My Fields</Link>
          </>
        )}
      </nav>
    </aside>
  )
}
