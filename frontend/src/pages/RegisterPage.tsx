import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const agentFeatures = [
  'Register a new agent account',
  'Log in to continue field work',
  'Access your assigned farm records',
]

const adminFeatures = [
  'Secure login for administrators',
  'Access the admin dashboard only',
  'Monitor users, fields, and records',
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard'} replace />
  }

  return (
    <section className="min-h-screen bg-white px-4 py-10  sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-2xl text-center ">
          
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl text-black">
            Choose how you want to access FarmSync
          </h1>
          <p className="mt-4 text-base leading-7 text-black">
            Agents can either create an account or log in. Developers and administrators only use the admin login.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="border-black bg-white/5 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-2 border-b border-black pb-5 text-left">
              <CardTitle className="text-2xl text-black">Agent</CardTitle>
              <CardDescription className="text-black">
                Best for field staff who need to register or sign in to manage their work.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-6 text-left">
              <ul className="space-y-2 text-sm leading-6 text-black">
                {agentFeatures.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  size="lg"
                  onClick={() => navigate('/register/agent')}
                  className="bg-[#389c2a] px-5 text-white "
                >
                  Register
                </Button>
                <Button
                  size="lg"
                  
                  onClick={() => navigate('/login')}
                  className="bg-[#389c2a] px-5 text-white "
                >
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-2 border-b border-black pb-5 text-left">
              <CardTitle className="text-2xl text-black">Developer / Admin</CardTitle>
              <CardDescription className="text-black">
                For platform administrators who only need access to the admin dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-6 text-left">
              <ul className="space-y-2 text-sm leading-6 text-black">
                {adminFeatures.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="w-full bg-[#389c2a] px-5 text-white "
              >
                Admin Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
