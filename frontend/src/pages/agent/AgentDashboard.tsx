import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFields } from '@/api/fields'
import type { Field } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

function stageBadgeClass(stage: Field['stage']) {
  if (stage === 'ready') return 'bg-emerald-100 text-emerald-800'
  if (stage === 'growing') return 'bg-blue-100 text-blue-800'
  if (stage === 'harvested') return 'bg-slate-200 text-slate-700'
  return 'bg-amber-100 text-amber-800'
}

export default function AgentDashboard() {
  const [fields, setFields] = useState<Field[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadFields() {
      setLoading(true)
      setError('')
      try {
        const data = await getFields()
        setFields(data)
      } catch {
        setError('Failed to load your fields.')
      } finally {
        setLoading(false)
      }
    }

    loadFields()
  }, [])

  const stats = useMemo(
    () => ({
      total: fields.length,
      atRisk: fields.filter((field) => field.status === 'at_risk').length,
      ready: fields.filter((field) => field.stage === 'ready').length,
    }),
    [fields],
  )

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Agent Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Fields</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{stats.total}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>At Risk</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-amber-600">{stats.atRisk}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ready to Harvest</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold text-emerald-700">{stats.ready}</CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Assigned Fields</h2>
        {loading && <p>Loading fields...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && (
          fields.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No fields assigned</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                You do not have assigned fields yet. Check back later.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <Card key={field.id}>
                  <CardHeader>
                    <CardTitle>{field.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{field.crop_type}</p>
                    <Badge className={stageBadgeClass(field.stage)}>{field.stage}</Badge>
                    <div>
                      <Button asChild size="sm" variant="outline">
                        <Link to={`/agent/fields/${field.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
    </section>
  )
}
