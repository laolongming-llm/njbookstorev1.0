<template>
  <nav class="top-nav">
    <div class="nav-bar">
      <img :src="ASSETS.topNavFrame" alt="" class="nav-bg" />
      <div class="nav-overlay">
        <router-link to="/" class="nav-logo-area" title="返回首页" aria-label="返回首页" />
        <router-link
          v-for="mod in NAV_MODULES"
          :key="mod.id"
          :to="mod.route"
          class="nav-item"
          :style="navItemStyle(mod.hotspot)"
        >
          <span class="nav-item-text">{{ mod.title }}</span>
        </router-link>
        <button
          class="login-btn"
          :style="loginBtnStyle(LOGIN_HOTSPOT)"
          title="登录/注册"
          @click="handleLogin"
        >
          <img :src="ASSETS.loginIcon" alt="登录" class="login-icon" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ASSETS } from '../../constants/indexAssets.js'
import { NAV_MODULES, LOGIN_HOTSPOT } from '../../constants/indexPageConfig.js'

function navItemStyle(hotspot) {
  if (!hotspot) return {}
  return {
    left: `${hotspot.centerX}%`,
    top: `${hotspot.centerY}%`,
    width: `${hotspot.width}%`,
    backgroundImage: `url(${ASSETS.navItemBg})`
  }
}

function loginBtnStyle(hotspot) {
  if (!hotspot) return {}
  return {
    left: `${hotspot.centerX}%`,
    top: `${hotspot.centerY}%`
  }
}

function handleLogin() {
  console.log('[Nav] login clicked')
}
</script>

<style scoped>
.top-nav {
  width: 100%;
  position: relative;
  z-index: 100;
}
.nav-bar {
  position: relative;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  aspect-ratio: 7916 / 519;
  overflow: hidden;
}
.nav-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  pointer-events: none;
}
.nav-overlay {
  position: absolute;
  inset: 0;
}
.nav-logo-area {
  position: absolute;
  left: 0;
  top: 0;
  width: 38%;
  height: 100%;
  cursor: pointer;
}
.nav-logo-area:hover {
  background: radial-gradient(ellipse 60% 80% at 30% 50%, rgba(255, 245, 210, 0.08) 0%, transparent 100%);
}
.nav-item {
  position: absolute;
  transform: translate(-50%, -50%) scale(var(--nav-scale, 1));
  transform-origin: center center;
  aspect-ratio: 1157 / 321;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  border-radius: 6px;
  overflow: hidden;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.22s ease, filter 0.22s ease;
  filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.15));
  box-shadow: 8px 8px 16px -4px rgba(0, 0, 0, 0.6);
}
.nav-item:hover {
  --nav-scale: 1.04;
  filter: brightness(1.07) drop-shadow(3px 5px 8px rgba(0, 0, 0, 0.2));
}
.nav-item-text {
  display: block;
  line-height: 1;
  color: #f7f0e3;
  font-size: clamp(13px, 1.35vw, 29px);
  font-weight: 700;
  letter-spacing: 0.12em;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);
  user-select: none;
}
.login-btn {
  position: absolute;
  transform: translate(-50%, -50%) scale(var(--login-scale, 1));
  transform-origin: center center;
  height: 51%;
  width: auto;
  aspect-ratio: 1 / 1;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: transform 0.22s ease, filter 0.22s ease;
}
.login-btn:hover {
  --login-scale: 1.06;
  filter: brightness(1.08);
}
.login-icon {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
