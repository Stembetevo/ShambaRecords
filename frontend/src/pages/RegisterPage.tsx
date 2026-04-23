import { Link, Navigate, useNavigate } from 'react-router-dom'
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
    <section className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            FarmSync
          </Link>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Choose how you want to access FarmSync
          </h1>
          <p className="mt-4 text-base leading-7 text-white/75">
            Agents can either create an account or log in. Developers and administrators only use the admin login.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-2 border-b border-white/10 pb-5 text-left">
              <CardTitle className="text-2xl text-white">Agent</CardTitle>
              <CardDescription className="text-white/70">
                Best for field staff who need to register or sign in to manage their work.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-6 text-left">
              <ul className="space-y-2 text-sm leading-6 text-white/75">
                {agentFeatures.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  size="lg"
                  onClick={() => navigate('/register/agent')}
                  className="bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  Register
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-2 border-b border-white/10 pb-5 text-left">
              <CardTitle className="text-2xl text-white">Developer / Admin</CardTitle>
              <CardDescription className="text-white/70">
                For platform administrators who only need access to the admin dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 p-6 text-left">
              <ul className="space-y-2 text-sm leading-6 text-white/75">
                {adminFeatures.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="w-full bg-white text-slate-900 hover:bg-slate-100"
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
