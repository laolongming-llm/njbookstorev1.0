<template>
  <main class="shalong-wish-page">
    <!-- 顶部导航 -->
    <IndexTopNav />
    
    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <img src="/materials/shalong/返回键.png" alt="返回" class="back-button-image" />
    </button>
    
    <!-- 装饰图片 -->
    <img src="/materials/shalong/装饰图6.png" alt="装饰图6" class="decoration-image-6" />
    
    <!-- 主内容区域 -->
    <section class="main-content">
      <!-- 左侧表单区域（60%） -->
      <div class="left-section">
        <div class="form-container">
          <h2 class="form-title">我要参与共创</h2>
          <p class="form-subtitle">分享您的想法，让文学的力量传递更远</p>
          <div class="form-decoration">
            <div class="decoration-line left"></div>
            <div class="decoration-dot"></div>
            <div class="decoration-line right"></div>
          </div>
          <form class="wish-form">
            <div class="form-group">
              <label for="author" class="form-label">
                <span class="label-icon">👤</span>
                您的昵称
              </label>
              <input 
                type="text" 
                id="author" 
                v-model="newWish.author" 
                placeholder="请输入您的昵称（至少两个字符）"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="content" class="form-label">
                <span class="label-icon">💭</span>
                您的心愿
              </label>
              <textarea 
                id="content" 
                v-model="newWish.content" 
                placeholder="请输入您的心愿或想法...（至少五个字）" 
                rows="6"
                class="form-textarea"
              ></textarea>
              <div class="char-count">
                {{ newWish.content.length }}/200
              </div>
            </div>
            <button 
              type="button" 
              class="submit-button" 
              @click="submitWish" 
              :disabled="submitting || !isFormValid"
            >
              <span v-if="submitting" class="button-spinner"></span>
              {{ submitting ? '提交中...' : '提交心愿' }}
            </button>
          </form>
        </div>
      </div>
      
      <!-- 右侧心愿墙区域（30%） -->
      <div class="right-section">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载心愿中...</p>
        </div>
        
        <!-- 错误提示 -->
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button class="retry-button" @click="loadWishes">重新加载</button>
        </div>
        
        <!-- 心愿卡片 -->
        <template v-else>
          <div class="wish-card-container">
            <!-- 统计信息 -->
            <div class="stats-section" v-if="wishes.length > 0">
              <div class="stats-bar">
                <span class="stat-item">
                  <span class="stat-number">{{ wishes.length }}</span>
                  <span class="stat-label">个心愿</span>
                </span>
                <span class="stat-divider">|</span>
                <span class="stat-item">
                  <span class="stat-number">{{ getLatestDate() }}</span>
                  <span class="stat-label">最新心愿</span>
                </span>
              </div>
            </div>
            
            <!-- 心愿列表 -->
            <div 
              class="wish-item" 
              v-for="(wish, index) in displayedWishes" 
              :key="wish.id"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="wish-header">
                <div class="author-info">
                  <div class="author-avatar">
                    <span class="avatar-initial">{{ wish.author.charAt(0) }}</span>
                  </div>
                  <span class="wish-author">{{ wish.author }}</span>
                </div>
                <span class="wish-date">{{ wish.date }}</span>
              </div>
              <div class="wish-content">
                {{ wish.content }}
              </div>
              <div class="wish-footer">
                <button 
                  class="wish-action like-button" 
                  :class="{ liked: wish.isLiked }"
                  @click="toggleLike(wish.id)"
                  title="点赞"
                >
                  <span class="action-icon">♥</span>
                  <span class="action-text">{{ wish.likes }}</span>
                </button>
                <button class="wish-action" title="收藏">
                  <span class="action-icon">★</span>
                  <span class="action-text">收藏</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-if="displayedWishes.length === 0" class="empty-state">
            <div class="empty-icon">✨</div>
            <h3>暂无心愿</h3>
            <p>快来提交第一个心愿，开启文学交流之旅吧！</p>
          </div>
        </template>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import IndexTopNav from '../components/common/AppTopNav.vue'
import { getWishes, createWish } from '../services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回沙龙互动共创页面
const goBack = () => {
  router.push('/shalong')
}

// 切换点赞状态
const toggleLike = (wishId) => {
  const wish = wishes.value.find(w => w.id === wishId)
  if (wish) {
    if (wish.isLiked) {
      wish.likes--
    } else {
      wish.likes++
    }
    wish.isLiked = !wish.isLiked
  }
}

// 心愿数据
const wishes = ref([])

// 新心愿数据
const newWish = ref({
  author: '',
  content: ''
})

// 加载状态
const loading = ref(true)
const submitting = ref(false)
const error = ref('')

// 表单验证
const isFormValid = computed(() => {
  return newWish.value.author.trim().length >= 2 && 
         newWish.value.content.trim().length >= 5 &&
         newWish.value.content.trim().length <= 200
})

// 根据页面高度动态调整显示的心愿数量（最多3个）
const displayedWishes = computed(() => {
  let maxCount = 3
  
  // 根据屏幕高度调整显示数量
  if (typeof window !== 'undefined') {
    const height = window.innerHeight
    if (height <= 600) {
      maxCount = 1
    } else if (height <= 900) {
      maxCount = 2
    }
  }
  
  return wishes.value.slice(0, maxCount)
})

// 获取最新心愿日期
const getLatestDate = () => {
  if (wishes.value.length === 0) return ''
  return wishes.value[0].date
}

// 获取心愿列表
const loadWishes = async () => {
  try {
    loading.value = true
    error.value = ''
    const data = await getWishes()
    // 确保每个心愿都有正确的likes和isLiked字段
    wishes.value = data.map(wish => ({
      ...wish,
      likes: Number(wish.likes) || 0,
      isLiked: wish.isLiked || false
    }))
  } catch (err) {
    console.error('加载心愿失败:', err)
    error.value = '加载心愿失败，请稍后重试'
    // 使用本地数据作为备用
    wishes.value = [
      {
        id: 1,
        author: '文学爱好者',
        date: '2025年3月28日',
        content: '希望能举办更多关于古典文学的沙龙活动，深入了解传统文化的魅力。',
        likes: 5,
        isLiked: false
      },
      {
        id: 2,
        author: '书虫',
        date: '2025年3月27日',
        content: '期待有机会与知名作家面对面交流，分享阅读心得。',
        likes: 3,
        isLiked: false
      },
      {
        id: 3,
        author: '学生',
        date: '2025年3月26日',
        content: '希望能有更多适合年轻人的文学活动，激发阅读兴趣。',
        likes: 7,
        isLiked: false
      },
      {
        id: 4,
        author: '退休教师',
        date: '2025年3月25日',
        content: '建议举办一些关于教育与文学结合的讲座，传承文化薪火。',
        likes: 2,
        isLiked: false
      }
    ]
  } finally {
    loading.value = false
  }
}

// 提交心愿
const submitWish = async () => {
  if (!isFormValid.value) {
    alert('请填写完整信息（昵称至少2个字符，心愿内容5-200个字符）')
    return
  }
  
  try {
    submitting.value = true
    error.value = ''
    
    const wishData = {
      author: newWish.value.author.trim(),
      content: newWish.value.content.trim()
    }
    
    let newWishItem = await createWish(wishData)
    
    // 确保新心愿包含点赞相关字段
    newWishItem = {
      ...newWishItem,
      likes: 0,
      isLiked: false
    }
    
    wishes.value.unshift(newWishItem)
    
    // 清空表单
    newWish.value.author = ''
    newWish.value.content = ''
    
    // 显示成功提示
    const successToast = document.createElement('div')
    successToast.className = 'success-toast'
    successToast.textContent = '心愿提交成功！'
    document.body.appendChild(successToast)
    
    setTimeout(() => {
      successToast.remove()
    }, 3000)
  } catch (err) {
    console.error('提交心愿失败:', err)
    alert('心愿提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 监听窗口大小变化
const handleResize = () => {
  // 触发计算属性重新计算
  displayedWishes.value
}

// 组件挂载时加载数据
onMounted(() => {
  loadWishes()
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.shalong-wish-page {
  width: 100vw;
  height: 100vh;
  background-color: #faf5e6;
  position: relative;
  background-image: url('/materials/shalong/资源 2@4x.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-top: 80px;
  overflow: hidden;
}

/* 导航栏固定 */
.shalong-wish-page :deep(.index-top-nav) {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

/* 返回按钮 */
.back-button {
  position: fixed;
  top: 120px;
  left: 30px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: 10px;
  border-radius: 50%;
}

.back-button-image {
  width: 40px;
  height: 40px;
  transition: transform 0.3s ease;
}

.back-button:hover .back-button-image {
  transform: scale(1.1);
}

/* 装饰图片6 */
.decoration-image-6 {
  position: absolute;
  top: 60%;
  left: 48.5%;
  transform: translate(-50%, -50%);
  width: 110%;
  max-width: 2000px;
  z-index: 20;
  opacity: 0.8;
  pointer-events: none;
}

/* 页面头部 */
.page-header {
  text-align: center;
  padding: 0 20px 20px;
  position: relative;
}

.header-content {
  position: relative;
  z-index: 2;
}

.header-decoration {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  z-index: 1;
}

.seal-left,
.seal-right {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(139, 69, 19, 0.1), transparent);
  border: 2px solid rgba(139, 69, 19, 0.3);
}

.seal-left {
  left: 10%;
}

.seal-right {
  right: 10%;
}

.page-title {
  font-size: 3rem;
  color: #8B4513;
  margin: 0 0 15px 0;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8B4513, transparent);
}

.page-subtitle {
  font-size: 1.2rem;
  color: #6b4b25;
  margin: 0 0 30px 0;
  font-weight: 500;
}

.stats-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  display: inline-flex;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8B4513;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.stat-divider {
  color: #ccc;
  font-weight: 300;
}

/* 主内容区域 */
.main-content {
  display: flex;
  gap: 5%;
  padding: 0 50px 40px;
  max-width: 1400px;
  margin: 0 auto;
  height: calc(100vh - 80px);
  overflow: hidden;
  z-index: 5;
  position: relative;
}

/* 左侧表单区域（60%） */
.left-section {
  flex: 0 0 60%;
}

/* 右侧心愿墙区域（30%） */
.right-section {
  flex: 0 0 35%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 25px 25px 15px;
  box-shadow: 
    0 16px 40px rgba(139, 69, 19, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(240, 230, 210, 0.5);
  backdrop-filter: blur(10px);
  max-height: 85%;
  margin-bottom: 20px;
  z-index: 10;
}

.wish-card-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 
    0 8px 32px rgba(139, 69, 19, 0.15),
    0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(240, 230, 210, 0.5);
  backdrop-filter: blur(10px);
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.6s ease forwards;
  max-height: 85%;
  margin-bottom: 20px;
  z-index: 10;
}

.stats-section {
  padding: 12px 16px;
  margin-bottom: 15px;
  background: rgba(139, 69, 19, 0.05);
  border-radius: 12px;
  border-left: 4px solid #8B4513;
}

.stats-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  backdrop-filter: none;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8B4513;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.stat-divider {
  color: #ccc;
  font-weight: 300;
}

.wish-item {
  padding: 15px 0;
  border-bottom: 1px solid rgba(240, 230, 210, 0.5);
  transition: all 0.3s ease;
}

.wish-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.wish-item:hover {
  background: rgba(139, 69, 19, 0.03);
  border-radius: 12px;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.wish-card-container:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 16px 40px rgba(139, 69, 19, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.12);
}

.wish-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B4513, #A0522D);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(139, 69, 19, 0.3);
}

.wish-author {
  font-weight: 600;
  color: #8B4513;
  font-size: 1.1rem;
}

.wish-date {
  color: #999;
  font-size: 0.85rem;
  background: #f5f5f5;
  padding: 4px 12px;
  border-radius: 12px;
}

.wish-content {
  color: #333;
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 15px;
  padding: 12px;
  background: #faf9f6;
  border-radius: 12px;
  border-left: 4px solid #8B4513;
}

.wish-footer {
  display: flex;
  gap: 15px;
}

.wish-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  border: 1px solid #f0e6d2;
  border-radius: 20px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.wish-action:hover {
  background: #8B4513;
  color: white;
  border-color: #8B4513;
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.1rem;
}

/* 点赞按钮样式 */
.like-button.liked .action-icon {
  color: #ff6b6b;
}

.form-title {
  text-align: center;
  color: #8B4513;
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.form-subtitle {
  text-align: center;
  color: #6b4b25;
  margin: 0 0 15px 0;
  font-size: 0.95rem;
  font-weight: 500;
}

.form-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.decoration-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(90deg, transparent, #8B4513, transparent);
}

.decoration-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #8B4513;
}

.wish-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  color: #8B4513;
  font-weight: 600;
  font-size: 1.1rem;
}

.label-icon {
  font-size: 1.3rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #f0e6d2;
  border-radius: 12px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #faf9f6;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8B4513;
  background: white;
  box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  text-align: right;
  font-size: 0.85rem;
  color: #999;
  margin-top: 5px;
}

.submit-button {
  background: linear-gradient(135deg, #8B4513, #A0522D);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto;
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.3);
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(139, 69, 19, 0.4);
}

.submit-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 状态样式 */
.loading-state,
.error-state,
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
  color: #8B4513;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f0e6d2;
  border-top: 4px solid #8B4513;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #8B4513;
  margin: 0 0 10px 0;
}

.empty-state p {
  font-size: 1.1rem;
  color: #666;
}

.retry-button {
  background: #8B4513;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 20px;
  cursor: pointer;
  margin-top: 20px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background: #A0522D;
  transform: translateY(-2px);
}

/* 成功提示 */
.success-toast {
  position: fixed;
  top: 100px;
  right: 20px;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 15px 25px;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
    gap: 30px;
    padding: 0 30px 60px;
  }
  
  .left-section,
  .right-section {
    flex: 1;
  }
  
  .page-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 768px) {
  .shalong-wish-page {
    padding-top: 60px;
  }
  
  .page-header {
    padding: 40px 20px 30px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .seal-left,
  .seal-right {
    width: 60px;
    height: 60px;
  }
  
  .main-content {
    padding: 0 20px 40px;
  }
  
  .wish-card-container {
    padding: 20px;
  }
  
  .wish-item {
    padding: 15px 0;
  }
  
  .form-container {
    padding: 30px 20px;
    margin: 0 20px;
  }
  
  .form-title {
    font-size: 1.8rem;
  }
  
  .success-toast {
    left: 20px;
    right: 20px;
    top: 80px;
  }
}

@media (max-width: 480px) {
  .stats-bar {
    flex-direction: column;
    gap: 10px;
    padding: 15px 20px;
  }
  
  .stat-divider {
    display: none;
  }
  
  .wish-content {
    font-size: 0.95rem;
    padding: 12px;
  }
  
  .wish-footer {
    flex-direction: column;
    gap: 10px;
  }
  
  .wish-action {
    justify-content: center;
  }
}
</style>
