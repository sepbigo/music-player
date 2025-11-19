import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    // 当前播放的歌曲索引
    currentSongIndex: 0,
    // 歌曲列表
    songs: [
      { id: 1, title: 'Song 1', artist: 'Artist 1', url: 'https://example.com/song1.mp3' },
      { id: 2, title: 'Song 2', artist: 'Artist 2', url: 'https://example.com/song2.mp3' }
    ],
    // 播放状态
    isPlaying: false,
    // 管理员登录状态
    isAdmin: false
  }),
  getters: {
    currentSong: (state) => state.songs[state.currentSongIndex] || null
  },
  actions: {
    setSongs(songs) {
      this.songs = songs
    },
    addSong(song) {
      this.songs.push(song)
    },
    removeSong(index) {
      this.songs.splice(index, 1)
    },
    setCurrentSongIndex(index) {
      this.currentSongIndex = index
    },
    setIsPlaying(playing) {
      this.isPlaying = playing
    },
    login() {
      this.isAdmin = true
    },
    logout() {
      this.isAdmin = false
    }
  }
})
