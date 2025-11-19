<template>
  <div class="flex-1 bg-gray-800 text-white p-4 flex flex-col items-center justify-center">
    <div class="text-2xl">{{ currentSong.title }} - {{ currentSong.artist }}</div>
    <div class="mt-4">
      <button @click="togglePlay" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
    </div>
    <audio ref="audioElement" :src="currentSong.url" @ended="nextSong"></audio>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { usePlayerStore } from '../stores/player'

const playerStore = usePlayerStore()
const audioElement = ref(null)

const currentSong = computed(() => playerStore.currentSong)
const isPlaying = computed(() => playerStore.isPlaying)

watch(currentSong, (newSong) => {
  if (newSong && audioElement.value) {
    audioElement.value.load()
    if (isPlaying.value) {
      audioElement.value.play()
    }
  }
})

watch(isPlaying, (playing) => {
  if (audioElement.value) {
    if (playing) {
      audioElement.value.play()
    } else {
      audioElement.value.pause()
    }
  }
})

const togglePlay = () => {
  playerStore.setIsPlaying(!isPlaying.value)
}

const nextSong = () => {
  let nextIndex = playerStore.currentSongIndex + 1
  if (nextIndex >= playerStore.songs.length) {
    nextIndex = 0
  }
  playerStore.setCurrentSongIndex(nextIndex)
}
</script>
