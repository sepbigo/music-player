const API_BASE_URL = 'https://your-worker.your-account.workers.dev'

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
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  },

  // 认证相关
  async login(username, password) {
    return this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
  },

  async checkAuth() {
    return this.request('/api/check-auth')
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
