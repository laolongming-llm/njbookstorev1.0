<template>
  <section class="carousel-section">
    <div class="carousel-container">
      <!-- 山水底图 -->
      <img :src="ASSETS.carouselBg" alt="" class="carousel-bg" />

      <!-- 左侧圆盘 -->
      <img :src="ASSETS.carouselDiscLeft" alt="" class="disc disc-left" />

      <!-- 右侧圆盘 -->
      <img :src="ASSETS.carouselDiscRight" alt="" class="disc disc-right" />

      <!-- 祥云装饰 -->
      <img :src="ASSETS.carouselCloud" alt="" class="decor decor-cloud" />

      <!-- 燕子装饰 -->
      <img :src="ASSETS.carouselSwallow" alt="" class="decor decor-swallow" />

      <!-- 标题条 -->
      <div class="carousel-header">
        <div class="header-bar-wrap">
          <img :src="ASSETS.carouselHeaderBar" alt="" class="header-bar-img" />
          <span class="header-bar-text">{{ carouselTitle }}</span>
        </div>
      </div>

      <!-- 三图轮播区域 -->
      <div
        class="carousel-stage"
        @mouseenter="pause"
        @mouseleave="resume"
      >
        <!-- 左侧小图（上一张） -->
        <div class="slot slot-left" @click="retreat">
          <div class="slot-frame">
            <img
              :src="prevImage.src"
              :key="'prev-' + prevImage.id"
              :alt="prevImage.folder"
              class="slot-img"
            />
          </div>
        </div>

        <!-- 中间大图（当前） -->
        <div class="slot slot-center">
          <div class="slot-frame">
            <img
              :src="currentImage.src"
              :key="'cur-' + currentImage.id"
              :alt="currentImage.folder"
              class="slot-img"
            />
          </div>
        </div>

        <!-- 右侧小图（下一张） -->
        <div class="slot slot-right" @click="advance">
          <div class="slot-frame">
            <img
              :src="nextImage.src"
              :key="'next-' + nextImage.id"
              :alt="nextImage.folder"
              class="slot-img"
            />
          </div>
        </div>
      </div>

      <!-- 分页：滑动窗口圆点 + 计数器 -->
      <div class="carousel-dots-wrap">
        <div class="carousel-dots">
          <button
            v-for="dot in visibleDots"
            :key="dot.index"
            class="dot"
            :class="{ active: dot.active, 'dot-hidden': dot.hidden }"
            :style="{ transform: `scale(${dot.scale})`, opacity: dot.opacity }"
            @click="!dot.hidden && goTo(dot.index)"
          ></button>
        </div>
        <span class="dot-counter">{{ currentIndex + 1 }} / {{ total }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { ASSETS } from '../../constants/indexAssets.js'
import { CAROUSEL_CONFIG } from '../../constants/indexPageConfig.js'
import { useIndexCarousel } from '../../composables/useIndexCarousel.js'

const carouselTitle = CAROUSEL_CONFIG.title

const {
  currentIndex,
  prevImage,
  currentImage,
  nextImage,
  dots,
  total,
  advance,
  retreat,
  goTo,
  pause,
  resume
} = useIndexCarousel()

/* 滑动窗口：所有 dot 始终保留在 DOM，窗口外的收缩为 width:0，
   全靠 CSS transition 过渡，保证丝滑无跳跃 */
const WINDOW_SIZE = 7

const visibleDots = computed(() => {
  const all = dots.value
  const n = all.length

  const half = Math.floor(WINDOW_SIZE / 2)
  let start = n <= WINDOW_SIZE ? 0 : Math.max(0, currentIndex.value - half)
  let end   = n <= WINDOW_SIZE ? n : start + WINDOW_SIZE
  if (end > n) { end = n; start = Math.max(0, end - WINDOW_SIZE) }

  return all.map(d => {
    const inWindow = d.index >= start && d.index < end
    if (!inWindow) {
      return { ...d, scale: 0.4, opacity: 0, hidden: true }
    }
    const dist = Math.abs(d.index - currentIndex.value)
    return {
      ...d,
      scale:   [1, 0.82, 0.66, 0.52][Math.min(dist, 3)],
      opacity: [1, 0.85, 0.65, 0.45][Math.min(dist, 3)],
      hidden: false
    }
  })
})
</script>

<style scoped>
.carousel-section {
  width: 100%;
  position: relative;
  overflow: hidden;
  margin-top: -4%;
  z-index: 1;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  aspect-ratio: 6510 / 4192;
  overflow: hidden;
}

.carousel-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  z-index: 1;
}

/* Carousel 顶部从纸色渐入，与 Hero 底部渐隐衔接 */
.carousel-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10%;
  background: linear-gradient(to bottom, rgba(242, 236, 220, 0.72), transparent);
  z-index: 8;
  pointer-events: none;
}

/* ---- 圆盘装饰 ---- */
.disc {
  position: absolute;
  z-index: 2;
  pointer-events: none;
}

.disc-left {
  height: 70%;
  width: auto;
  left: -15%;
  top: -13.5%;
}

.disc-right {
  height: 44%;
  width: auto;
  right: -8%;
  bottom: -5.8%;
}

/* ---- 装饰元素 ---- */
.decor {
  position: absolute;
  z-index: 6;
  pointer-events: none;
}

.decor-cloud {
  left: 10%;
  top: 4%;
  width: 14%;
  opacity: 0.75;
}

.decor-swallow {
  right: 8%;
  top: 5%;
  left: auto;
  width: 8%;
  opacity: 0.9;
}

/* ---- 标题条 ---- */
.carousel-header {
  position: absolute;
  top: 11%;
  left: -2%;
  width: 100%;
  z-index: 7;
  display: flex;
  padding-right: 8%;
  padding-left: 8%;
}

.header-bar-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: clamp(400px, 28vw, 560px);
  aspect-ratio: 5530 / 700;
  margin: 0 auto;
}

.header-bar-img {
  grid-area: 1 / 1;
  display: block;
  width: 100%;
  height: 45px;
  transform: scaleY(1.8);
  transform-origin: center;
  border-radius: 9px;
}

.header-bar-text {
  grid-area: 1 / 1;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  z-index: 2;
  pointer-events: none;
  color: #f7f0e3;
  font-size: clamp(20px, 1.8vw, 40px);
  font-weight: 700;
  letter-spacing: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.22);
  transform: translateY(-10%);
  margin: 0 40px;
}

/* ---- 三图轮播舞台 ---- */
.carousel-stage {
  position: absolute;
  z-index: 4;
  top: 14%;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 72%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5%;
}

/* ---- 通用槽位 ---- */
.slot {
  flex-shrink: 0;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========================================
   牌匾式异形边框（仿 frame-plaque）
   --cut 控制八边形切角大小，与 padding 保持一致。
   层次：
     slot-frame       → 八边形切角 + 宣纸渐变底板 + drop-shadow
     slot-frame::before → inset 4px，亮宣纸内衬（框架可见区域）
     slot-frame::after  → inset 10px，内侧金线（压框）
     slot-img           → z-index:1，照片本体，clip-path:inherit 同步切角
   ======================================== */
.slot-frame {
  --cut: 12px;
  width: 100%;
  height: 100%;
  position: relative;
  display: block;
  overflow: visible;          /* 让 drop-shadow 可以溢出显示 */
  box-sizing: border-box;
  padding: var(--cut);

  background: linear-gradient(180deg, #d9b87a, #b8893c);

  clip-path: polygon(
    var(--cut) 0,
    calc(100% - var(--cut)) 0,
    100% var(--cut),
    100% calc(100% - var(--cut)),
    calc(100% - var(--cut)) 100%,
    var(--cut) 100%,
    0 calc(100% - var(--cut)),
    0 var(--cut)
  );

  filter: drop-shadow(0 6px 10px rgba(73, 50, 27, 0.18));
}

/* 内衬亮纸色，填充切角框架可见区域 */
.slot-frame::before {
  content: '';
  position: absolute;
  inset: 4px;
  background: #ede0c4;
  clip-path: inherit;
}

/* 内侧细金线压框 */
.slot-frame::after {
  content: '';
  position: absolute;
  inset: 10px;
  clip-path: inherit;
  box-shadow: inset 0 0 0 1px rgba(157, 122, 77, 0.5);
  pointer-events: none;
}

/* 照片：z-index:1 浮在 ::before 上，clip-path:inherit 同步切角 */
.slot-img {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;  /* 稍偏上裁切，兼顾人像脸部与构图 */
  clip-path: inherit;
  transition: transform 0.5s ease;
}

/* ---- 中间大图 ---- */
.slot-center {
  width: 48%;
  aspect-ratio: 4 / 3;
  z-index: 3;
}

/* ---- 左侧小图（上一张） ---- */
.slot-left {
  width: 28%;
  aspect-ratio: 4 / 3;
  z-index: 1;
  opacity: 0.75;
  cursor: pointer;
}

.slot-left:hover {
  opacity: 0.9;
}

.slot-left:hover .slot-img {
  transform: scale(1.03);
}

/* ---- 右侧小图（下一张） ---- */
.slot-right {
  width: 28%;
  aspect-ratio: 4 / 3;
  z-index: 1;
  opacity: 0.75;
  cursor: pointer;
}

.slot-right:hover {
  opacity: 0.9;
}

.slot-right:hover .slot-img {
  transform: scale(1.03);
}

/* ---- 分页区域 ---- */
.carousel-dots-wrap {
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.carousel-dots {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-counter {
  font-size: clamp(10px, 0.78vw, 14px);
  color: rgba(255, 248, 220, 0.80);
  letter-spacing: 0.12em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  user-select: none;
}

.dot {
  flex-shrink: 0;
  width: 12px;
  height: 12px;
  margin: 0 5px;
  border-radius: 50%;
  background: rgba(255, 250, 235, 0.55);
  border: 2px solid rgba(180, 160, 120, 0.5);
  transition:
    width    0.38s cubic-bezier(0.4, 0, 0.2, 1),
    margin   0.38s cubic-bezier(0.4, 0, 0.2, 1),
    opacity  0.38s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.38s cubic-bezier(0.4, 0, 0.2, 1),
    background 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

/* 窗口外的 dot：宽度和间距全部收缩为 0 */
.dot.dot-hidden {
  width: 0;
  margin: 0;
  border-width: 0;
  pointer-events: none;
}

.dot.active {
  background: #c9a96e;
  border-color: #a07c3a;
  box-shadow: 0 0 8px rgba(201, 169, 110, 0.6);
}

.dot:hover:not(.active):not(.dot-hidden) {
  background: rgba(255, 250, 235, 0.85);
  border-color: rgba(180, 160, 120, 0.7);
}
</style>
