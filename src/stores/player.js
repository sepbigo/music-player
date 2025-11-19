import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSongs, saveSongs } from '../utils/storage'

export const usePlayerStore = defineStore('player', () => {
  const songs = ref(getSongs() || [
    {
      id: 1,
      title: '示例歌曲1',
      artist: '示例艺术家',
      duration: '3:45',
      url: 'https://example.com/song1.mp3'
    },
    {
      id: 2,
      title: '示例歌曲2',
      artist: '示例艺术家',
      duration: '4:20',
      url: 'https://example.com/song2.mp3'
    }
  ])
  
  const currentSongIndex = ref(0)
  const isPlaying = ref(false)
  const progress = ref(0)
  const volume = ref(80)
  const searchQuery = ref('')
  
  const currentSong = computed(() => {
    return songs.value[currentSongIndex.value]
  })
  
  const filteredSongs = computed(() => {
    if (!searchQuery.value) return songs.value
    const query = searchQuery.value.toLowerCase()
    return songs.value.filter(song => 
      song.title.toLowerCase().includes(query) || 
      song.artist.toLowerCase().includes(query)
    )
  })
  
  function playSong(index) {
    currentSongIndex.value = index
    isPlaying.value = true
  }
  
  function pauseSong() {
    isPlaying.value = false
  }
  
  function resumeSong() {
    isPlaying.value = true
  }
  
  function nextSong() {
    currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length
  }
  
  function prevSong() {
    currentSongIndex.value = (currentSongIndex.value - 1 + songs.value.length) % songs.value.length
  }
  
  function setProgress(value) {
    progress.value = value
  }
  
  function setVolume(value) {
    volume.value = value
  }
  
  function setSearchQuery(query) {
    searchQuery.value = query
  }
  
  function addSong(song) {
    const newSong = {
      ...song,
      id: Date.now()
    }
    songs.value.push(newSong)
    saveSongs(songs.value)
  }
  
  function removeSong(index) {
    songs.value.splice(index, 1)
    saveSongs(songs.value)
    // 如果删除的是当前播放的歌曲
    if (currentSongIndex.value === index) {
      if (songs.value.length > 0) {
        currentSongIndex.value = 0
        isPlaying.value = true
      } else {
        currentSongIndex.value = -1
        isPlaying.value = false
      }
    } else if (currentSongIndex.value > index) {
      currentSongIndex.value--
    }
  }
  
  return {
    songs,
    currentSongIndex,
    isPlaying,
    progress,
    volume,
    searchQuery,
    currentSong,
    filteredSongs,
    playSong,
    pauseSong,
    resumeSong,
    nextSong,
    prevSong,
    setProgress,
    setVolume,
    setSearchQuery,
    addSong,
    removeSong
  }
})
