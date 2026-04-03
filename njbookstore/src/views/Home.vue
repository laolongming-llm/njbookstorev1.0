<template>
  <main class="home-page">
    <IndexTopNav />
    <IndexHero />
    <IndexCarousel />

    <!-- 底部卷轴远山收尾 + 叠加页尾信息 -->
    <div class="bottom-scroll-wrap">
      <img :src="ASSETS.bottomScroll" alt="卷轴收尾" class="bottom-scroll-img" />

      <!-- 叠加在 bottom.png 上方的页尾信息 -->
      <div class="bottom-overlay">
        <div class="bottom-info">
          <p class="bottom-title">金陵文枢 · 书坊寻踪</p>
          <div class="bottom-divider"></div>
          <p class="bottom-sub">南京实体书店时空巡礼 &emsp;&emsp; 南京作家群主题网页</p>
          <p class="bottom-quote">书页翻动处，亦是城的回声。</p>
          <p class="bottom-copy">© 2026 &nbsp;All Rights Reserved</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ASSETS } from '../constants/indexAssets.js'
import IndexTopNav from '../components/common/AppTopNav.vue'
import IndexHero from '../components/index/IndexHero.vue'
import IndexCarousel from '../components/index/IndexCarousel.vue'
</script>

<style scoped>
.home-page {
  width: 100%;
  overflow-x: hidden;
}

/* ---- 底部卷轴区 ---- */
.bottom-scroll-wrap {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  position: relative;
  margin-top: -12%;
  overflow: hidden;
}

.bottom-scroll-img {
  display: block;
  width: 100%;
  height: auto;
}

/* 叠在 bottom.png 上，绝对定位，垂直居中偏上，避开山水远景 */
.bottom-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 95%;      /* 仅覆盖图片上半段，远山留在下方 */
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* ---- 页尾信息内容 ---- */
.bottom-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(6px, 0.9vw, 14px);
  text-align: center;
  padding: clamp(16px, 2.5vw, 40px) clamp(24px, 4vw, 80px);
  /* 半透明纸感底色，与卷轴融合 */
  background: radial-gradient(
    ellipse 70% 80% at center,
    rgba(245, 238, 218, 0.55) 0%,
    transparent 100%
  );
  border-radius: 50%;
}

.bottom-title {
  font-size: clamp(16px, 1.8vw, 34px);
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #3d2b10;
  text-shadow: 0 1px 4px rgba(255, 245, 220, 0.6);
  margin: 0;
}

.bottom-divider {
  width: clamp(50px, 7vw, 120px);
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(100, 72, 30, 0.4), transparent);
}

.bottom-sub {
  font-size: clamp(11px, 1vw, 18px);
  color: #6b5030;
  letter-spacing: 0.08em;
  margin: 0;
}

.bottom-quote {
  font-size: clamp(11px, 0.9vw, 16px);
  color: #8a7050;
  font-style: italic;
  letter-spacing: 0.14em;
  margin: 0;
}

.bottom-copy {
  font-size: clamp(10px, 0.75vw, 13px);
  color: #a8905a;
  letter-spacing: 0.06em;
  margin: 0;
}
</style>
