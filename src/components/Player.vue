<template>
  <div class="player">
    <div class="player-info">
      <div class="album-art">
        <div class="placeholder-art">
          <i class="icon-music"></i>
        </div>
      </div>
      <div class="song-info">
        <h2 class="song-title">{{ currentSong ? currentSong.title : '无歌曲' }}</h2>
        <p class="song-artist">{{ currentSong ? currentSong.artist : '选择歌曲开始播放' }}</p>
        <div class="song-progress" v-if="currentSong">
          {{ formatTime(currentTime) }} / {{ currentSong.duration }}
        </div>
      </div>
    </div>
    
    <div class="player-controls">
      <div class="control-buttons">
        <button class="control-btn" @click="prevSong" :disabled="!currentSong">
          <i class="icon-prev"></i>
        </button>
        <button class="play-btn" @click="togglePlay" :disabled="!currentSong">
          <i :class="isPlaying ? 'icon-pause' : 'icon-play'"></i>
        </button>
        <button class="control-btn" @click="nextSong" :disabled="!currentSong">
          <i class="icon-next"></i>
        </button>
      </div>
      
      <div class="progress-container">
        <span class="time-current">{{ formatTime(currentTime) }}</span>
        <div class="progress-bar" @click="seek" :class="{ disabled: !currentSong }">
          <div class="progress" :style="{ width: progress + '%' }"></div>
        </div>
        <span class="time-total">{{ currentSong ? currentSong.duration : '0:00' }}</span>
      </div>
    </div>
    
    <div class="player-extra">
      <div class="volume-control">
        <i class="icon-volume"></i>
        <input 
          type="range" 
          min="0" 
          max="100" 
          v-model="volume" 
          class="volume-slider"
          @input="setVolume"
        >
      </div>
    </div>
    
    <!-- 隐藏的音频元素 -->
    <audio 
      ref="audioElement" 
      :src="currentSong ? currentSong.url : ''" 
      @timeupdate="updateProgress"
      @ended="nextSong"
      @loadedmetadata="onLoadedMetadata"
      @error="onAudioError"
    ></audio>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '../stores/player'

export default {
  name: 'Player',
  setup() {
    const playerStore = usePlayerStore()
    const audioElement = ref(null)
    const currentTime = ref(0)
    const duration = ref(0)
    
    const currentSong = computed(() => playerStore.currentSong)
    const isPlaying = computed(() => playerStore.isPlaying)
    const progress = computed(() => playerStore.progress)
    const volume = computed(() => playerStore.volume)
    
    watch(isPlaying, (newVal) => {
      if (audioElement.value) {
        if (newVal) {
          audioElement.value.play().catch(e => {
            console.error('播放失败:', e)
            playerStore.pauseSong()
          })
        } else {
          audioElement.value.pause()
        }
      }
    })
    
    watch(currentSong, () => {
      if (audioElement.value && playerStore.isPlaying) {
        audioElement.value.play().catch(e => {
          console.error('播放失败:', e)
          playerStore.pauseSong()
        })
      }
      currentTime.value = 0
      duration.value = 0
    })
    
    const togglePlay = () => {
      if (playerStore.isPlaying) {
        playerStore.pauseSong()
      } else {
        playerStore.resumeSong()
      }
    }
    
    const updateProgress = () => {
      if (audioElement.value) {
        const current = audioElement.value.currentTime
        const totalDuration = audioElement.value.duration || 1
        currentTime.value = current
        duration.value = totalDuration
        playerStore.setProgress((current / totalDuration) * 100)
      }
    }
    
    const onLoadedMetadata = () => {
      if (audioElement.value) {
        duration.value = audioElement.value.duration
      }
    }
    
    const onAudioError = (error) => {
      console.error('音频加载错误:', error)
      // 可以在这里添加错误处理，比如跳过无法播放的歌曲
    }
    
    const seek = (e) => {
      if (!audioElement.value || !currentSong.value) return
      
      const progressBar = e.currentTarget
      const clickPosition = e.offsetX
      const width = progressBar.clientWidth
      const totalDuration = audioElement.value.duration
      
      if (totalDuration) {
        const seekTime = (clickPosition / width) * totalDuration
        audioElement.value.currentTime = seekTime
        playerStore.setProgress((seekTime / totalDuration) * 100)
      }
    }
    
    const setVolume = () => {
      playerStore.setVolume(volume.value)
      if (audioElement.value) {
        audioElement.value.volume = volume.value / 100
      }
    }
    
    const formatTime = (seconds) => {
      if (isNaN(seconds)) return '0:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }
    
    const prevSong = () => {
      playerStore.prevSong()
    }
    
    const nextSong = () => {
      playerStore.nextSong()
    }
    
    onMounted(() => {
      if (audioElement.value) {
        audioElement.value.volume = volume.value / 100
      }
    })
    
    onUnmounted(() => {
      if (audioElement.value) {
        audioElement.value.pause()
      }
    })
    
    return {
      audioElement,
      currentSong,
      isPlaying,
      progress,
      volume,
      currentTime,
      duration,
      togglePlay,
      updateProgress,
      onLoadedMetadata,
      onAudioError,
      seek,
      setVolume,
      formatTime,
      prevSong,
      nextSong
    }
  }
}
</script>

<style scoped>
.player {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
}

.player-info {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  width: 100%;
  max-width: 500px;
}

.album-art {
  width: 120px;
  height: 120px;
  margin-right: 20px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.placeholder-art {
  font-size: 40px;
  color: rgba(255, 255, 255, 0.5);
}

.song-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-size: 24px;
  margin-bottom: 8px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-artist {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.song-progress {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.player-controls {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

.control-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.control-btn, .play-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 10px;
  font-size: 18px;
  transition: all 0.3s ease;
}

.control-btn:disabled, .play-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.control-btn:not(:disabled):hover, .play-btn:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.play-btn {
  width: 70px;
  height: 70px;
  background: var(--primary-color);
  font-size: 24px;
}

.play-btn:not(:disabled):hover {
  background: #2980b9;
}

.progress-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.time-current, .time-total {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  width: 50px;
  text-align: center;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  margin: 0 15px;
  cursor: pointer;
  position: relative;
}

.progress-bar.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.progress {
  height: 100%;
  background: var(--primary-color);
  border-radius: 3px;
  transition: width 0.1s linear;
}

.player-extra {
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: flex-end;
}

.volume-control {
  display: flex;
  align-items: center;
  width: 150px;
}

.volume-slider {
  flex: 1;
  margin-left: 10px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
}

@media (max-width: 768px) {
  .player {
    padding: 15px;
  }
  
  .player-info {
    flex-direction: column;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .album-art {
    margin-right: 0;
    margin-bottom: 15px;
    width: 100px;
    height: 100px;
  }
  
  .song-title {
    font-size: 20px;
  }
  
  .control-btn, .play-btn {
    width: 45px;
    height: 45px;
  }
  
  .play-btn {
    width: 60px;
    height: 60px;
  }
  
  .volume-control {
    width: 120px;
  }
}
</style>
