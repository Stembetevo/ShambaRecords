import api from './axios'
import type { Field, FieldUpdate } from '@/types'

type CreateFieldData = {
  name: string
  crop_type: string
  planting_date: string
  stage?: 'planted' | 'growing' | 'ready' | 'harvested'
  assigned_agent?: number | null
}

type AddFieldUpdateData = {
  new_stage: 'planted' | 'growing' | 'ready' | 'harvested'
  note?: string
}

export async function getFields(): Promise<Field[]> {
  const response = await api.get<Field[]>('/fields/')
  return response.data
}

export async function getField(fieldId: number): Promise<Field> {
  const response = await api.get<Field>(`/fields/${fieldId}/`)
  return response.data
}

export async function createField(data: CreateFieldData): Promise<Field> {
  const response = await api.post<Field>('/fields/', data)
  return response.data
}

export async function addFieldUpdate(fieldId: number, data: AddFieldUpdateData): Promise<FieldUpdate> {
  const response = await api.post<FieldUpdate>(`/fields/${fieldId}/updates/`, data)
  return response.data
}
