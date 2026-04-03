<template>
  <div class="shuyuan-page">
    <AppTopNav />

    <section class="shuyuan-stage">
      <div class="shuyuan-canvas">
        <img :src="A.bgBottom" alt="" class="layer bg-bottom" />
        <img :src="A.bgTop" alt="" class="layer bg-top" />
        <img :src="A.rightArt" alt="" class="layer right-art" />
        <img :src="A.leftArt" alt="" class="layer left-art" />
        <img :src="A.decoration" alt="" class="layer decoration-art" />

        <div class="shuyuan-content-shell">
          <div class="shuyuan-content-inner">
            <header class="panel-header">
              <h1 class="panel-title">作家书缘</h1>
            </header>

            <div v-if="loading" class="panel-state">正在加载作家资料...</div>

            <div v-else-if="error" class="panel-state panel-state-error">
              <p>{{ error }}</p>
              <button type="button" class="retry-btn" @click="loadData">重新加载</button>
            </div>

            <template v-else-if="activeWriter">
              <nav class="writer-switcher" aria-label="作家切换">
                <button
                  v-for="writer in writers"
                  :key="writer.id"
                  type="button"
                  class="writer-btn"
                  :class="{ 'is-active': writer.id === activeWriterId }"
                  @click="selectWriter(writer.id)"
                >
                  {{ writer.name }}
                </button>
              </nav>

              <h2 class="writer-name">{{ activeWriter.name }}</h2>

              <nav class="section-tabs" aria-label="模块切换">
                <button
                  v-for="tab in sectionTabs"
                  :key="tab.key"
                  type="button"
                  class="section-tab"
                  :class="{ 'is-active': tab.key === activeSectionKey }"
                  @click="selectSection(tab.key)"
                >
                  <span>{{ tab.label }}</span>
                </button>
              </nav>

              <section
                ref="sectionPanelRef"
                :key="`panel-${activeWriter.id}-${activeSectionKey}`"
                class="section-panel"
              >
                <header class="section-header">
                  <h3>{{ activeSection.name }}</h3>
                </header>

                <div v-if="activeSection.flowItems.length && !isTextOnlySection" class="content-stream">
                  <article
                    v-for="(item, idx) in activeSection.flowItems"
                    :key="`${item.kind}-${item.payload.id}-${idx}`"
                    class="stream-item"
                    :class="`is-${item.kind}`"
                  >
                    <template v-if="item.kind === 'paragraph'">
                      <p class="stream-paragraph">{{ item.payload.text }}</p>
                    </template>

                    <template v-else>
                      <button type="button" class="stream-image-btn" @click="openLightbox(item.payload)">
                        <div class="stream-image-frame" :class="`is-${item.payload.aspectClass}`">
                          <img
                            :src="item.payload.webPath"
                            :alt="`${activeWriter.name}${item.payload.displayCode}`"
                            loading="lazy"
                          />
                        </div>
                      </button>
                      <p class="stream-caption">
                        <span>{{ item.payload.captionText || '（无图注）' }}</span>
                      </p>
                    </template>
                  </article>
                </div>
                <article v-else-if="activeSection.paragraphs.length" class="text-only-content">
                  <p
                    v-for="paragraph in activeSection.paragraphs"
                    :key="paragraph.id"
                    class="text-only-paragraph"
                  >
                    {{ paragraph.text }}
                  </p>
                </article>

                <p v-else class="panel-empty">当前模块暂无内容。</p>
              </section>
            </template>

            <div v-else class="panel-empty">暂无可用的作家数据。</div>
          </div>
        </div>
      </div>
    </section>

    <div v-if="lightboxVisible && lightboxCurrentImage" class="lightbox-overlay" @click.self="closeLightbox">
      <section class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="图片查看">
        <header class="lightbox-header">
          <p class="lightbox-title">
            图片
            <span>（{{ lightboxIndex + 1 }} / {{ lightboxImages.length }}）</span>
          </p>
          <button type="button" class="lightbox-close" aria-label="关闭图片查看" @click="closeLightbox">
            ×
          </button>
        </header>

        <div class="lightbox-body">
          <button
            type="button"
            class="lightbox-step"
            aria-label="上一张"
            :disabled="lightboxImages.length <= 1"
            @click="stepLightbox(-1)"
          >
            ‹
          </button>
          <div class="lightbox-image-wrap">
            <img
              :src="lightboxCurrentImage.webPath"
              :alt="`${activeWriter?.name || ''}${lightboxCurrentImage.displayCode}`"
            />
          </div>
          <button
            type="button"
            class="lightbox-step"
            aria-label="下一张"
            :disabled="lightboxImages.length <= 1"
            @click="stepLightbox(1)"
          >
            ›
          </button>
        </div>

        <p class="lightbox-caption">{{ lightboxCurrentImage.captionText || '（无图注）' }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppTopNav from '../components/common/AppTopNav.vue'
import { SHUYUAN_SECTION_META, useShuyuanData } from '../composables/useShuyuanData.js'

const A = {
  bgBottom: '/materials/zuojiashuyuan/bcg-bottom.png',
  bgTop: '/materials/zuojiashuyuan/bcg-top.png',
  rightArt: '/materials/zuojiashuyuan/right.png',
  leftArt: '/materials/zuojiashuyuan/left.png',
  decoration: '/materials/zuojiashuyuan/decoration.png'
}

const SECTION_KEYS = ['experience', 'works', 'activities']

const { loading, error, writers, loadData } = useShuyuanData()

const activeWriterId = ref('')
const activeSectionKey = ref('experience')
const sectionPanelRef = ref(null)

const lightboxVisible = ref(false)
const lightboxImages = ref([])
const lightboxIndex = ref(0)

const activeWriter = computed(() => {
  return writers.value.find((writer) => writer.id === activeWriterId.value) || null
})

const activeSection = computed(() => {
  if (!activeWriter.value) return null
  return activeWriter.value.sections[activeSectionKey.value] || null
})

const isTextOnlySection = computed(() => {
  return activeSection.value ? activeSection.value.imageCount === 0 : false
})

const sectionTabs = computed(() => {
  if (!activeWriter.value) return []
  return SECTION_KEYS.map((key) => {
    return {
      key,
      label: SHUYUAN_SECTION_META[key].label
    }
  })
})

const lightboxCurrentImage = computed(() => {
  return lightboxImages.value[lightboxIndex.value] || null
})

function selectWriter(writerId) {
  if (writerId === activeWriterId.value) return
  activeWriterId.value = writerId
}

function selectSection(sectionKey) {
  if (sectionKey === activeSectionKey.value) return
  activeSectionKey.value = sectionKey
}

function openLightbox(image) {
  if (!activeSection.value) return
  const images = activeSection.value.images
  const targetIndex = images.findIndex((item) => item.id === image.id)
  lightboxImages.value = images
  lightboxIndex.value = targetIndex >= 0 ? targetIndex : 0
  lightboxVisible.value = true
}

function closeLightbox() {
  lightboxVisible.value = false
}

function stepLightbox(step) {
  const total = lightboxImages.value.length
  if (!total) return
  lightboxIndex.value = (lightboxIndex.value + step + total) % total
}

function handleKeydown(event) {
  if (!lightboxVisible.value) return
  if (event.key === 'Escape') {
    closeLightbox()
    return
  }
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    stepLightbox(-1)
    return
  }
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    stepLightbox(1)
  }
}

watch(writers, (list) => {
  if (!list.length) {
    activeWriterId.value = ''
    return
  }
  if (!list.some((writer) => writer.id === activeWriterId.value)) {
    activeWriterId.value = list[0].id
  }
})

watch(activeWriterId, () => {
  activeSectionKey.value = 'experience'
  if (sectionPanelRef.value) {
    sectionPanelRef.value.scrollTop = 0
  }
})

watch(activeSectionKey, () => {
  if (sectionPanelRef.value) {
    sectionPanelRef.value.scrollTop = 0
  }
})

watch(lightboxVisible, (isVisible) => {
  document.body.style.overflow = isVisible ? 'hidden' : ''
})

onMounted(async () => {
  window.addEventListener('keydown', handleKeydown)
  await loadData()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.shuyuan-page {
  --paper-base: #efe5d0;
  --paper-warm: #f5eddb;
  --paper-soft: #fbf7ee;
  --paper-edge: rgba(118, 86, 47, 0.3);
  --ink-main: #4f3519;
  --ink-soft: #6b4b25;
  --wood-main: #8b6537;
  --wood-dark: #6e4a25;
  --wood-light: #aa8451;
  --line-soft: rgba(142, 107, 60, 0.24);
  --line-mid: rgba(126, 93, 49, 0.34);
  --line-strong: rgba(103, 72, 34, 0.52);
  --grain-a: rgba(106, 78, 43, 0.05);
  --grain-b: rgba(255, 248, 232, 0.24);
  --shadow-outer: 0 16px 38px rgba(70, 45, 19, 0.2);
  --shadow-inner: inset 0 1px 0 rgba(255, 253, 247, 0.84);
  --radius-xl: 18px;
  --radius-lg: 12px;
  --radius-md: 10px;
  --radius-sm: 8px;
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  background: #e8dcc6;
}

.shuyuan-stage {
  position: relative;
  min-height: 0;
  overflow: hidden;
}

.shuyuan-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  isolation: isolate;
  background: #e8dcc6;
}

.layer {
  position: absolute;
  display: block;
  pointer-events: none;
  user-select: none;
}

.bg-bottom,
.bg-top {
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-bottom {
  z-index: 0;
}

.bg-top {
  top: 13%;
  left: 50%;
  width: min(78%, 1320px);
  height: auto;
  aspect-ratio: 5801 / 4016;
  transform: translateX(-50%);
  z-index: 1;
  opacity: 0.5;
  mix-blend-mode: multiply;
  object-fit: contain;
}

.left-art {
  left: -1.4%;
  top: 0;
  width: min(24vw, 320px);
  height: auto;
  z-index: 1;
  filter: drop-shadow(0 12px 20px rgba(80, 53, 24, 0.18));
  transform: scale(1.015);
}

.right-art {
  right: -2.2%;
  top: -5%;
  width: min(24vw, 318px);
  height: auto;
  z-index: 1;
  filter: drop-shadow(0 10px 18px rgba(73, 48, 22, 0.16));
  transform: scale(0.85);
}

.decoration-art {
  left: 51.4%;
  bottom: -7%;
  width: 106%;
  transform: translateX(-50%);
  z-index: 0;
  filter: drop-shadow(0 10px 18px rgba(72, 47, 22, 0.2));
}

.shuyuan-content-shell {
  position: absolute;
  top: clamp(56px, 8vh, 90px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: min(1040px, 90vw);
  height: calc(100% - clamp(82px, 11vh, 130px));
}

.shuyuan-content-inner {
  position: relative;
  overflow: hidden;
  height: 100%;
  border-radius: var(--radius-xl);
  border: 1px solid var(--paper-edge);
  background:
    radial-gradient(circle at 14% 0%, rgba(255, 252, 245, 0.52), transparent 46%),
    radial-gradient(circle at 86% 92%, rgba(170, 133, 84, 0.1), transparent 42%),
    radial-gradient(circle at 52% 48%, rgba(255, 247, 228, 0.14), transparent 58%),
    repeating-linear-gradient(
      0deg,
      var(--grain-b) 0px,
      var(--grain-b) 1px,
      transparent 1px,
      transparent 3px
    ),
    linear-gradient(180deg, rgba(247, 239, 222, 0.69), rgba(238, 227, 201, 0.65)),
    repeating-linear-gradient(
      -22deg,
      var(--grain-a) 0px,
      var(--grain-a) 1px,
      transparent 1px,
      transparent 7px
    ),
    repeating-linear-gradient(
      34deg,
      rgba(120, 90, 52, 0.022) 0px,
      rgba(120, 90, 52, 0.022) 1px,
      transparent 1px,
      transparent 9px
    ),
    repeating-linear-gradient(
      88deg,
      rgba(255, 249, 235, 0.16) 0px,
      rgba(255, 249, 235, 0.16) 1px,
      transparent 1px,
      transparent 5px
    );
  box-shadow:
    var(--shadow-outer),
    var(--shadow-inner),
    inset 0 0 0 1px rgba(246, 233, 207, 0.64);
  -webkit-backdrop-filter: blur(10px) saturate(0.93) brightness(0.98);
  backdrop-filter: blur(10px) saturate(0.93) brightness(0.98);
  padding: clamp(13px, 2vw, 20px);
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.shuyuan-content-inner::before {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: calc(var(--radius-xl) - 2px);
  border: 1px solid rgba(255, 247, 228, 0.42);
  pointer-events: none;
}

.shuyuan-content-inner::after {
  content: '';
  position: absolute;
  left: 1px;
  right: 1px;
  top: 1px;
  height: 21%;
  border-radius: calc(var(--radius-xl) - 2px) calc(var(--radius-xl) - 2px) 0 0;
  background: linear-gradient(180deg, rgba(255, 250, 240, 0.28), rgba(255, 250, 240, 0));
  pointer-events: none;
}

.shuyuan-content-inner > * {
  position: relative;
  z-index: 1;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 0 2px 4px;
  border-bottom: 1px solid rgba(140, 105, 58, 0.2);
  position: relative;
  z-index: 1;
}

.panel-title {
  font-size: 1rem;
  color: var(--ink-main);
  letter-spacing: 0.11em;
  font-weight: 700;
}

.panel-state,
.panel-empty {
  min-height: 120px;
  display: grid;
  place-items: center;
  text-align: center;
  color: var(--ink-soft);
  border: 1px dashed rgba(131, 96, 51, 0.34);
  border-radius: var(--radius-lg);
  background: rgba(251, 246, 236, 0.72);
  padding: 16px;
  position: relative;
  z-index: 1;
}

.panel-state-error {
  gap: 12px;
}

.retry-btn {
  padding: 6px 14px;
  border-radius: 999px;
  color: #f8efd8;
  background: linear-gradient(180deg, #8d6839, #6c4a24);
  border: 1px solid rgba(95, 64, 31, 0.46);
  box-shadow: inset 0 1px 0 rgba(255, 241, 210, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease, filter 0.2s ease;
}

.retry-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

.writer-switcher {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  position: relative;
  z-index: 1;
}

.writer-btn {
  border-radius: 999px;
  padding: 9px 10px;
  background:
    linear-gradient(180deg, rgba(249, 241, 221, 0.92), rgba(236, 223, 196, 0.9));
  color: var(--ink-soft);
  border: 1px solid var(--line-mid);
  box-shadow:
    inset 0 1px 0 rgba(255, 247, 231, 0.86),
    0 1px 3px rgba(97, 67, 33, 0.08);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.writer-btn:hover {
  transform: translateY(-1px);
  background: linear-gradient(180deg, rgba(250, 243, 225, 0.95), rgba(238, 225, 199, 0.92));
  box-shadow:
    inset 0 1px 0 rgba(255, 247, 232, 0.9),
    0 4px 10px rgba(98, 67, 33, 0.12);
}

.writer-btn.is-active {
  color: #fff8eb;
  border-color: rgba(72, 44, 15, 0.72);
  background:
    linear-gradient(180deg, #9d7544, #764d27 52%, #5f3b19);
  box-shadow:
    inset 0 1px 0 rgba(255, 238, 198, 0.3),
    inset 0 -1px 0 rgba(51, 30, 12, 0.28),
    0 7px 14px rgba(78, 49, 20, 0.28);
  text-shadow: 0 1px 0 rgba(47, 26, 7, 0.35);
}

.writer-name {
  font-size: clamp(1.12rem, 2.3vw, 1.48rem);
  color: var(--ink-main);
  line-height: 1.15;
  margin-top: 1px;
  position: relative;
  z-index: 1;
  text-shadow: 0 1px 0 rgba(255, 246, 226, 0.25);
}

.chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 0.76rem;
  line-height: 1.25;
}

.chip-year {
  background: rgba(201, 170, 118, 0.22);
  color: #7a5629;
}

.chip-work {
  background: rgba(166, 138, 95, 0.15);
  color: #65431f;
}

.section-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  position: relative;
  z-index: 1;
}

.section-tab {
  border-radius: var(--radius-md);
  border: 1px solid var(--line-mid);
  background:
    linear-gradient(180deg, rgba(249, 241, 221, 0.9), rgba(237, 225, 197, 0.88));
  color: var(--ink-soft);
  padding: 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-weight: 500;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 248, 232, 0.82);
  transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
}

.section-tab:hover {
  transform: translateY(-1px);
  filter: brightness(1.02);
  box-shadow:
    inset 0 1px 0 rgba(255, 250, 236, 0.88),
    0 4px 10px rgba(90, 59, 27, 0.11);
}

.section-tab.is-active {
  color: #fff8eb;
  border-color: rgba(72, 44, 15, 0.72);
  background: linear-gradient(180deg, #967040, #6e4722 56%, #5a3817);
  box-shadow:
    inset 0 1px 0 rgba(255, 236, 196, 0.3),
    inset 0 -1px 0 rgba(50, 29, 11, 0.28),
    0 7px 14px rgba(79, 49, 20, 0.28);
  text-shadow: 0 1px 0 rgba(47, 26, 7, 0.35);
}

.section-panel {
  --image-frame-height: clamp(260px, 44vh, 410px);
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
  display: grid;
  gap: 12px;
  align-content: start;
  animation: panel-fade 0.24s ease;
  position: relative;
  z-index: 1;
}

.section-header {
  border-bottom: 1px solid rgba(136, 102, 54, 0.24);
  padding: 4px 2px 8px;
  display: flex;
  align-items: center;
}

.section-header h3 {
  font-size: 1.04rem;
  color: var(--ink-main);
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.content-stream {
  border-radius: var(--radius-md);
  border: 1px solid rgba(140, 105, 59, 0.25);
  background:
    linear-gradient(180deg, rgba(252, 248, 239, 0.86), rgba(247, 240, 225, 0.82));
  box-shadow:
    inset 0 1px 0 rgba(255, 252, 245, 0.84),
    inset 0 -1px 0 rgba(227, 210, 178, 0.45);
  padding: 12px;
  display: grid;
  gap: 10px;
}

.image-code {
  display: inline-block;
  margin-right: 6px;
  color: #8d6735;
  font-weight: 700;
}

.stream-item {
  border-radius: var(--radius-sm);
  border: 1px solid rgba(146, 111, 60, 0.22);
  background: rgba(255, 252, 245, 0.88);
  padding: 10px 11px;
  display: grid;
  gap: 8px;
}

.stream-item.is-paragraph {
  background: rgba(255, 252, 246, 0.72);
  border-color: rgba(150, 114, 63, 0.14);
  box-shadow: inset 3px 0 0 rgba(149, 110, 55, 0.2);
}

.stream-paragraph {
  color: #5b3d1f;
  font-size: 0.91rem;
  line-height: 1.92;
  letter-spacing: 0.01em;
}

.stream-image-btn {
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.stream-image-frame {
  width: 100%;
  height: var(--image-frame-height);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(145, 108, 57, 0.26);
  background:
    linear-gradient(180deg, rgba(246, 238, 223, 0.9), rgba(236, 226, 203, 0.86));
  box-shadow:
    inset 0 0 0 1px rgba(255, 249, 235, 0.84),
    inset 0 8px 18px rgba(194, 167, 123, 0.14);
  padding: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.stream-image-frame img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.stream-caption {
  color: #614223;
  font-size: 0.84rem;
  line-height: 1.5;
}

.text-only-content {
  border-radius: var(--radius-md);
  border: 1px solid rgba(140, 104, 58, 0.24);
  background:
    linear-gradient(180deg, rgba(252, 248, 239, 0.86), rgba(247, 240, 225, 0.82));
  box-shadow:
    inset 0 1px 0 rgba(255, 252, 245, 0.84),
    inset 0 -1px 0 rgba(227, 210, 178, 0.45);
  padding: 14px 14px 16px;
}

.text-only-paragraph {
  color: #5b3d1f;
  font-size: 0.92rem;
  line-height: 1.95;
  letter-spacing: 0.01em;
}

.text-only-paragraph + .text-only-paragraph {
  margin-top: 18px;
}

.section-panel::-webkit-scrollbar {
  width: 8px;
}

.section-panel::-webkit-scrollbar-thumb {
  background:
    linear-gradient(180deg, rgba(140, 104, 54, 0.62), rgba(112, 79, 40, 0.6));
  border: 1px solid rgba(250, 240, 214, 0.45);
  border-radius: 999px;
}

.section-panel::-webkit-scrollbar-track {
  background: rgba(244, 233, 211, 0.6);
  border-radius: 999px;
}

.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: grid;
  place-items: center;
  background: rgba(27, 18, 8, 0.74);
  padding: 22px;
}

.lightbox-dialog {
  width: min(1080px, 94vw);
  max-height: 92vh;
  border-radius: 16px;
  border: 1px solid rgba(172, 134, 84, 0.36);
  background:
    radial-gradient(circle at 14% 0%, rgba(255, 248, 230, 0.55), transparent 40%),
    linear-gradient(180deg, rgba(250, 242, 223, 0.98), rgba(244, 230, 199, 0.98));
  padding: 14px;
  display: grid;
  gap: 10px;
  box-shadow:
    0 18px 40px rgba(32, 20, 8, 0.34),
    inset 0 1px 0 rgba(255, 247, 228, 0.7);
}

.lightbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.lightbox-title {
  color: #5f3e1d;
  font-size: 0.92rem;
}

.lightbox-title span {
  color: #87643a;
}

.lightbox-close {
  color: #6d4a23;
  font-size: 1.7rem;
  line-height: 1;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease;
}

.lightbox-close:hover {
  transform: scale(1.06);
  color: #593615;
}

.lightbox-body {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
}

.lightbox-step {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  color: #f7efdc;
  border: 1px solid rgba(101, 70, 35, 0.5);
  background: linear-gradient(180deg, #8b6538, #694522);
  box-shadow:
    inset 0 1px 0 rgba(255, 234, 187, 0.22),
    0 4px 10px rgba(37, 23, 10, 0.2);
  cursor: pointer;
}

.lightbox-step:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lightbox-image-wrap {
  width: 100%;
  min-height: min(58vh, 420px);
  max-height: 66vh;
  border-radius: 12px;
  border: 1px solid rgba(149, 112, 62, 0.28);
  background:
    linear-gradient(180deg, rgba(245, 236, 220, 0.82), rgba(236, 224, 198, 0.78));
  box-shadow:
    inset 0 0 0 1px rgba(255, 247, 229, 0.78),
    inset 0 8px 20px rgba(194, 168, 123, 0.13);
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lightbox-image-wrap img {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: calc(66vh - 24px);
  object-fit: contain;
}

.lightbox-caption {
  color: #5d4022;
  font-size: 0.84rem;
  line-height: 1.5;
  min-height: 1.5em;
}

@keyframes panel-fade {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1200px) {
  .bg-top {
    top: 16%;
    width: min(82%, 980px);
  }

  .right-art {
    right: -5%;
    top: 20%;
    width: min(27vw, 300px);
  }

  .left-art {
    left: -4.5%;
    top: 18.5%;
    width: min(27vw, 300px);
  }
}

@media (max-width: 900px) {
  .shuyuan-content-shell {
    top: clamp(62px, 11vh, 95px);
    width: min(96vw, 880px);
    height: calc(100% - clamp(84px, 12vh, 130px));
  }

  .writer-switcher {
    display: flex;
    overflow-x: auto;
    gap: 8px;
    padding-bottom: 2px;
  }

  .writer-btn {
    flex: 0 0 auto;
    min-width: 76px;
  }

  .section-tabs {
    grid-template-columns: 1fr;
  }

  .section-tab {
    text-align: center;
  }
}

@media (max-width: 860px) {
  .bg-top {
    top: 18%;
    width: min(86%, 760px);
  }

  .right-art {
    top: 22%;
    right: -17%;
    width: min(32vw, 240px);
    opacity: 0.9;
  }

  .left-art {
    top: 20%;
    left: -12.5%;
    width: min(32vw, 238px);
    opacity: 0.92;
  }

  .decoration-art {
    width: 132%;
    bottom: -0.8%;
  }
}

@media (max-width: 640px) {
  .bg-top {
    top: 20%;
    width: 90%;
    opacity: 0.42;
  }

  .right-art {
    top: 26%;
    right: -24%;
    width: min(37vw, 190px);
    opacity: 0.84;
  }

  .left-art {
    top: 24%;
    left: -17%;
    width: min(37vw, 188px);
    opacity: 0.84;
  }

  .decoration-art {
    width: 164%;
    bottom: 1.5%;
  }

  .shuyuan-content-shell {
    top: 56px;
    width: 96vw;
    height: calc(100% - 68px);
  }

  .shuyuan-content-inner {
    border-radius: 14px;
    padding: 10px;
    box-shadow:
      0 5px 12px rgba(70, 45, 19, 0.1),
      inset 0 1px 0 rgba(255, 253, 247, 0.76),
      inset 0 0 0 1px rgba(246, 233, 207, 0.52);
  }

  .section-panel {
    --image-frame-height: clamp(220px, 38vh, 300px);
  }

  .lightbox-overlay {
    padding: 10px;
  }

  .lightbox-dialog {
    width: 100%;
    max-height: 96vh;
    padding: 10px;
    box-shadow:
      0 8px 18px rgba(32, 20, 8, 0.2),
      inset 0 1px 0 rgba(255, 247, 228, 0.62);
  }

  .lightbox-body {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .lightbox-step {
    width: 100%;
    border-radius: 8px;
    height: 30px;
  }
}
</style>
