<template>
  <main class="shalong-past-page">
    <!-- 顶部导航 -->
    <IndexTopNav />
    
    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <img src="/materials/shalong/返回键.png" alt="返回" class="back-button-image" />
    </button>
    
    <!-- 装饰图片 -->
    <img src="/materials/shalong/装饰图1.png" alt="装饰图1" class="decoration-image-1" />
    <img src="/materials/shalong/装饰图2.png" alt="装饰图2" class="decoration-image-2" />

    <!-- 轮播图容器 -->
    <div class="carousel-container">
      <!-- 轮播图轨道 -->
      <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
        <!-- 轮播图项 -->
        <div class="carousel-item" v-for="salon in pastSalons" :key="salon.id">
          <img :src="salon.image" :alt="salon.title" :class="['salon-image', salon.id === 3 ? 'salon-image-3' : '']" />
          <div class="salon-content">
            <div class="salon-header">
              <h3>{{ salon.title }}</h3>
              <a :href="salon.link" class="salon-link" target="_blank">查看详情</a>
            </div>
            <p class="salon-date">{{ salon.date }}</p>
            <p class="salon-guests">嘉宾：{{ salon.guests }}</p>
            <p class="salon-description">{{ salon.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- 导航指示器 -->
      <div class="carousel-indicators">
        <button 
          v-for="(salon, index) in pastSalons" 
          :key="salon.id"
          class="indicator"
          :class="{ active: index === currentIndex }"
          @click="currentIndex = index"
        ></button>
      </div>
    </div>
    
    <!-- 底部装饰图片 -->
    <div class="page-footer">
      <img src="/materials/shalong/资源 7@4x.png" alt="底部装饰" class="footer-image" />
    </div>
  </main>
</template>

<script setup>
import IndexTopNav from '../components/common/AppTopNav.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回沙龙互动共创页面
const goBack = () => {
  router.push('/shalong')
}

// 当前轮播索引
const currentIndex = ref(0)
// 轮播定时器
let carouselTimer = null

// 往期沙龙数据
const pastSalons = [
  {
    id: 1,
    title: '先锋书店颐和路店｜南京，从"文学之都"到"生活现场"',
    date: '2026年1月16日',
    guests: '叶兆言（作家）、卢海鸣（南京学研究会会长）、白亚丽（红山森林动物园副园长）、杨志疆（东南大学副教授）、杨民仆（《长江岸边说六朝》作者）',
    description: '围绕南京文学、城市、建筑、生态展开对谈，探讨文学之都的当代价值；对话内容将制作成播客',
    link: 'https://www.yzwb.net/news/yysp/202601/t20260116_312002.html',
    image: '/materials/shalong/往期沙龙1.png'
  },
  {
    id: 2,
    title: '可一书店｜席地《第六次回归花园》诗集分享会',
    date: '2025年3月9日',
    guests: '席地（澳门诗人）、黄梵、育邦、孙冬（诗人/学者）',
    description: '探讨诗集创作脉络、诗意栖居与哲学思辨，解读"回归花园"的生命原乡主题',
    link: 'https://www.iesdouyin.com/share/video/7480126309994138939',
    image: '/materials/shalong/往期沙龙2.png'
  },
  {
    id: 3,
    title: '大众书局广州路店｜《旧时燕：文学之都的传奇》品读会',
    date: '2025年12月27日',
    guests: '徐正龙（南师大副教授）',
    description: '解读程章灿"南京三书"之《旧时燕》，以二十四篇散文拆解南京文学典故与城市文脉',
    link: 'https://m.sohu.com/a/968340343_121124807/',
    image: '/materials/shalong/往期沙龙3.png'
  },
  {
    id: 4,
    title: '南京古籍书店｜旧书新知·阅美文都',
    date: '2025年4月25日',
    guests: '薛冰（学者）、徐雁（南大教授）、卢海鸣（南京学研究会会长）、王星（凤凰新华南京分公司副总）',
    description: '分享旧书收藏故事，解读太平南路古籍书店百年历史，探讨旧书与城市文脉传承',
    link: 'http://m.toutiao.com/group/7497555664168927753/',
    image: '/materials/shalong/往期沙龙4.png'
  }
]

// 自动轮播函数
const startCarousel = () => {
  carouselTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % pastSalons.length
  }, 5000) // 每5秒切换一次
}

// 组件挂载时启动轮播
onMounted(() => {
  startCarousel()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
  }
})
</script>

<style scoped>
.shalong-past-page {
  width: 100vw;
  height: 100vh;
  background-color: #faf5e6;
  position: relative;
  background-image: url('/materials/shalong/资源 2@4x.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden; /* 隐藏滚动栏 */
  display: flex;
  flex-direction: column;
}

/* 导航栏固定 */
.shalong-past-page :deep(.index-top-nav) {
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
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1000;
}

.back-button-image {
  width: 40px;
  height: 40px;
  transition: transform 0.3s ease;
}

.back-button:hover .back-button-image {
  transform: scale(1.1);
}

/* 装饰图片1 - 右上方 */
.decoration-image-1 {
  position: absolute;
  top: 130px;
  right: 2%;
  width: 15%;
  max-width: 200px;
  z-index: 10;
}

/* 装饰图片2 - 右下方 */
.decoration-image-2 {
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 40%;
  max-width: 1000px;
  z-index: 0.8;
}

.page-title {
  text-align: center;
  padding: 40px 0 20px;
}

.page-title h1 {
  font-size: 2.5rem;
  color: #8B4513;
  margin: 0;
  font-weight: bold;
}

/* 轮播图容器 */
.carousel-container {
  position: relative;
  width: 80%;
  max-width: 1000px;
  margin: 40px auto 150px;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex: 1;
}

/* 轮播图轨道 */
.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

/* 禁用过渡效果 */
.carousel-track.no-transition {
  transition: none;
}

/* 轮播图项 */
.carousel-item {
  min-width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
}

.salon-image {
  width: 100%;
  height: 45%;
  object-fit: cover;
}

/* 图片3的特殊样式 */
.salon-image-3 {
  object-position: center top;
}

.salon-content {
  padding: 30px;
  background: white;
  height: 25%;
}

/* 沙龙头部布局 */
.salon-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.salon-content h3 {
  color: #8B4513;
  font-size: 1.5rem;
  margin: 0;
  flex: 1;
  margin-right: 20px;
}

.salon-date {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 10px 0;
}

.salon-guests {
  color: #8B4513;
  font-size: 0.95rem;
  margin: 0 0 15px 0;
  font-weight: 500;
}

.salon-description {
  color: #333;
  line-height: 1.6;
  margin: 0 0 20px 0;
  /* font-size: 0.95rem; */
}

.salon-link {
  padding: 8px 16px;
  background-color: #8B4513;
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.salon-link:hover {
  background-color: #A0522D;
}

/* 导航指示器 */
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(139, 69, 19, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background-color: #8B4513;
  transform: scale(1.2);
}

/* 底部装饰图片 */
.page-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(100vh * 0.3);
  overflow: hidden;
  z-index: 1;
}

.footer-image {
  position: absolute;
  bottom: -9.5%;
  left: -0.3%;
  width: 101vw;
  height: auto;
  transform: scale(1.01);
  transform-origin: bottom center;
  z-index: 5;
  display: block;
  margin: 0;
  padding: 0;
  max-width: none;
  object-fit: cover;
  opacity: 0.8;
}
</style>
