<template>
  <main class="shalong-page">
    <!-- 顶部导航 -->
    <IndexTopNav />
    
    <!-- 资源2图片背景层 -->
    <img 
      :src="'/materials/shalong/资源 2@4x.png'" 
      alt="背景图片" 
      class="background-image"
      @error="handleImageError"
    />
    
    <!-- 资源7图片底部覆盖层 -->
    <img 
      :src="'/materials/shalong/资源 7@4x.png'" 
      alt="底部覆盖图片" 
      class="bottom-image"
      @error="handleImageError"
    />
    
    <!-- 图片容器 -->
    <div class="images-container">
      <!-- 左侧图片容器 -->
      <div class="left-image-container">
        <!-- 背景图片 -->
        <img 
          :src="'/materials/shalong/资源 6@4x.png'" 
          alt="左侧图片" 
          class="left-image"
          @error="handleImageError"
        />
        <!-- 上方覆盖图片 -->
        <img 
          :src="'/materials/shalong/资源 5@4x.png'" 
          alt="左侧覆盖图片" 
          class="top-overlay-image left-top-overlay"
          @error="handleImageError"
        />
        <!-- 标题层（覆盖在资源5图片上） -->
        <div class="title-layer left-title">
          <h3>往期沙龙</h3>
        </div>
        <!-- 内容层（显示在下方） -->
        <div class="content-layer">
          <img 
            :src="'/materials/shalong/往期沙龙5.png'" 
            alt="往期沙龙图片" 
            class="card-image"
            @error="handleImageError"
          />
          <p>回顾精彩的沙龙活动，感受文学的魅力与智慧的碰撞。</p>
          <button class="detail-button left-button" @click="goToPast">了解详情</button>
        </div>
      </div>
      
      <!-- 中央图片容器 -->
      <div class="center-image-container">
        <!-- 背景图片 -->
        <img 
          :src="'/materials/shalong/资源 4@4x.png'" 
          alt="中央图片" 
          class="center-image"
          @error="handleImageError"
        />
        <!-- 左侧覆盖图片 -->
        <img 
          :src="'/materials/shalong/资源 3.1@4x.png'" 
          alt="左侧覆盖图片" 
          class="overlay-image-left"
          @error="handleImageError"
        />
        <!-- 中间覆盖图片 -->
        <img 
          :src="'/materials/shalong/近期预告.png'" 
          alt="中间覆盖图片" 
          class="overlay-image-center"
          @error="handleImageError"
        />
        <!-- 右侧覆盖图片 -->
        <img 
          :src="'/materials/shalong/资源 3.2@4x.png'" 
          alt="右侧覆盖图片" 
          class="overlay-image-right"
          @error="handleImageError"
        />
        <!-- 上方覆盖图片 -->
        <img 
          :src="'/materials/shalong/资源 5@4x.png'" 
          alt="中央上方覆盖图片" 
          class="top-overlay-image center-top-overlay"
          @error="handleImageError"
        />
        <!-- 标题层（覆盖在资源5图片上） -->
        <div class="title-layer">
          <h3>近期预告</h3>
        </div>
        <!-- 内容层（显示在下方） -->
        <div class="content-layer">
          <p>探索精彩活动，预约文化盛宴。</p>
          <button class="detail-button" @click="goToFuture">了解详情</button>
        </div>
      </div>
      
      <!-- 右侧图片容器 -->
      <div class="right-image-container">
        <!-- 背景图片 -->
        <img 
          :src="'/materials/shalong/资源 6@4x.png'" 
          alt="右侧图片" 
          class="right-image"
          @error="handleImageError"
        />
        <!-- 上方覆盖图片 -->
        <img 
          :src="'/materials/shalong/资源 5@4x.png'" 
          alt="右侧覆盖图片" 
          class="top-overlay-image right-top-overlay"
          @error="handleImageError"
        />
        <!-- 标题层（覆盖在资源5图片上） -->
        <div class="title-layer right-title">
          <h3>共创心愿</h3>
        </div>
        <!-- 内容层（显示在下方） -->
        <div class="content-layer">
          <img 
            :src="'/materials/shalong/共创心愿.png'" 
            alt="共创心愿图片" 
            class="card-image"
            @error="handleImageError"
          />
          <p>分享您的想法与心愿，参与文化沙龙的共创活动。</p>
          <button class="detail-button right-button" @click="goToWish">了解详情</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ASSETS } from '../constants/indexAssets.js'
import IndexTopNav from '../components/common/AppTopNav.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 跳转到往期沙龙页面
const goToPast = () => {
  router.push('/shalong/past')
}

// 跳转到近期预告页面
const goToFuture = () => {
  router.push('/shalong/future')
}

// 跳转到共创心愿页面
const goToWish = () => {
  router.push('/shalong/wish')
}

// 沙龙互动页面图片路径数组
const shalongImages = [
  '/materials/shalong/资源 2@4x.png',
  '/materials/shalong/资源 3.1@4x.png',
  '/materials/shalong/资源 3.2@4x.png',
  '/materials/shalong/近期预告.png',
  '/materials/shalong/资源 4@4x.png',
  '/materials/shalong/资源 5@4x.png',
  '/materials/shalong/资源 6@4x.png',
  '/materials/shalong/资源 7@4x.png',
  '/materials/shalong/资源 8@4x.png'
]

// 占位符图片（当图片加载失败时使用）
const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2ZmZiIgLz48cGF0aCBkPSJNMTUwIDUwIEwxNTAgMTUwIiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdGF0ZSIgLz48cGF0aCBkPSJNMTUwIDUwIEwxNTAgMTUwIiBzdHJva2U9IiNkZGQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdGF0ZSIgLz48L3N2Zz4='

// 处理图片加载失败
const handleImageError = (event) => {
  event.target.src = placeholderImage
}
</script>

<style scoped>
/* 页面 */
.shalong-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #faf5e6;
  position: relative;
}

/* 全局禁止滚动 */
body, html {
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* 资源2背景图片 */
.background-image {
  position: absolute;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100% - 80px);
  z-index: 1;
  object-fit: cover;
}

/* 资源7底部覆盖图片 */
.bottom-image {
  position: absolute;
  bottom: -2.05%;
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

/* 图片容器 */
.images-container {
  position: absolute;
  top: 55.5%;
  left: 0;
  right: 0;
  transform: translateY(-50%) translateX(clamp(5px, 3vw, 8px));
  display: flex;
  justify-content: space-between;
  padding: 0 clamp(80px, 5vw, 120px);
  z-index: 10;
}

/* 左侧图片容器 */
.left-image-container {
  position: relative;
  height: clamp(20vh, 58vh, 120vh);
}

/* 左侧图片样式 */
.left-image {
  width: clamp(160px, 20vw, 255px);
  height: 100%;
}

/* 中央图片容器 */
.center-image-container {
  position: relative;
  height: clamp(20vh, 58vh, 120vh);
}

/* 中央图片样式 */
.center-image {
  width: auto;
  height: 100%;
}

/* 左侧覆盖图片样式 */
.overlay-image-left {
  position: absolute;
  top: 48%;
  left: 15px;
  transform: translateY(-50%);
  width: 20%;
  height: 90%;
  z-index: 15;
}

/* 中间覆盖图片样式 */
.overlay-image-center {
  position: absolute;
  top: 48%;
  left: 2%;
  transform: translateY(-50%);
  width: 94%;
  height: 90%;
  opacity: 0.5;
  z-index: 10;
  border-radius: 20px;
}

/* 右侧覆盖图片样式 */
.overlay-image-right {
  position: absolute;
  top: 48%;
  right: 28px;
  transform: translateY(-50%);
  width: 20%;
  height: 90%;
  z-index: 10;
}

/* 右侧图片容器 */
.right-image-container {
  position: relative;
  height: clamp(20vh, 58vh, 120vh);
}

/* 右侧图片样式 */
.right-image {
  width: clamp(160px, 20vw, 255px);
  height: 100%;
}

/* 顶部覆盖图片基础样式 */
.top-overlay-image {
  position: absolute;
  top: -17%;
  height: clamp(5vh, 40vh, 40vh);
}

/* 左侧顶部覆盖图片 */
.left-top-overlay {
  left: 48.4%;
  transform: translateX(-50%);
  width: clamp(120px, 20vw, 196px);
}

/* 中央顶部覆盖图片 */
.center-top-overlay {
  left: 50%;
  transform: translateX(-50%);
  width: clamp(200px, 25vw, 300px);
}

/* 右侧顶部覆盖图片 */
.right-top-overlay {
  left: 48.4%;
  transform: translateX(-50%);
  width: clamp(120px, 20vw, 196px);
}

/* 标题层样式（覆盖在资源5图片上） */
.title-layer {
  position: absolute;
  top: -14%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 20;
  width: 100%;
}

.title-layer h3 {
  color: #8B4513;
  font-size: clamp(1.2rem, 2vw, 1.8rem);
  margin: 0;
  font-weight: bold;
}

/* 左侧标题调整 */
.left-title {
  transform: translateX(-51.5%);
}

/* 右侧标题调整 */
.right-title {
  transform: translateX(-51.5%);
}

/* 内容层样式（显示在下方） */
.content-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 20;
  padding: 0;
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 中央卡片内容层向下移动 */
.center-image-container .content-layer {
  top: 110%;
}

/* 卡片内部图片样式 */
.card-image {
  width: 91%;
  transform: translateX(-2.5%) translateY(-45px);
  min-height: 70%;
  max-height: 80%;
  object-fit: cover;
  margin-bottom: 15px;
  border-radius: 20px 20px 0 0;
  opacity: 0.8;
}

/* 文字内容区域 */
.content-layer p {
  color: #333;
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  line-height: 1.5;
  margin: -25px 0 25px 0;
  padding: 0 20px;
  min-height: 18%;
  max-height: 40%;
  z-index: 25;
  position: relative;
}

/* 中央卡片文字向下移动 */
.center-image-container .content-layer p {
  margin-top: 20px;
  margin-bottom: -10px;
}

/* 详情按钮样式 */
.detail-button {
  background: #8B4513;
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  cursor: pointer;
  transition: all 0.3s ease;
  transform: translateY(-10px);
  z-index: 25;
}

.detail-button:hover {
  background: #A0522D;
  transform: translateY(-12px);
}

/* 左侧按钮样式 */
.left-button {
  transform: translateY(-10px) translateX(-5px);
}

.left-button:hover {
  transform: translateY(-12px) translateX(-10px);
}

/* 中央按钮样式 */
.center-image-container .detail-button {
  transform: translateY(-20px);
}

.center-image-container .detail-button:hover {
  transform: translateY(-12px);
}

/* 右侧按钮样式 */
.right-button {
  transform: translateY(-10px) translateX(-1.5px);
}

.right-button:hover {
  transform: translateY(-12px) translateX(10px);
}
</style>