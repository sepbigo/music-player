import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { api } from '../utils/api.js'

export const usePlayerStore = defineStore('player', () => {
  const songs = ref([])
  const currentSongIndex = ref(0)
  const isPlaying = ref(false)
  const progress = ref(0)
  const volume = ref(80)
  const searchQuery = ref('')
  const isLoading = ref(false)
  
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

  // 加载歌曲
  async function loadSongs() {
    isLoading.value = true
    try {
      songs.value = await api.getSongs()
    } catch (error) {
      console.error('Failed to load songs:', error)
      // 设置一些默认歌曲作为后备
      songs.value = [
        {
          id: 1,
          title: '示例歌曲',
          artist: '示例艺术家',
          duration: '3:45',
          url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        }
      ]
    } finally {
      isLoading.value = false
    }
  }
  
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
    if (songs.value.length > 0) {
      currentSongIndex.value = (currentSongIndex.value + 1) % songs.value.length
    }
  }
  
  function prevSong() {
    if (songs.value.length > 0) {
      currentSongIndex.value = (currentSongIndex.value - 1 + songs.value.length) % songs.value.length
    }
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
  
  async function addSong(song) {
    try {
      const newSong = await api.addSong(song)
      songs.value.push(newSong)
      return true
    } catch (error) {
      console.error('Failed to add song:', error)
      return false
    }
  }
  
  async function removeSong(index) {
    const songId = songs.value[index].id
    try {
      await api.deleteSong(songId)
      songs.value.splice(index, 1)
      
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
      return true
    } catch (error) {
      console.error('Failed to delete song:', error)
      return false
    }
  }
  
  // 在 store 创建时加载歌曲
  onMounted(() => {
    loadSongs()
  })
  
  return {
    songs,
    currentSongIndex,
    isPlaying,
    progress,
    volume,
    searchQuery,
    isLoading,
    currentSong,
    filteredSongs,
    loadSongs,
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
