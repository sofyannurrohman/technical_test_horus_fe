import api from './api'
import { type User } from '../model/user'

const resource = '/users'


export const getAllUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>(resource)
  return response.data
}

export const createUser = async (user: User): Promise<User> => {
  const response = await api.post<User>(resource, user)
  return response.data
}

export const getUserByID = async (id: string): Promise<User> => {
  const response = await api.get<User>(`${resource}/${id}`)
  return response.data
}

export const updateUser = async (id: string, user: any): Promise<User> => {
  const response = await api.put<any>(`${resource}/${id}`, user)
  return response.data
}

export const removeUser = async (id: string): Promise<any> => {
  const response = await api.delete(`${resource}/${id}`)
  return response
}

export const logoutUser = async (context) => {
  localStorage.clear()
  if (context?.$router) {
    context.$router.push({ name: 'sigin' }) // Adjust the name to match your router setup
  } else {
    console.error('Router is not available')
    window.location.href = '/auth/signin'
}
}
