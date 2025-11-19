import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const handleAuth = {
  async login(request, env) {
    try {
      const { username, password } = await request.json()
      
      // 验证凭据
      if (username !== env.ADMIN_USERNAME) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 验证密码（在生产环境中使用哈希密码）
      const isValid = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH)
      if (!isValid) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // 生成 JWT token
      const token = jwt.sign(
        { username, isAdmin: true }, 
        env.JWT_SECRET, 
        { expiresIn: '24h' }
      )

      // 存储会话到 D1
      await env.DB.prepare(
        'INSERT INTO sessions (token, username, expires_at) VALUES (?, ?, ?)'
      ).bind(
        token,
        username,
        Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24小时后过期
      ).run()

      return new Response(JSON.stringify({ token, username }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Login failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  },

  async register(request, env) {
    // 注册逻辑（可选）
    return new Response(JSON.stringify({ message: 'Registration disabled' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    })
  },

  async checkAuth(request, env) {
    try {
      const authHeader = request.headers.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ authenticated: false }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const token = authHeader.substring(7)
      
      // 验证 token
      const decoded = jwt.verify(token, env.JWT_SECRET)
      
      // 检查会话是否在 D1 中有效
      const session = await env.DB.prepare(
        'SELECT * FROM sessions WHERE token = ? AND expires_at > ?'
      ).bind(token, Math.floor(Date.now() / 1000)).first()

      if (!session) {
        return new Response(JSON.stringify({ authenticated: false }), {
          headers: { 'Content-Type': 'application/json' }
        })
      }

      return new Response(JSON.stringify({ 
        authenticated: true, 
        username: decoded.username 
      }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ authenticated: false }), {
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}
