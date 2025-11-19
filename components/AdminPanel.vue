<template>
  <div class="min-h-screen bg-gray-900 text-white p-8">
    <h1 class="text-3xl font-bold mb-8">管理面板</h1>
    <div class="mb-8">
      <h2 class="text-2xl font-bold mb-4">添加歌曲</h2>
      <form @submit.prevent="addSong" class="flex flex-col space-y-4">
        <input v-model="newSong.title" type="text" placeholder="标题" class="p-2 rounded bg-gray-800" required />
        <input v-model="newSong.artist" type="text" placeholder="艺术家" class="p-2 rounded bg-gray-800" required />
        <input v-model="newSong.url" type="url" placeholder="歌曲URL" class="p-2 rounded bg-gray-800" required />
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          添加
        </button>
      </form>
    </div>
    <div>
      <h2 class="text-2xl font-bold mb-4">歌曲列表</h2>
      <table class="w-full">
        <thead>
          <tr class="text-left">
            <th class="p-2">标题</th>
            <th class="p-2">艺术家</th>
            <th class="p-2">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(song, index) in playerStore.songs" :key="song.id" class="hover:bg-gray-700">
            <td class="p-2">{{ song.title }}</td>
            <td class="p-2">{{ song.artist }}</td>
            <td class="p-2">
              <button
                @click="removeSong(index)"
                class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePlayerStore } from '../stores/player'

const playerStore = usePlayerStore()
const newSong = ref({
  title: '',
  artist: '',
  url: ''
})

const addSong = () => {
  playerStore.addSong({
    id: Date.now(), // 简单使用时间戳作为ID
    ...newSong.value
  })
  newSong.value = { title: '', artist: '', url: '' }
}

const removeSong = (index) => {
  playerStore.removeSong(index)
}
</script>
