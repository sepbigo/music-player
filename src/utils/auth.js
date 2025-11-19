import { api } from './api.js'

export async function login(username, password) {
  try {
    return await api.login(username, password)
  } catch (error) {
    console.error('Login failed:', error)
    return false
  }
}

export function logout() {
  localStorage.removeItem('authToken')
}

export async function checkAuth() {
  return await api.checkAuth()
}

export function getAuthToken() {
  return localStorage.getItem('authToken')
}
