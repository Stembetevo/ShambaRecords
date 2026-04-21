import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'
import './index.css'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import LoginPage from '@/pages/LoginPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import FieldsPage from '@/pages/admin/FieldsPage'
import CreateFieldPage from '@/pages/admin/CreateFieldPage'
import AgentDashboard from '@/pages/agent/AgentDashboard'
import MyFieldsPage from '@/pages/agent/MyFieldsPage'
import FieldDetailPage from '@/pages/agent/FieldDetailPage'

type Role = 'admin' | 'agent'

function RoleRedirect() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard'} replace />
}

function ProtectedRoute({ role }: { role: Role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/agent/dashboard'} replace />
  }

  return <Outlet />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RoleRedirect />} />

          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/fields" element={<FieldsPage />} />
              <Route path="/admin/fields/new" element={<CreateFieldPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="agent" />}>
            <Route element={<AppLayout />}>
              <Route path="/agent/dashboard" element={<AgentDashboard />} />
              <Route path="/agent/fields" element={<MyFieldsPage />} />
              <Route path="/agent/fields/:id" element={<FieldDetailPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
