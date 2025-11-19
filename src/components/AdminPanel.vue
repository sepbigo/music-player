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
                <label for="title">歌曲标题</label>
                <input 
                  type="text" 
                  id="title" 
                  v-model="newSong.title" 
                  required
                >
              </div>
              
              <div class="form-group">
                <label for="artist">艺术家</label>
                <input 
                  type="text" 
                  id="artist" 
                  v-model="newSong.artist" 
                  required
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
                  required
                >
              </div>
              
              <div class="form-group full-width">
                <label for="url">歌曲URL</label>
                <input 
                  type="url" 
                  id="url" 
                  v-model="newSong.url" 
                  placeholder="https://example.com/song.mp3"
                  required
                >
              </div>
            </div>
            
            <button type="submit" class="add-btn">添加歌曲</button>
          </form>
        </div>
        
        <div class="song-count">
          当前共有 {{ songs.length }} 首歌曲
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { usePlayerStore } from '../stores/player'

export default {
  name: 'AdminPanel',
  emits: ['close'],
  setup(props, { emit }) {
    const playerStore = usePlayerStore()
    
    const newSong = ref({
      title: '',
      artist: '',
      duration: '',
      url: ''
    })
    
    const songs = ref(playerStore.songs)
    
    const addSong = () => {
      playerStore.addSong(newSong.value)
      newSong.value = {
        title: '',
        artist: '',
        duration: '',
        url: ''
      }
    }
    
    return {
      newSong,
      songs,
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

.add-btn {
  background: var(--success-color);
  color: white;
  padding: 12px 20px;
  width: 100%;
  margin-top: 10px;
}

.add-btn:hover {
  background: #27ae60;
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
