import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFields } from '@/api/fields'
import type { Field, FieldStatus } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function statusClassName(status: FieldStatus): string {
  if (status === 'active') return 'bg-green-100 text-green-800'
  if (status === 'at_risk') return 'bg-amber-100 text-amber-800'
  return 'bg-slate-200 text-slate-700'
}

export default function MyFieldsPage() {
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

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-black">My Fields</h1>

      {loading && <p>Loading fields...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {fields.length === 0 ? (
            <p className="text-sm text-slate-600">No fields assigned yet.</p>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {fields.map((field) => (
                  <Card key={field.id} className="border-black/10 bg-white">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <Link to={`/agent/fields/${field.id}`} className="font-semibold text-black hover:underline">
                          {field.name}
                        </Link>
                        <Badge className={statusClassName(field.status)}>{field.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-slate-500">Crop</p>
                          <p className="text-black">{field.crop_type}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Stage</p>
                          <p className="capitalize text-black">{field.stage}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Assigned</p>
                          <p className="text-black">{field.assigned_agent_name || 'Unassigned'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Planting Date</p>
                          <p className="text-black">{field.planting_date}</p>
                        </div>
                      </div>
                      <Link to={`/agent/fields/${field.id}`} className="inline-block text-sm font-medium text-black underline-offset-2 hover:underline">
                        View details
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-lg border border-black/10 md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Crop Type</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned Agent</TableHead>
                      <TableHead>Planting Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <Link to={`/agent/fields/${field.id}`} className="font-medium hover:underline">
                            {field.name}
                          </Link>
                        </TableCell>
                        <TableCell>{field.crop_type}</TableCell>
                        <TableCell className="capitalize">{field.stage}</TableCell>
                        <TableCell>
                          <Badge className={statusClassName(field.status)}>{field.status}</Badge>
                        </TableCell>
                        <TableCell>{field.assigned_agent_name || 'Unassigned'}</TableCell>
                        <TableCell>{field.planting_date}</TableCell>
                        <TableCell>
                          <Link to={`/agent/fields/${field.id}`} className="text-sm underline-offset-2 hover:underline">
                            View
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}
