<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content admin-panel">
      <div class="modal-header">
        <h2>歌曲管理</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="icon-close"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="add-song-form">
          <h3>添加新歌曲</h3>
          <form @submit.prevent="addSong">
            <div class="form-row">
              <div class="form-group">
                <label for="title">歌曲标题 *</label>
                <input 
                  type="text" 
                  id="title" 
                  v-model="newSong.title" 
                  required
                  placeholder="歌曲名称"
                >
              </div>
              
              <div class="form-group">
                <label for="artist">艺术家 *</label>
                <input 
                  type="text" 
                  id="artist" 
                  v-model="newSong.artist" 
                  required
                  placeholder="艺术家名称"
                >
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="duration">时长</label>
                <input 
                  type="text" 
                  id="duration" 
                  v-model="newSong.duration" 
                  placeholder="例如: 3:45"
                >
              </div>
              
              <div class="form-group full-width">
                <label for="url">歌曲URL *</label>
                <input 
                  type="url" 
                  id="url" 
                  v-model="newSong.url" 
                  required
                  placeholder="https://example.com/song.mp3"
                >
              </div>
            </div>
            
            <button type="submit" class="add-btn" :disabled="isAdding">
              {{ isAdding ? '添加中...' : '添加歌曲' }}
            </button>
          </form>
          
          <div class="form-message" v-if="formMessage">
            {{ formMessage }}
          </div>
        </div>
        
        <div class="song-count">
          当前共有 {{ songs.length }} 首歌曲
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { usePlayerStore } from '../stores/player'

export default {
  name: 'AdminPanel',
  emits: ['close'],
  setup(props, { emit }) {
    const playerStore = usePlayerStore()
    const isAdding = ref(false)
    const formMessage = ref('')
    
    const newSong = ref({
      title: '',
      artist: '',
      duration: '',
      url: ''
    })
    
    const songs = computed(() => playerStore.songs)
    
    const addSong = async () => {
      if (!newSong.value.title || !newSong.value.artist || !newSong.value.url) {
        formMessage.value = '请填写所有必填字段（带*号）'
        return
      }
      
      isAdding.value = true
      formMessage.value = ''
      
      try {
        const success = await playerStore.addSong(newSong.value)
        if (success) {
          formMessage.value = '歌曲添加成功！'
          newSong.value = {
            title: '',
            artist: '',
            duration: '',
            url: ''
          }
        } else {
          formMessage.value = '添加歌曲失败，请检查网络连接'
        }
      } catch (error) {
        formMessage.value = '添加歌曲失败: ' + error.message
      } finally {
        isAdding.value = false
      }
    }
    
    return {
      newSong,
      songs,
      isAdding,
      formMessage,
      addSong
    }
  }
}
</script>

<style scoped>
.admin-panel {
  max-width: 600px;
}

.form-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.form-group {
  flex: 1;
}

.form-group.full-width {
  flex: 2;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
}

.form-group input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.add-btn {
  background: var(--success-color);
  color: white;
  padding: 12px 20px;
  width: 100%;
  margin-top: 10px;
  transition: background 0.3s;
}

.add-btn:hover:not(:disabled) {
  background: #27ae60;
}

.add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-message {
  margin-top: 10px;
  padding: 8px 12px;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.form-message:not(:empty) {
  background: rgba(46, 204, 113, 0.2);
  color: var(--success-color);
}

.song-count {
  margin-top: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>
