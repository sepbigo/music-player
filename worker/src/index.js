import { Router } from 'itty-router'
import { handleAuth } from './auth.js'
import { handleSongs } from './songs.js'

const router = Router()

// CORS 中间件
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

function handleCORS(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
}

// 认证中间件
async function authenticate(request, env) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    const jwt = await import('jsonwebtoken')
    return jwt.verify(token, env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

// 路由
router
  .options('*', handleCORS)
  
  // 认证路由
  .post('/api/login', (request, env) => handleAuth.login(request, env))
  .post('/api/register', (request, env) => handleAuth.register(request, env))
  .get('/api/check-auth', (request, env) => handleAuth.checkAuth(request, env))
  
  // 歌曲路由
  .get('/api/songs', (request, env) => handleSongs.getSongs(request, env))
  .post('/api/songs', async (request, env) => {
    const user = await authenticate(request, env)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    return handleSongs.addSong(request, env)
  })
  .delete('/api/songs/:id', async (request, env) => {
    const user = await authenticate(request, env)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    return handleSongs.deleteSong(request, env)
  })

// 主处理器
export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx).catch(err => {
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    })
  }
}
