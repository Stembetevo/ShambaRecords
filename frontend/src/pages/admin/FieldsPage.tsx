import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFields } from '@/api/fields'
import type { Field, FieldStatus } from '@/types'
import { Button } from '@/components/ui/button'
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

export default function FieldsPage() {
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
        setError('Failed to load fields.')
      } finally {
        setLoading(false)
      }
    }

    loadFields()
  }, [])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-black font-semibold">Fields</h1>
      </div>

      {loading && <p>Loading fields...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          {fields.length === 0 ? (
            <p className="text-sm text-slate-600">No fields found.</p>
          ) : (
            <>
              <div className="space-y-3 md:hidden">
                {fields.map((field) => (
                  <Card key={field.id} className="border-black/10 bg-white">
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold text-black">{field.name}</p>
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
                      <Button asChild size="sm" variant="outline" className="border-black text-black">
                        <Link to={`/admin/fields/${field.id}`}>View</Link>
                      </Button>
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
                        <TableCell>{field.name}</TableCell>
                        <TableCell>{field.crop_type}</TableCell>
                        <TableCell className="capitalize">{field.stage}</TableCell>
                        <TableCell>
                          <Badge className={statusClassName(field.status)}>{field.status}</Badge>
                        </TableCell>
                        <TableCell>{field.assigned_agent_name || 'Unassigned'}</TableCell>
                        <TableCell>{field.planting_date}</TableCell>
                        <TableCell>
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/admin/fields/${field.id}`}>View</Link>
                          </Button>
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
