<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900">
    <div class="bg-gray-800 p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4 text-white">管理员登录</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="password" class="block text-gray-300">密码</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full p-2 rounded bg-gray-700 text-white"
            required
          />
        </div>
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          登录
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePlayerStore } from '../stores/player'

const playerStore = usePlayerStore()
const password = ref('')

// 在实际应用中，你应该有一个后端来验证密码，这里我们简单使用一个固定密码
const login = () => {
  if (password.value === 'admin') {
    playerStore.login()
  } else {
    alert('密码错误')
  }
}
</script>
