// 替换为你的 Worker URL
const API_BASE_URL = 'https://music-player-api.sep-613.workers.dev'

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    }

    // 添加认证token
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        // 如果是认证错误，清除本地 token
        if (response.status === 401) {
          localStorage.removeItem('authToken')
        }
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  },

  // 认证相关
  async login(username, password) {
    const result = await this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    
    if (result.token) {
      localStorage.setItem('authToken', result.token)
      return true
    } else {
      return false
    }
  },

  async checkAuth() {
    try {
      const result = await this.request('/api/check-auth')
      return result.authenticated
    } catch (error) {
      return false
    }
  },

  // 歌曲相关
  async getSongs() {
    return this.request('/api/songs')
  },

  async addSong(song) {
    return this.request('/api/songs', {
      method: 'POST',
      body: JSON.stringify(song)
    })
  },

  async deleteSong(id) {
    return this.request(`/api/songs/${id}`, {
      method: 'DELETE'
    })
  }
}
