import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // If user is already logged in, redirect to their dashboard
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard'} replace />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Garden Image */}
      <div
        className="flex-1 bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
        style={{
          backgroundImage: 'url(/garden.jpg)',
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
            Shamba Records
          </h1>
          <p className="text-lg md:text-xl mb-8 text-balance">
            Manage your agricultural fields with ease. Track crops, monitor performance, and grow your farming business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-6"
            >
              Register as Agent
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="bg-white hover:bg-gray-100 text-gray-900 text-lg px-8 py-6 border-2 border-white"
            >
              Admin Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
