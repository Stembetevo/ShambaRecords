import api from './axios'
import type { DashboardStats } from '@/types'

export async function getDashboard(): Promise<DashboardStats> {
  const response = await api.get<DashboardStats>('/dashboard/')
  return response.data
}
