import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFields } from '@/api/fields'
import type { Field, FieldStatus } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
        <h1 className="text-2xl font-semibold">Fields</h1>
        <Button asChild>
          <Link to="/admin/fields/new">New Field</Link>
        </Button>
      </div>

      {loading && <p>Loading fields...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
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
            {fields.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                  No fields found.
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field) => (
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
              ))
            )}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
