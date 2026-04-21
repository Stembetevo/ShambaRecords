export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: 'admin' | 'agent'
}

export type FieldStage = 'planted' | 'growing' | 'ready' | 'harvested'
export type FieldStatus = 'active' | 'at_risk' | 'completed'

export interface FieldUpdate {
  id: number
  previous_stage: FieldStage
  new_stage: FieldStage
  note: string
  agent_name: string
  created_at: string
}

export interface Field {
  id: number
  name: string
  crop_type: string
  planting_date: string
  stage: FieldStage
  status: FieldStatus
  assigned_agent: number | null
  assigned_agent_name: string
  updates: FieldUpdate[]
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total: number
  by_status: {
    active: number
    at_risk: number
    completed: number
  }
  by_stage: {
    planted: number
    growing: number
    ready: number
    harvested: number
  }
}
