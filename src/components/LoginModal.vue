<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>管理员登录</h2>
        <button class="close-btn" @click="$emit('close')">
          <i class="icon-close"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">用户名</label>
            <input 
              type="text" 
              id="username" 
              v-model="username" 
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password">密码</label>
            <input 
              type="password" 
              id="password" 
              v-model="password" 
              required
            >
          </div>
          
          <button type="submit" class="login-btn">登录</button>
        </form>
        
        <div class="error-message" v-if="error">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { login } from '../utils/auth'

export default {
  name: 'LoginModal',
  emits: ['close', 'login'],
  setup(props, { emit }) {
    const username = ref('')
    const password = ref('')
    const error = ref('')
    
    const handleLogin = () => {
      const success = login(username.value, password.value)
      if (success) {
        emit('login', true)
      } else {
        error.value = '用户名或密码错误'
      }
    }
    
    return {
      username,
      password,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--dark-color);
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  margin: 0;
  color: white;
}

.close-btn {
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  padding: 5px;
  border-radius: 4px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.form-group input:focus {
  border-color: var(--primary-color);
  outline: none;
}

.login-btn {
  width: 100%;
  background: var(--primary-color);
  color: white;
  padding: 12px;
  font-size: 16px;
  margin-top: 10px;
}

.login-btn:hover {
  background: #2980b9;
}

.error-message {
  margin-top: 15px;
  padding: 10px;
  background: rgba(231, 76, 60, 0.2);
  color: var(--danger-color);
  border-radius: 4px;
  text-align: center;
}
</style>
