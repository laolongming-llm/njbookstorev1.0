<template>
  <main class="shalong-future-page">
    <!-- 顶部导航 -->
    <IndexTopNav />
    
    <!-- 返回按钮 -->
    <button class="back-button" @click="goBack">
      <img src="/materials/shalong/返回键.png" alt="返回" class="back-button-image" />
    </button>
    
    <!-- 装饰图片 -->
    <img src="/materials/shalong/装饰图4.png" alt="装饰图4" class="decoration-image-4" />
    <img src="/materials/shalong/装饰图5.png" alt="装饰图5" class="decoration-image-5" />
    
    <!-- 近期活动列表 -->
    <div class="future-events-list">
      <!-- 活动项 -->
      <a 
        v-for="event in futureEvents" 
        :key="event.id"
        :href="event.link"
        target="_blank"
        rel="noopener noreferrer"
        class="future-event-item"
        :class="{ 'event-luxun': event.id === 2 }"
      >
        <div class="event-image-container">
          <img :src="event.image" :alt="event.title" class="event-image" />
          <div class="image-overlay">
            <span class="view-details">查看详情</span>
          </div>
        </div>
        <div class="event-content">
          <h3>{{ event.title }}</h3>
          <div class="event-info">
            <span class="event-date">{{ event.date }}</span>
            <span class="event-time">{{ event.time }}</span>
            <span class="event-location">{{ event.location }}</span>
          </div>
          <p class="event-description">{{ event.description }}</p>
          <button class="register-button">预约报名</button>
        </div>
      </a>
    </div>
    
    <!-- 底部装饰图片 -->
    <div class="page-footer">
      <img src="/materials/shalong/资源 7@4x.png" alt="底部装饰" class="footer-image" />
    </div>
  </main>
</template>

<script setup>
import IndexTopNav from '../components/common/AppTopNav.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回沙龙互动共创页面
const goBack = () => {
  router.push('/shalong')
}

// 近期活动数据
const futureEvents = [
  {
    id: 1,
    title: '舌尖上的时间旅行',
    date: '2026年3月22日',
    time: '15:00',
    location: '先锋书店五台山店（江苏省南京市鼓楼区广州路173号）',
    description: '历史科普博主浪花姜将带领读者从被算法和效率主导的现代生活中抽离，穿越回一山一水一菩提的古代时空，看古人如何张罗一餐饭、斟酌一杯酒、捱过一个寒夜，用一个个鲜活的历史切面，还原他们热气腾腾的烟火人间。',
    image: '/materials/shalong/舌尖上的时间旅行.png',
    link: 'https://m.weibo.cn/detail/5278162851465506'
  },
  {
    id: 2,
    title: '鲁迅与民国大师',
    date: '2026年3月21日',
    time: '15:00',
    location: '朴阅书店鲁迅书屋（南京市鼓楼区中山北路346号老学堂创意园）',
    description: '著名学者、南大教授沈卫威做客，解读鲁迅与民国学人群体关系，探讨民国学术思想脉络；讲座后由沈老师带领参观江南水师学堂旧址。',
    image: '/materials/shalong/鲁迅与民国大师.png',
    link: 'https://m.sohu.com/a/998263481_120271802/'
  }
]
</script>

<style scoped>
.shalong-future-page {
  width: 100vw;
  height: 100vh;
  background-color: #faf5e6;
  position: relative;
  background-image: url('/materials/shalong/资源 2@4x.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden; /* 隐藏滚动条 */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 导航栏固定 */
.shalong-future-page :deep(.index-top-nav) {
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

/* 装饰图片4 - 中间位置 */
.decoration-image-4 {
  position: absolute;
  top: 52.5%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-height: 550px;
  max-width: 1700px;
  z-index: 1;
  border-radius: 20px;
}

/* 装饰图片5 - 右上方 */
.decoration-image-5 {
  position: absolute;
  top: 100px;
  right: 5%;
  width: 15%;
  max-width: 200px;
  z-index: 1;
}

.future-events-list {
  position: absolute;
  top: 25%;
  left: 3%;
  right: 3%;
  bottom: 15%;
  padding: 0 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 15px;
  overflow-y: auto;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  z-index: 2;
}

/* 隐藏滚动条 */
.future-events-list::-webkit-scrollbar {
  display: none;
}

.future-event-item {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
  max-height: 500px;
}

.future-event-item:nth-child(1) { animation-delay: 0.1s; }
.future-event-item:nth-child(2) { animation-delay: 0.2s; }
.future-event-item:nth-child(3) { animation-delay: 0.3s; }
.future-event-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.future-event-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(139, 69, 19, 0.2);
}

.event-image-container {
  position: relative;
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 25vh; /* 调整图片高度 */
  object-fit: cover;
  transition: transform 0.6s ease;
}

.future-event-item:hover .event-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(transparent 60%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.future-event-item:hover .image-overlay {
  opacity: 1;
}

.view-details {
  background: rgba(255, 255, 255, 0.9);
  color: #8B4513;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.future-event-item:hover .view-details {
  transform: translateY(0);
}

.event-content {
  padding: 5px 25px;
}

.event-content h3 {
  color: #8B4513;
  font-size: 1.8rem;
  margin: 15px 0 15px 0;
  line-height: 1.3;
  transition: color 0.3s ease;
  text-align: center;
}

.future-event-item:hover .event-content h3 {
  color: #A0522D;
}

.event-info {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 0 0 10px 0;
  justify-content: center;
}

.event-info span {
  color: #666;
  font-size: 0.9rem;
  background: #f5f5f5;
  padding: 6px 14px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.future-event-item:hover .event-info span {
  background: #f0e6d2;
  color: #8B4513;
}

.event-description {
  color: #333;
  line-height: 1.6;
  margin: 15px 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
  height: 15vh; /* 调整文字高度 */
}

.register-button {
  background: #8B4513;
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  display: block;
  margin: 0 auto 15px;
}

.register-button:hover {
  background: #A0522D;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.3);
}

/* 鲁迅与民国大师活动的特殊样式 */
.event-luxun .event-description {
  margin-top: 40px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .future-events-list {
    padding: 30px 60px 60px;
    gap: 40px;
  }
  
  .event-content h3 {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .future-events-list {
    padding: 30px 20px 40px;
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .event-image {
    height: 300px;
  }
  
  .event-content {
    padding: 5px 20px;
  }
  
  .event-content h3 {
    font-size: 1.4rem;
  }
  
  .event-description {
    font-size: 0.95rem;
  }
  
  .register-button {
    padding: 10px 24px;
    font-size: 0.9rem;
  }
}

/* 底部装饰图片 */
.page-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 150px;
  overflow: hidden;
  z-index: 1;
}

.footer-image {
  position: absolute;
  bottom: -12.66%;
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

@media (max-width: 1200px) {
  .future-events-list {
    top: 25%;
    left: 3%;
    right: 3%;
    bottom: 25%;
    padding: 0 30px;
    gap: 25px;
  }
  
  .event-content h3 {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .future-events-list {
    top: 30%;
    left: 2%;
    right: 2%;
    bottom: 30%;
    padding: 0 20px;
    grid-template-columns: 1fr;
    gap: 25px;
  }
  
  .event-image {
    height: 20vh;
  }
  
  .event-content {
    padding: 5px 20px;
  }
  
  .event-content h3 {
    font-size: 1.4rem;
  }
  
  .event-description {
    font-size: 0.95rem;
  }
  
  .register-button {
    padding: 10px 24px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .future-events-list {
    top: 35%;
    left: 1%;
    right: 1%;
    bottom: 35%;
    padding: 0 16px;
  }
  
  .event-image {
    height: 15vh;
  }
  
  .event-content {
    padding: 5px 16px;
  }
  
  .event-content h3 {
    font-size: 1.2rem;
  }
  
  .event-info {
    gap: 10px;
  }
  
  .event-info span {
    font-size: 0.8rem;
    padding: 4px 10px;
  }
  
  .event-description {
    font-size: 0.9rem;
    -webkit-line-clamp: 4;
  }
}
</style>
