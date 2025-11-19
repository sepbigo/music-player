import { api } from './api.js'

export async function login(username, password) {
  try {
    const result = await api.login(username, password)
    if (result.token) {
      localStorage.setItem('authToken', result.token)
      return true
    }
    return false
  } catch (error) {
    console.error('Login failed:', error)
    return false
  }
}

export function logout() {
  localStorage.removeItem('authToken')
}

export async function checkAuth() {
  try {
    const result = await api.checkAuth()
    return result.authenticated
  } catch (error) {
    console.error('Auth check failed:', error)
    return false
  }
}

export function getAuthToken() {
  return localStorage.getItem('authToken')
}
