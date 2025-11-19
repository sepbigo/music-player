<template>
  <div class="song-list">
    <div class="list-header">
      <div class="header-item">#</div>
      <div class="header-item title">标题</div>
      <div class="header-item artist">艺术家</div>
      <div class="header-item duration">时长</div>
      <div class="header-item actions" v-if="isAdmin">操作</div>
    </div>
    
    <div class="songs-container">
      <div 
        v-for="(song, index) in filteredSongs" 
        :key="song.id"
        :class="['song-item', { active: currentSongIndex === index }]"
        @click="playSong(index)"
      >
        <div class="item-index">
          <span v-if="currentSongIndex !== index">{{ index + 1 }}</span>
          <i v-else class="icon-playing"></i>
        </div>
        <div class="item-title">{{ song.title }}</div>
        <div class="item-artist">{{ song.artist }}</div>
        <div class="item-duration">{{ song.duration }}</div>
        <div class="item-actions" v-if="isAdmin">
          <button class="delete-btn" @click.stop="removeSong(index)">
            <i class="icon-delete"></i>
          </button>
        </div>
      </div>
      
      <div class="empty-state" v-if="filteredSongs.length === 0">
        <p>没有找到匹配的歌曲</p>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { usePlayerStore } from '../stores/player'
import { checkAuth } from '../utils/auth'

export default {
  name: 'SongList',
  setup() {
    const playerStore = usePlayerStore()
    const isAdmin = checkAuth()
    
    const filteredSongs = computed(() => playerStore.filteredSongs)
    const currentSongIndex = computed(() => playerStore.currentSongIndex)
    
    const playSong = (index) => {
      // 找到在原始歌曲列表中的索引
      const originalIndex = playerStore.songs.findIndex(
        song => song.id === filteredSongs.value[index].id
      )
      playerStore.playSong(originalIndex)
    }
    
    const removeSong = (index) => {
      // 找到在原始歌曲列表中的索引
      const originalIndex = playerStore.songs.findIndex(
        song => song.id === filteredSongs.value[index].id
      )
      playerStore.removeSong(originalIndex)
    }
    
    return {
      filteredSongs,
      currentSongIndex,
      isAdmin,
      playSong,
      removeSong
    }
  }
}
</script>

<style scoped>
.song-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  padding: 10px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.header-item {
  padding: 0 10px;
}

.header-item.title {
  flex: 3;
}

.header-item.artist {
  flex: 2;
}

.header-item.duration {
  width: 60px;
  text-align: center;
}

.header-item.actions {
  width: 60px;
  text-align: center;
}

.songs-container {
  flex: 1;
  overflow-y: auto;
}

.song-item {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background 0.2s ease;
  align-items: center;
}

.song-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.song-item.active {
  background: rgba(52, 152, 219, 0.2);
  color: var(--primary-color);
}

.item-index {
  width: 30px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.song-item.active .item-index {
  color: var(--primary-color);
}

.item-title {
  flex: 3;
  padding: 0 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-artist {
  flex: 2;
  padding: 0 10px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-duration {
  width: 60px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
}

.item-actions {
  width: 60px;
  text-align: center;
}

.delete-btn {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  padding: 5px;
  border-radius: 4px;
}

.delete-btn:hover {
  background: rgba(231, 76, 60, 0.2);
  color: var(--danger-color);
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .list-header {
    padding: 8px 10px;
    font-size: 12px;
  }
  
  .song-item {
    padding: 10px;
    font-size: 14px;
  }
  
  .header-item.artist, .item-artist {
    display: none;
  }
  
  .header-item.title, .item-title {
    flex: 1;
  }
}
</style>
