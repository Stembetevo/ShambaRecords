import { useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { getField, addFieldUpdate } from '@/api/fields'
import type { Field, FieldStage, FieldStatus } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STAGE_ORDER: FieldStage[] = ['planted', 'growing', 'ready', 'harvested']

function statusClassName(status: FieldStatus): string {
  if (status === 'active') return 'bg-green-100 text-green-800'
  if (status === 'at_risk') return 'bg-amber-100 text-amber-800'
  return 'bg-slate-200 text-slate-700'
}

export default function FieldDetailPage() {
  const { id } = useParams()
  const [field, setField] = useState<Field | null>(null)
  const [note, setNote] = useState('')
  const [newStage, setNewStage] = useState<FieldStage>('planted')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadField() {
      setLoading(true)
      setError('')

      const numericId = Number(id)
      if (!id || Number.isNaN(numericId) || !Number.isFinite(numericId)) {
        setError('Invalid field id.')
        setLoading(false)
        return
      }

      try {
        const data = await getField(numericId)
        setField(data)
        setNewStage(data.stage)
      } catch {
        setError('Failed to load field details.')
      } finally {
        setLoading(false)
      }
    }

    loadField()
  }, [id])

  const allowedStages = useMemo(() => {
    if (!field) return STAGE_ORDER
    const currentIndex = STAGE_ORDER.indexOf(field.stage)
    return STAGE_ORDER.slice(Math.max(currentIndex, 0))
  }, [field])

  const submitUpdate = async () => {
    if (!field) return
    setSubmitting(true)
    setError('')
    try {
      await addFieldUpdate(field.id, { new_stage: newStage, note })
      const refreshed = await getField(field.id)
      setField(refreshed)
      setNote('')
      setNewStage(refreshed.stage)
    } catch {
      setError('Failed to submit update.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <section>Loading field details...</section>
  }

  if (!field) {
    return <section className="text-red-600">{error || 'Field not found.'}</section>
  }

  const updates = field.updates ?? []

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{field.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><span className="font-medium">Crop type:</span> {field.crop_type}</p>
          <p><span className="font-medium">Planting date:</span> {field.planting_date}</p>
          <p><span className="font-medium">Current stage:</span> <span className="capitalize">{field.stage}</span></p>
          <div>
            <Badge className={statusClassName(field.status)}>{field.status}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Field</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>New stage</Label>
            <Select value={newStage} onValueChange={(value) => setNewStage(value as FieldStage)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {allowedStages.map((stage) => (
                  <SelectItem key={stage} value={stage}>
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-note">Note</Label>
            <textarea
              id="update-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full rounded-lg border border-input px-3 py-2 text-sm"
              rows={4}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="button" onClick={submitUpdate} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Update'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update History</CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No updates yet.</p>
          ) : (
            <ul className="space-y-3">
              {updates.map((update) => (
                <li key={update.id} className="rounded-lg border p-3">
                  <p className="text-sm text-muted-foreground">{new Date(update.created_at).toLocaleString()}</p>
                  <p className="font-medium capitalize">{update.previous_stage}{' -> '}{update.new_stage}</p>
                  {update.note && <p className="mt-1 text-sm">{update.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
