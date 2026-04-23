import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createField } from '@/api/fields'
import type { FieldStage } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STAGES: FieldStage[] = ['planted', 'growing', 'ready', 'harvested']

export default function AgentCreateFieldPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [cropType, setCropType] = useState('')
  const [plantingDate, setPlantingDate] = useState('')
  const [stage, setStage] = useState<FieldStage>('planted')

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await createField({
        name,
        crop_type: cropType,
        planting_date: plantingDate,
        stage,
      })
      navigate('/agent/fields')
    } catch {
      setError('Unable to create field from this account. Please contact an administrator if you need this access.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-2xl text-black">
      <Card className="border-black/15 bg-white shadow-sm">
        <CardHeader className="border-b border-black/10">
          <CardTitle className="text-2xl">Add Field</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-name" className="text-black">Field Name</Label>
              <Input id="field-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crop-type" className="text-black">Crop Type</Label>
              <Input id="crop-type" value={cropType} onChange={(e) => setCropType(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planting-date" className="text-black">Planting Date</Label>
              <Input
                id="planting-date"
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage-select" className="text-black">Stage</Label>
              <Select value={stage} onValueChange={(value) => setStage(value as FieldStage)}>
                <SelectTrigger id="stage-select" className="w-full border-black/20">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</p>}

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#41b332] text-white hover:bg-[#389c2a]"
              >
                {submitting ? 'Saving...' : 'Save Field'}
              </Button>
              <Button type="button" variant="outline" className="border-black text-black" onClick={() => navigate('/agent/fields')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
