<template>
  <div class="flex-1 bg-gray-900 text-white p-4 overflow-auto">
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索歌曲..."
        class="w-full p-2 rounded bg-gray-800 text-white"
      />
    </div>
    <table class="w-full">
      <thead>
        <tr class="text-left">
          <th class="p-2">标题</th>
          <th class="p-2">艺术家</th>
          <th class="p-2">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(song, index) in filteredSongs"
          :key="song.id"
          :class="{ 'bg-gray-700': index === playerStore.currentSongIndex }"
          class="hover:bg-gray-700"
        >
          <td class="p-2">{{ song.title }}</td>
          <td class="p-2">{{ song.artist }}</td>
          <td class="p-2">
            <button
              @click="playSong(index)"
              class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
            >
              播放
            </button>
            <button
              v-if="playerStore.isAdmin"
              @click="removeSong(index)"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
            >
              删除
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { usePlayerStore } from '../stores/player'

const playerStore = usePlayerStore()
const searchQuery = ref('')

const filteredSongs = computed(() => {
  if (!searchQuery.value) {
    return playerStore.songs
  }
  const query = searchQuery.value.toLowerCase()
  return playerStore.songs.filter(song => 
    song.title.toLowerCase().includes(query) || 
    song.artist.toLowerCase().includes(query)
  )
})

const playSong = (index) => {
  playerStore.setCurrentSongIndex(index)
  playerStore.setIsPlaying(true)
}

const removeSong = (index) => {
  playerStore.removeSong(index)
}
</script>
