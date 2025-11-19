export const handleSongs = {
  async getSongs(request, env) {
    try {
      // 从 R2 获取歌曲列表
      const songsObject = await env.SONGS_BUCKET.get('songs.json')
      
      if (!songsObject) {
        // 如果不存在，返回空数组
        return new Response(JSON.stringify([]), {
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const songs = await songsObject.json()
      return new Response(JSON.stringify(songs), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch songs' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  },

  async addSong(request, env) {
    try {
      const newSong = await request.json()
      
      // 获取现有歌曲
      const songsObject = await env.SONGS_BUCKET.get('songs.json')
      let songs = []
      
      if (songsObject) {
        songs = await songsObject.json()
      }
      
      // 添加新歌曲
      const songWithId = {
        ...newSong,
        id: Date.now(),
        createdAt: new Date().toISOString()
      }
      songs.push(songWithId)
      
      // 保存回 R2
      await env.SONGS_BUCKET.put('songs.json', JSON.stringify(songs))
      
      return new Response(JSON.stringify(songWithId), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to add song' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  },

  async deleteSong(request, env) {
    try {
      const songId = parseInt(request.params.id)
      
      // 获取现有歌曲
      const songsObject = await env.SONGS_BUCKET.get('songs.json')
      if (!songsObject) {
        return new Response(JSON.stringify({ error: 'No songs found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      let songs = await songsObject.json()
      
      // 删除歌曲
      const initialLength = songs.length
      songs = songs.filter(song => song.id !== songId)
      
      if (songs.length === initialLength) {
        return new Response(JSON.stringify({ error: 'Song not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      // 保存回 R2
      await env.SONGS_BUCKET.put('songs.json', JSON.stringify(songs))
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to delete song' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}
