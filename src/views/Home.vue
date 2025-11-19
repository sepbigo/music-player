<template>
  <div class="home">
    <!-- 播放器区域 -->
    <div class="player-section">
      <Player />
    </div>
    
    <!-- 歌曲列表区域 -->
    <div class="songlist-section">
      <div class="controls">
        <SearchBar />
        <button 
          class="admin-btn" 
          @click="showLogin = true"
          v-if="!isAdmin"
        >
          管理员登录
        </button>
        <button 
          class="admin-btn" 
          @click="showAdminPanel = true"
          v-else
        >
          管理面板
        </button>
      </div>
      <SongList />
    </div>
    
    <!-- 登录模态框 -->
    <LoginModal 
      v-if="showLogin" 
      @close="showLogin = false" 
      @login="handleLogin"
    />
    
    <!-- 管理面板 -->
    <AdminPanel 
      v-if="showAdminPanel" 
      @close="showAdminPanel = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { usePlayerStore } from '../stores/player'
import Player from '../components/Player.vue'
import SongList from '../components/SongList.vue'
import SearchBar from '../components/SearchBar.vue'
import AdminPanel from '../components/AdminPanel.vue'
import LoginModal from '../components/LoginModal.vue'
import { checkAuth } from '../utils/auth'

export default {
  name: 'Home',
  components: {
    Player,
    SongList,
    SearchBar,
    AdminPanel,
    LoginModal
  },
  setup() {
    const playerStore = usePlayerStore()
    const showLogin = ref(false)
    const showAdminPanel = ref(false)
    const isAdmin = ref(false)
    
    const handleLogin = (success) => {
      if (success) {
        isAdmin.value = true
        showLogin.value = false
      }
    }
    
    onMounted(() => {
      isAdmin.value = checkAuth()
    })
    
    return {
      showLogin,
      showAdminPanel,
      isAdmin,
      handleLogin
    }
  }
}
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.player-section {
  height: 40%;
  min-height: 300px;
}

.songlist-section {
  height: 60%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  align-items: center;
}

.admin-btn {
  background: var(--accent-color);
  color: white;
  padding: 8px 16px;
}

@media (max-width: 768px) {
  .player-section {
    height: 35%;
    min-height: 250px;
  }
  
  .songlist-section {
    height: 65%;
    padding: 15px;
  }
  
  .controls {
    flex-direction: column;
    gap: 10px;
  }
}
import { onMounted } from 'vue'
import { usePlayerStore } from '../stores/player'

// 在 setup 函数中添加
const playerStore = usePlayerStore()

onMounted(() => {
  playerStore.loadSongs()
})
</style>
