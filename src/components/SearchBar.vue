<template>
  <div class="search-bar">
    <div class="search-icon">
      <i class="icon-search"></i>
    </div>
    <input 
      type="text" 
      v-model="query" 
      placeholder="搜索歌曲或艺术家..." 
      class="search-input"
      @input="handleSearch"
    >
    <button 
      class="clear-btn" 
      v-if="query" 
      @click="clearSearch"
    >
      <i class="icon-clear"></i>
    </button>
  </div>
</template>

<script>
import { ref } from 'vue'
import { usePlayerStore } from '../stores/player'

export default {
  name: 'SearchBar',
  setup() {
    const playerStore = usePlayerStore()
    const query = ref('')
    
    const handleSearch = () => {
      playerStore.setSearchQuery(query.value)
    }
    
    const clearSearch = () => {
      query.value = ''
      playerStore.setSearchQuery('')
    }
    
    return {
      query,
      handleSearch,
      clearSearch
    }
  }
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 5px 15px;
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
}

.search-bar:focus-within {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
}

.search-icon {
  margin-right: 10px;
  color: rgba(255, 255, 255, 0.7);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  padding: 8px 0;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.clear-btn {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  padding: 5px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

@media (max-width: 768px) {
  .search-bar {
    max-width: 100%;
    margin-bottom: 0;
  }
}
</style>
