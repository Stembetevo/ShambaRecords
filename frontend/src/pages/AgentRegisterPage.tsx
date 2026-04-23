import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { register } from '@/api/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function AgentRegisterPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard'} replace />
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setSubmitting(true)

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: 'agent',
      })

      await login(formData.username, formData.password)
      navigate('/agent/dashboard')
    } catch (err) {
      const error = err as any
      setError(error?.response?.data?.message || 'Failed to create account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[url('/garden.jpg')] bg-cover bg-center p-8 shadow-2xl lg:min-h-[calc(100vh-5rem)]">
          <div className="absolute inset-0 rounded-3xl bg-slate-950/65" />
          <div className="relative z-10">
            <Link to="/" className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
              FarmSync
            </Link>
            <h1 className="mt-6 max-w-md text-4xl font-semibold tracking-tight sm:text-5xl">
              Create your agent account and start working with farm records.
            </h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/75">
              Agents use FarmSync to record field activity, monitor progress, and keep day-to-day work organized.
            </p>
          </div>

          <div className="relative z-10 mt-8 grid gap-3 text-sm text-white/80 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              Track assigned fields
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              Log in anytime
            </div>
          </div>
        </div>

        <Card className="border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
          <CardHeader className="space-y-2 border-b border-white/10 pb-5 text-left">
            <CardTitle className="text-2xl text-white">Agent Registration</CardTitle>
            <CardDescription className="text-white/70">
              Fill in the details below to create your field user account.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-2 p-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label htmlFor="firstName" className="text-white/85">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                  />
                </div>

                <div className="space-y-2 text-left">
                  <Label htmlFor="lastName" className="text-white/85">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="username" className="text-white/85">Username *</Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="email" className="text-white/85">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="password" className="text-white/85">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div className="space-y-2 text-left">
                <Label htmlFor="confirmPassword" className="text-white/85">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-500 py-6 text-base font-semibold text-white hover:bg-emerald-600"
              >
                {submitting ? 'Creating account...' : 'Create Account'}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-slate-950 px-2 text-white/55">Already have an account?</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                onClick={() => navigate('/login')}
              >
                Sign in here
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
