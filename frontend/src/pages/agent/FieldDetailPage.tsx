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

      if (!id) {
        setError('Invalid field id.')
        setLoading(false)
        return
      }

      try {
        const data = await getField(id)
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
    <section className="space-y-8 text-black">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-5">
          <h1 className="text-3xl text-black font-semibold tracking-tight sm:text-4xl">{field.name}</h1>
          <div className="space-y-4 text-base sm:text-lg">
            <p>
              <span className="font-semibold">Crop type:</span> {field.crop_type}
            </p>
            <p>
              <span className="font-semibold">Planting date:</span> {field.planting_date}
            </p>
            <p>
              <span className="font-semibold">Current stage:</span>{' '}
              <span className="capitalize">{field.stage}</span>
            </p>
            <div className="pt-1">
              <Badge className={`${statusClassName(field.status)} text-base`}>{field.status}</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-5 rounded-xl border border-black/10 bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-2xl text-black font-semibold sm:text-3xl">Update Field</h2>

          <div className="space-y-2">
            <Label className="text-base font-medium text-black sm:text-lg">New stage</Label>
            <Select value={newStage} onValueChange={(value) => setNewStage(value as FieldStage)}>
              <SelectTrigger className="w-full border-black/20 bg-white text-black text-base">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black  border-black">
                {allowedStages.map((stage) => (
                  <SelectItem
                    key={stage}
                    value={stage}
                    className="capitalize text-black data-[highlighted]:bg-white/20 data-[highlighted]:text-black cursor-pointer"
                  >
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-note" className="text-base font-medium text-black sm:text-lg">Note</Label>
            <textarea
              id="update-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full rounded-lg border border-black/20 bg-white px-4 py-3 text-base text-black"
              rows={5}
            />
          </div>

          {error && <p className="text-sm text-red-600 sm:text-base">{error}</p>}

          <Button type="button" onClick={submitUpdate} disabled={submitting} className="text-base">
            {submitting ? 'Submitting...' : 'Submit Update'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Update History</CardTitle>
        </CardHeader>
        <CardContent>
          {updates.length === 0 ? (
            <p className="text-base text-muted-foreground">No updates yet.</p>
          ) : (
            <ul className="space-y-3">
              {updates.map((update) => (
                <li key={update.id} className="rounded-lg border p-3">
                  <p className="text-base text-muted-foreground">{new Date(update.created_at).toLocaleString()}</p>
                  <p className="text-lg font-medium capitalize">{update.previous_stage}{' -> '}{update.new_stage}</p>
                  {update.note && <p className="mt-1 text-base">{update.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
