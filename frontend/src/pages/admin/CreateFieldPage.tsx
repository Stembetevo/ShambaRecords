import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createField } from '@/api/fields'
import { getAgents } from '@/api/auth'
import type { FieldStage, User } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STAGES: FieldStage[] = ['planted', 'growing', 'ready', 'harvested']

export default function CreateFieldPage() {
  const navigate = useNavigate()
  const [agents, setAgents] = useState<User[]>([])
  const [loadingAgents, setLoadingAgents] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [cropType, setCropType] = useState('')
  const [plantingDate, setPlantingDate] = useState('')
  const [stage, setStage] = useState<FieldStage>('planted')
  const [assignedAgent, setAssignedAgent] = useState<string>('unassigned')

  useEffect(() => {
    async function loadAgents() {
      setLoadingAgents(true)
      try {
        const data = await getAgents()
        setAgents(data)
      } catch {
        setError('Failed to load agents.')
      } finally {
        setLoadingAgents(false)
      }
    }

    loadAgents()
  }, [])

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
        assigned_agent: assignedAgent === 'unassigned' ? null : Number(assignedAgent),
      })
      navigate('/admin/fields')
    } catch {
      setError('Failed to create field.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Field</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="field-name">Field name</Label>
              <Input id="field-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="crop-type">Crop type</Label>
              <Input id="crop-type" value={cropType} onChange={(e) => setCropType(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="planting-date">Planting date</Label>
              <Input
                id="planting-date"
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage-select">Stage</Label>
              <Select value={stage} onValueChange={(value) => setStage(value as FieldStage)}>
                <SelectTrigger id="stage-select" className="w-full">
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

            <div className="space-y-2">
              <Label htmlFor="assigned-agent-select">Assigned agent</Label>
              <Select value={assignedAgent} onValueChange={setAssignedAgent}>
                <SelectTrigger id="assigned-agent-select" className="w-full" disabled={loadingAgents}>
                  <SelectValue placeholder={loadingAgents ? 'Loading agents...' : 'Select agent'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={String(agent.id)}>
                      {(agent.first_name || agent.last_name)
                        ? `${agent.first_name} ${agent.last_name}`.trim()
                        : agent.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Field'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
