import api from './axios'
import type { User } from '@/types'

type LoginResponse = {
  access: string
  refresh: string
}

type RegisterData = {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
  role?: 'admin' | 'agent'
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login/', { username, password })
  localStorage.setItem('access_token', response.data.access)
  localStorage.setItem('refresh_token', response.data.refresh)
  return response.data
}

export async function register(data: RegisterData): Promise<User> {
  const response = await api.post<User>('/register/', data)
  return response.data
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>('/me/')
  return response.data
}

export async function getAgents(): Promise<User[]> {
  const response = await api.get<User[]>('/agents/')
  return response.data
}
