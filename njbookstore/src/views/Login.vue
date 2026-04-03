<template>
  <div class="login-page">
    <!-- 左侧主题区域 -->
    <div class="theme-section">
      <div class="theme-background"></div>
      <div class="theme-content">
        <h1 class="theme-title">金陵文枢</h1>
        <h2 class="theme-subtitle">书坊寻踪</h2>
        <div class="theme-description">
          <p>穿越时空，探寻金陵书坊的千年文脉</p>
          <p>感受传统文化的魅力与智慧</p>
          <p>在这里，您将体验独特的文化之旅</p>
          <p>与志同道合的读书人共同交流</p>
        </div>
      </div>
    </div>
    
    <!-- 右侧登录区域 -->
    <div class="login-section">
      <div class="background-decoration">
        <div class="ink-splash"></div>
      </div>
      
      <div class="login-container">
        <div class="login-header">
          <h2>登 录</h2>
          <div class="decoration-line"></div>
        </div>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label class="form-label">用户名</label>
            <div class="input-wrapper">
              <input
                type="text"
                v-model="form.username"
                placeholder="请输入用户名"
                :class="{ 'input-error': errors.username }"
                @blur="validateUsername"
              />
              <div class="input-border"></div>
            </div>
            <div v-if="errors.username" class="error-message">{{ errors.username }}</div>
          </div>
          
          <div class="form-group">
            <label class="form-label">密 码</label>
            <div class="input-wrapper">
              <input
                type="password"
                v-model="form.password"
                placeholder="请输入密码"
                :class="{ 'input-error': errors.password }"
                @blur="validatePassword"
              />
              <div class="input-border"></div>
            </div>
            <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
          </div>
          
          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="form.remember" />
            <label for="remember">记住密码</label>
          </div>
          
          <button type="submit" class="login-button" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="loading-spinner"></span>
            <span v-else>登 录</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  username: '',
  password: '',
  remember: false
})
const errors = reactive({
  username: '',
  password: ''
})
const isSubmitting = ref(false)

function validateUsername() {
  if (!form.username) {
    errors.username = '请输入用户名'
  } else {
    errors.username = ''
  }
}

function validatePassword() {
  if (!form.password) {
    errors.password = '请输入密码'
  } else {
    errors.password = ''
  }
}

function handleLogin() {
  validateUsername()
  validatePassword()
  
  if (!errors.username && !errors.password) {
    isSubmitting.value = true
    
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({
        username: form.username,
        isLoggedIn: true,
        lastLoginTime: new Date().toISOString()
      }))
      
      const redirect = router.currentRoute.value.query.redirect || '/'
      router.push(redirect)
    }, 1000)
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* 左侧主题区域 */
.theme-section {
  flex: 1.1;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/materials/shalong/登录界面.png');
  background-size: cover;
  background-position: center;
  opacity: 1;
}

.theme-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #8B4513;
  padding: 0 60px;
}

.theme-title {
  font-size: 56px;
  font-weight: bold;
  margin: 0 0 20px 0;
  font-family: 'Ma Shan Zheng', cursive, 'SimSun', serif;
  letter-spacing: 8px;
  text-shadow: 
    2px 2px 4px rgba(255, 255, 255, 0.9),
    1px 1px 2px rgba(0, 0, 0, 0.3);
}

.theme-subtitle {
  font-size: 56px;
  font-weight: bold;
  margin: 0 0 30px 0;
  font-family: 'Ma Shan Zheng', cursive, 'SimSun', serif;
  letter-spacing: 8px;
  text-shadow: 
    2px 2px 4px rgba(255, 255, 255, 0.9),
    1px 1px 2px rgba(0, 0, 0, 0.3);
}

.theme-description {
  font-size: 20px;
  line-height: 2;
  margin-bottom: 40px;
  font-family: 'SimSun', serif;
  font-weight: bold;
  text-shadow: 
    1px 1px 3px rgba(255, 255, 255, 0.9),
    1px 1px 2px rgba(0, 0, 0, 0.3);
}

.theme-decorations {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
}

.brush-decoration {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.scroll-decoration {
  width: 3px;
  height: 60px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.6), transparent);
}

/* 右侧登录区域 */
.login-section {
  flex: 0.9;
  background-color: #faf5e6;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.ink-splash {
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(139, 69, 19, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.login-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 50px 40px;
  border-radius: 16px;
  box-shadow: 
    0 12px 40px rgba(139, 69, 19, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 2;
  border: 2px solid rgba(139, 69, 19, 0.2);
  backdrop-filter: blur(15px);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  color: #8B4513;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 20px 0;
  font-family: 'Ma Shan Zheng', cursive, 'SimSun', serif;
  letter-spacing: 6px;
}

.decoration-line {
  width: 80px;
  height: 3px;
  background: linear-gradient(to right, transparent, #8B4513, transparent);
  margin: 0 auto;
  border-radius: 2px;
}

.form-group {
  margin-bottom: 30px;
}

.form-label {
  display: block;
  margin-bottom: 12px;
  color: #8B4513;
  font-weight: bold;
  font-family: 'SimSun', serif;
  font-size: 16px;
}

.input-wrapper {
  position: relative;
}

input {
  width: 100%;
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  background: #f5f0e6;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
  font-family: 'SimSun', serif;
}

input:focus {
  outline: none;
  background: #fff8e6;
  box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.2);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, transparent, #8B4513, transparent);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

input:focus + .input-border {
  transform: scaleX(1);
}

input.input-error {
  border: 2px solid #ff6b6b;
  background: #fff0f0;
}

.error-message {
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 8px;
  font-family: 'SimSun', serif;
}

.remember-me {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.remember-me input {
  width: auto;
  margin-right: 12px;
}

.remember-me label {
  margin: 0;
  color: #666;
  cursor: pointer;
  font-family: 'SimSun', serif;
}

.login-button {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'SimSun', serif;
  letter-spacing: 3px;
  position: relative;
  overflow: hidden;
}

.login-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.login-button:hover:not(:disabled)::before {
  left: 100%;
}

.login-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #A0522D, #CD853F);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.4);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }
  
  .theme-section {
    flex: 0 0 350px;
  }
  
  .theme-title {
    font-size: 48px;
    letter-spacing: 6px;
  }
  
  .theme-subtitle {
    font-size: 48px;
    letter-spacing: 6px;
  }
  
  .theme-description {
    font-size: 20px;
  }
  
  .login-section {
    padding: 30px 20px;
  }
  
  .login-container {
    padding: 40px 30px;
  }
}

@media (max-width: 480px) {
  .theme-title {
    font-size: 36px;
    letter-spacing: 4px;
  }
  
  .theme-subtitle {
    font-size: 36px;
    letter-spacing: 4px;
  }
  
  .theme-description {
    font-size: 18px;
    padding: 0 20px;
  }
  
  .login-container {
    padding: 30px 20px;
  }
  
  .login-header h2 {
    font-size: 24px;
    letter-spacing: 4px;
  }
}
</style>