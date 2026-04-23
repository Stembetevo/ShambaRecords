import { Navigate, Outlet } from 'react-router-dom'
import { TopBar } from '@/components/layout/TopBar'
import { useAuth } from '@/hooks/useAuth'

export function AppLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <main>
        <TopBar />
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
