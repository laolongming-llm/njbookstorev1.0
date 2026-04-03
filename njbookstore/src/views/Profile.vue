<template>
  <div class="profile-page">

    
    <div class="profile-container">
      <!-- 左侧功能区域 -->
      <div class="function-section">
        <div class="function-background"></div>
        <div class="function-content">
          <div class="section-header">
            <h3 class="section-title">功能天地</h3>
            <div class="bamboo-divider"></div>
          </div>
          
          <div class="function-cards">
            <div class="combined-function-card">
              <div class="function-item" @click="goToShalong">
                <div class="card-icon">🏮</div>
                <div class="card-content">
                  <h4>我的沙龙</h4>
                  <p>查看参与的沙龙活动</p>
                </div>
                <div class="card-arrow">➡️</div>
              </div>
              
              <div class="function-divider"></div>
              
              <div class="function-item" @click="goToWish">
                <div class="card-icon">📜</div>
                <div class="card-content">
                  <h4>我的心愿</h4>
                  <p>管理发布的共创心愿</p>
                </div>
                <div class="card-arrow">➡️</div>
              </div>
            </div>
            
            <!-- 返回主页按钮 -->
            <div class="home-button-container">
              <button class="home-button" @click="goBackHome">
                <span class="button-icon">🏠</span>
                <span>返回主页</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧用户信息区域 - 书卷展开式布局 -->
      <div class="user-section">
        <div class="section-header">
          <h3 class="section-title">个人信息</h3>
          <div class="bamboo-divider"></div>
        </div>
        <div class="user-info-card">
          <div class="user-info-content">
            <div class="avatar-container">
              <div class="avatar">
                <span class="calligraphy-letter">{{ username.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="avatar-frame"></div>
            </div>
            
            <div class="user-details">
              <h2 class="username-title">{{ username }}</h2>
              <p class="welcome-text">欢迎归来，读书人</p>
            </div>
          </div>
          
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-label">登录次数</span>
              <span class="stat-value">{{ loginCount }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">登录时间</span>
              <span class="stat-value">
                <span class="date-part">{{ lastLoginTime.split(' ')[0] }}</span><br>
                <span class="time-part">{{ lastLoginTime.split(' ')[1] }}</span>
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">会员等级</span>
              <span class="stat-value">{{ userLevel }}</span>
            </div>
          </div>
        </div>
        
        <div class="action-card">
          <button class="logout-button" @click="handleLogout">
            <span class="button-icon">✏️</span>
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const loginCount = ref(0)
const lastLoginTime = ref('')
const userLevel = ref('读书人')

onMounted(() => {
  // 获取用户信息
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user)
    username.value = userData.username
    
    // 更新登录次数
    const count = parseInt(localStorage.getItem('loginCount') || '0') + 1
    loginCount.value = count
    localStorage.setItem('loginCount', count.toString())
    
    // 保存当前登录时间
    const now = new Date()
    const timeString = now.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    lastLoginTime.value = timeString
    localStorage.setItem('lastLoginTime', timeString)
    
    // 根据登录次数设置用户等级
    if (count >= 10) {
      userLevel.value = '书圣'
    } else if (count >= 5) {
      userLevel.value = '书仙'
    } else if (count >= 3) {
      userLevel.value = '书痴'
    } else if (count >= 1) {
      userLevel.value = '读书人'
    }
  }
})

// 返回主页（回到跳转前的页面）
const goBackHome = () => {
  // 获取之前的页面地址
  const previousPage = localStorage.getItem('previousPage')
  
  if (previousPage) {
    router.push(previousPage)
  } else {
    // 默认返回首页
    router.push('/')
  }
}

function handleLogout() {
  // 清除登录状态
  localStorage.removeItem('user')
  // 跳转到首页
  router.push('/')
}

function goToShalong() {
  router.push('/shalong')
}

function goToWish() {
  router.push('/shalong/wish')
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.ancient-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
    linear-gradient(rgba(139, 69, 19, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 69, 19, 0.02) 1px, transparent 1px);
  background-size: 100% 100%, 100% 100%, 30px 30px, 30px 30px;
}

.brush-strokes {
  position: absolute;
  top: 15%;
  right: 15%;
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, rgba(139, 69, 19, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  transform: rotate(15deg);
}

.scroll-decoration {
  position: absolute;
  bottom: 10%;
  left: 10%;
  width: 150px;
  height: 150px;
  border: 2px solid rgba(139, 69, 19, 0.1);
  border-radius: 50%;
  opacity: 0.5;
}

.profile-container {
  display: flex;
  min-height: 100vh;
  position: relative;
  z-index: 2;
  gap: 0;
}

.profile-container::after {
  content: '';
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(139, 69, 19, 0.3), transparent);
  z-index: 3;
}

.function-section {
  flex: 1.8;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.function-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/materials/shalong/个人信息界面.png');
  background-size: cover;
  background-position: center;
  opacity: 1;
}

.function-content {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 80px 30px 40px 30px;
}

.user-section {
  flex: 1.5;
  background-color: #faf5e6;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 80px 40px 40px 40px;
  min-width: 400px;
}

.user-info-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 30px 25px;
  box-shadow: 
    0 12px 40px rgba(139, 69, 19, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(139, 69, 19, 0.2);
  margin-bottom: 15px;
  margin-top: 30px;
  position: relative;
  overflow: hidden;
  max-width: 380px;
  width: 100%;
}

.user-info-content {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-bottom: 25px;
  padding-left: 20px;
  padding-top: 15px;
}

.user-info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #8B4513, #A0522D, #CD853F, #A0522D, #8B4513);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  font-family: 'Ma Shan Zheng', cursive, 'SimSun', serif;
  position: relative;
  z-index: 2;
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.3);
}

.calligraphy-letter {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.avatar-frame {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  z-index: 1;
  box-shadow: 0 4px 20px rgba(139, 69, 19, 0.2);
}

.user-details {
  padding-left: 20px;
}

.username-title {
  color: #8B4513;
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 8px 0;
  font-family: 'Ma Shan Zheng', cursive, 'SimSun', serif;
  letter-spacing: 2px;
  text-align: center;
}

.welcome-text {
  color: #6B4423;
  font-size: 16px;
  margin: 0;
  font-family: 'SimSun', serif;
  text-align: center;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  gap: 30px;
  padding: 30px 0px 0;
  border-top: 2px solid rgba(139, 69, 19, 0.15);
  border-image: linear-gradient(90deg, transparent, rgba(139, 69, 19, 0.3), transparent) 1;
}

.stat-item {
  text-align: center;
  flex: 1;
  min-width: 80px;
}

.stat-label {
  display: block;
  font-size: 13px;
  color: #8B4513;
  margin-bottom: 8px;
  font-family: 'SimSun', serif;
}

.stat-value {
  display: block;
  font-size: 22px;
  font-weight: bold;
  color: #8B4513;
  font-family: 'Ma Shan Zheng', cursive, 'SimSun', serif;
}

/* 日期和时间分开显示 */
.date-part {
  margin-left: -8px;
}

.time-part {
  /* 时间部分保持不变 */
}

.action-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 
    0 8px 32px rgba(139, 69, 19, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(139, 69, 19, 0.2);
  max-width: 380px;
  width: 100%;
}

.logout-button {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'SimSun', serif;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
}

.logout-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.logout-button:hover::before {
  left: 100%;
}

.logout-button:hover {
  background: linear-gradient(135deg, #A0522D, #CD853F);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(139, 69, 19, 0.4);
}

.button-icon {
  margin-right: 10px;
  font-size: 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  color: #8B4513;
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 15px 0;
  font-family: 'Ma Shan Zheng', cursive, 'SimSun', serif;
  letter-spacing: 3px;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.8);
}

.bamboo-divider {
  width: 120px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8B4513, transparent);
  margin: 0 auto;
  border-radius: 2px;
}

.function-cards {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 60px;
}

.combined-function-card {
  background: rgba(255, 253, 245, 0.85);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 30px 25px;
  box-shadow: 
    0 8px 32px rgba(139, 69, 19, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
  min-width: 450px;
}

.combined-function-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8B4513, transparent);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.combined-function-card:hover::before {
  transform: scaleX(1);
}

.function-item {
  display: flex;
  align-items: center;
  gap: 25px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 23.2px 0;
}

.function-item:hover {
  transform: translateY(-3px);
}

.function-divider {
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(139, 69, 19, 0.3), transparent);
  margin: 20px 0;
}

/* 返回主页按钮 */
.home-button-container {
  margin-top: 25px;
  text-align: center;
}

.home-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 160px;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.3);
}

.home-button:hover {
  background: linear-gradient(135deg, #A0522D, #CD853F);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.4);
}

.home-button .button-icon {
  font-size: 18px;
}

.card-icon {
  font-size: 56px;
  width: 100px;
  text-align: center;
  transition: transform 0.4s ease;
}

.function-item:hover .card-icon {
  transform: scale(1.1) rotate(5deg);
}

.card-content {
  flex: 1;
}

.card-content h4 {
  color: #8B4513;
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 12px 0;
  font-family: 'Ma Shan Zheng', cursive, 'SimSun', serif;
  text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.9);
}

.card-content p {
  color: #6B4423;
  font-size: 20px;
  margin: 0;
  font-family: 'SimSun', serif;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.card-arrow {
  color: #8B4513;
  font-size: 32px;
  opacity: 0.6;
  transition: all 0.4s ease;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}

.function-item:hover .card-arrow {
  opacity: 1;
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
    padding: 30px 20px;
    gap: 30px;
  }
  
  .function-cards {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .user-info-card {
    padding: 30px 20px;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }
  
  .username-title {
    font-size: 24px;
  }
  
  .user-stats {
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .user-stats {
    flex-direction: column;
    gap: 20px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .combined-function-card {
    padding: 35px 30px;
    min-width: 280px;
  }
  
  .function-item {
    padding: 25px 0;
    gap: 20px;
  }
  
  .card-icon {
    font-size: 40px;
    width: 70px;
  }
  
  .card-content h4 {
    font-size: 22px;
  }
  
  .card-content p {
    font-size: 16px;
  }
}
</style>