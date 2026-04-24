import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'


const highlights = [
  'Track field activities from planting to harvest',
  'Organize crops, reports, and performance in one place',
  'Support both field agents and farm administrators',
]

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard'} replace />
  }

  return (
    <div className="min-h-screen  text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1e5317] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-2xl font-bold tracking-tight ">
            FarmSync
          </Link>
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            className="bg-white px-5 text-black hover:bg-[#41b332] hover:text-white"
          >
            Register
          </Button>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="relative isolate flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: 'url(/garden.jpg)' }}
        >
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950" />

          <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-left">
              
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-6xl">
                FarmSync keeps agricultural work organized from the field to the dashboard.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
                Manage farm records, monitor field activity, and coordinate teams with a clear workflow built for both agents and administrators.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="px-7 py-6 text-base font-semibold  bg-white text-black hover:bg-[#41b332] hover:text-white"
                >
                  Get Started
                </Button>
                
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-white px-4 py-20 text-slate-900 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="text-left">
              
              <h2 className="mt-3 text-[#41b332] text-3xl font-semibold tracking-tight sm:text-4xl">
                It is a smart system for field records, role-based access, and daily farm operations.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                FarmSync helps farms capture what is happening in the field, keep work visible to the right people, and reduce the friction of manual record keeping. The platform is designed for practical use in small and growing agricultural teams.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {highlights.map((item) => (
                  <Card key={item} className="border-slate-200 shadow-sm">
                    <CardContent className="p-5 text-left text-sm leading-6 text-slate-600">
                      {item}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="self-start border-black bg-slate-50 shadow-lg">
              <CardHeader className="space-y-2  pb-5 text-left">
                <CardTitle className="text-2xl text-slate-900">What it includes</CardTitle>
                <CardDescription className="text-slate-600">
                  A simple workflow that stays useful whether you are in the field or managing the system.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-6 text-left text-sm leading-6 text-slate-700">
                <p>• Field activity recording for agents</p>
                <p>• Admin oversight for records and users</p>
                <p>• Structured dashboards for quick decisions</p>
                <p>• A mobile-friendly interface for daily use</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#1e5317] px-4 py-8 text-white/60 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 text-sm sm:flex-row">
          <p>© {new Date().getFullYear()} FarmSync. Built for practical farm operations.</p>
          <p>Track. Coordinate. Grow.</p>
        </div>
      </footer>
    </div>
  )
}
