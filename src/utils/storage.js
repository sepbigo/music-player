// 本地存储工具

const SONGS_KEY = 'music-player-songs'

export function getSongs() {
  try {
    const songs = localStorage.getItem(SONGS_KEY)
    return songs ? JSON.parse(songs) : null
  } catch (error) {
    console.error('获取歌曲列表失败:', error)
    return null
  }
}

export function saveSongs(songs) {
  try {
    localStorage.setItem(SONGS_KEY, JSON.stringify(songs))
    return true
  } catch (error) {
    console.error('保存歌曲列表失败:', error)
    return false
  }
}
