import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard'} replace />
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const me = await login(username, password)
      navigate(me.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard')
    } catch {
      setError('Invalid username or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen bg-white px-4 py-10 text-black sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[url('/1garden.jpg')] bg-cover bg-center p-8 shadow-2xl lg:min-h-[calc(100vh-5rem)]">
          <div className="absolute inset-0 rounded-3xl bg-slate-950/65" />
          <div className="relative z-10">
            <h1 className="mt-6 max-w-md text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Welcome back to FarmSync
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/80">
              Sign in once and continue your workflow, whether you are an agent updating field activity or an admin managing operations.
            </p>
          </div>

          <div className="relative z-10 mt-8 grid gap-3 text-sm text-white/85 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              Agent access
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              Admin access
            </div>
          </div>
        </div>

        <Card className="border-black bg-white shadow-xl">
          <CardHeader className="space-y-2 border-b border-black/15 pb-5 text-left">
            <CardTitle className="text-2xl text-black">Login</CardTitle>
            <CardDescription className="text-black/75">
              This login is for both agents and admins. You will be redirected to the correct dashboard automatically.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-2 p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="username" className="text-black">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="password" className="text-black">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</p>}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#41b332] py-6 text-base font-semibold text-white hover:bg-[#389c2a]"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black/15" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-black/65">Need an agent account?</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-black text-black"
                onClick={() => navigate('/register')}
              >
                Go to Register
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
