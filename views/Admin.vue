<template>
  <div>
    <AdminLogin v-if="!playerStore.isAdmin" />
    <AdminPanel v-else />
  </div>
</template>

<script setup>
import { usePlayerStore } from '../stores/player'
import AdminLogin from '../components/AdminLogin.vue'
import AdminPanel from '../components/AdminPanel.vue'

const playerStore = usePlayerStore()
</script>
