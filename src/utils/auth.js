// 简单的认证工具
// 在实际应用中，您应该使用更安全的认证方式

const ADMIN_USERNAME = 'sep'
const ADMIN_PASSWORD = 'Dfr520821@' // 在实际应用中请使用强密码

export function login(username, password) {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem('isAdmin', 'true')
    return true
  }
  return false
}

export function logout() {
  localStorage.removeItem('isAdmin')
}

export function checkAuth() {
  return localStorage.getItem('isAdmin') === 'true'
}
