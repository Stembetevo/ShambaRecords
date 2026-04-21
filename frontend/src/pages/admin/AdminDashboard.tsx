import { useEffect, useMemo, useState } from 'react'
import { getDashboard } from '@/api/dashboard'
import { getFields } from '@/api/fields'
import type { DashboardStats, FieldUpdate } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ActivityItem = FieldUpdate & {
  fieldName: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      setError('')
      try {
        const [dashboard, fields] = await Promise.all([getDashboard(), getFields()])
        setStats(dashboard)

        const updates = fields
          .flatMap((field) =>
            field.updates.map((update) => ({
              ...update,
              fieldName: field.name,
            })),
          )
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
        setRecentActivity(updates)
      } catch {
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const stageEntries = useMemo(() => {
    if (!stats) return []
    return [
      { label: 'Planted', value: stats.by_stage.planted },
      { label: 'Growing', value: stats.by_stage.growing },
      { label: 'Ready', value: stats.by_stage.ready },
      { label: 'Harvested', value: stats.by_stage.harvested },
    ]
  }, [stats])

  if (loading) {
    return <section className="p-2">Loading dashboard...</section>
  }

  if (error || !stats) {
    return <section className="p-2 text-red-600">{error || 'Unable to load dashboard.'}</section>
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Fields</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.total}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>At Risk</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-amber-600">{stats.by_status.at_risk}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Completed</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-slate-700">{stats.by_status.completed}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stage Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stageEntries.map((entry) => (
            <div key={entry.label} className="rounded-lg border p-3 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{entry.label}</p>
              <p className="mt-1 text-2xl font-semibold">{entry.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No updates yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentActivity.map((item) => (
                <li key={item.id} className="rounded-lg border p-3">
                  <p className="font-medium">{item.fieldName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.previous_stage} to {item.new_stage} by {item.agent_name || 'Unknown'}
                  </p>
                  {item.note && <p className="mt-1 text-sm">{item.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
