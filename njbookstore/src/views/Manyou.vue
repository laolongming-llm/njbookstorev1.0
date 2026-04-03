<template>
  <div class="manyou-page">
    <AppTopNav />

    <section
      class="manyou-stage"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointercancel="resetPointer"
      @pointerleave="resetPointer"
    >
      <div class="manyou-ambient"></div>
      <img :src="BOOK_ASSETS.title" alt="" class="manyou-title-art" />
      <img :src="BOOK_ASSETS.rightDisc" alt="" class="manyou-disc-right" />
      <img :src="BOOK_ASSETS.rightTree" alt="" class="manyou-tree-right" />

      <div
        class="book-wrap"
        :class="[
          isFlipping ? 'is-flipping' : '',
          flipDirection === 'next' ? 'is-flipping-next' : '',
          flipDirection === 'prev' ? 'is-flipping-prev' : ''
        ]"
      >
        <img :src="BOOK_ASSETS.bookBase" alt="" class="book-base" />

        <div class="page-art-layer">
          <div class="page-shell page-shell-left">
            <img :src="BOOK_ASSETS.leftPage" alt="" class="page-art-img page-art-left" />
          </div>
          <div class="page-shell page-shell-right">
            <img :src="BOOK_ASSETS.rightPage" alt="" class="page-art-img page-art-right" />
          </div>
        </div>

        <div class="spread-content">
          <article class="content-page content-page-left">
            <div class="photo-grid" :class="`count-${currentStore.images.length}`">
              <div
                v-for="(image, index) in currentStore.images"
                :key="`${currentStore.id}-${index}`"
                class="store-photo-frame"
              >
                <img
                  :src="image"
                  :alt="`${currentStore.name} 图${index + 1}`"
                  loading="lazy"
                  class="store-photo"
                />
              </div>
            </div>
          </article>

          <article class="content-page content-page-right">
            <header class="store-header">
              <p class="store-kicker">南京实体旧书店</p>
              <h1 class="store-title">{{ currentStore.name }}</h1>
              <p class="store-founded">创立时间：{{ currentStore.founded }}</p>
            </header>
            <p class="store-desc">{{ currentStore.description }}</p>
          </article>
        </div>

        <div class="flip-sheet" aria-hidden="true"></div>
      </div>

      <footer class="manyou-controls">
        <button type="button" class="page-btn" :disabled="!canPrev || isFlipping" @click="goPrev">
          上一页
        </button>
        <p class="page-indicator">{{ pageIndicator }}</p>
        <button type="button" class="page-btn" :disabled="!canNext || isFlipping" @click="goNext">
          下一页
        </button>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppTopNav from '../components/common/AppTopNav.vue'
import { MANYOU_BOOKSTORES } from '../data/manyouBookstores.js'

const BOOK_ASSETS = {
  bookBase: '/materials/xunimanyou/bcg.png',
  leftPage: '/materials/xunimanyou/page-left.png',
  rightPage: '/materials/xunimanyou/page-right.png',
  title: '/materials/xunimanyou/title.png',
  rightDisc: '/materials/xunimanyou/zhuanpan right.png',
  rightTree: '/materials/xunimanyou/tree-right.png'
}

const FLIP_SWAP_MS = 360
const FLIP_TOTAL_MS = 920

const currentIndex = ref(0)
const isFlipping = ref(false)
const flipDirection = ref('')
const pointerStartX = ref(null)

const currentStore = computed(() => MANYOU_BOOKSTORES[currentIndex.value] ?? MANYOU_BOOKSTORES[0])
const canPrev = computed(() => currentIndex.value > 0)
const canNext = computed(() => currentIndex.value < MANYOU_BOOKSTORES.length - 1)
const pageIndicator = computed(() => {
  const current = String(currentIndex.value + 1).padStart(2, '0')
  const total = String(MANYOU_BOOKSTORES.length).padStart(2, '0')
  return `${current} / ${total}`
})

function flipTo(targetIndex, direction) {
  if (isFlipping.value || targetIndex === currentIndex.value) return

  isFlipping.value = true
  flipDirection.value = direction

  window.setTimeout(() => {
    currentIndex.value = targetIndex
  }, FLIP_SWAP_MS)

  window.setTimeout(() => {
    isFlipping.value = false
    flipDirection.value = ''
  }, FLIP_TOTAL_MS)
}

function goPrev() {
  if (!canPrev.value) return
  flipTo(currentIndex.value - 1, 'prev')
}

function goNext() {
  if (!canNext.value) return
  flipTo(currentIndex.value + 1, 'next')
}

function onKeyDown(event) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goPrev()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    goNext()
  }
}

function onPointerDown(event) {
  pointerStartX.value = event.clientX
}

function onPointerUp(event) {
  if (pointerStartX.value == null) return
  const deltaX = event.clientX - pointerStartX.value
  pointerStartX.value = null

  if (Math.abs(deltaX) < 56) return
  if (deltaX > 0) {
    goPrev()
  } else {
    goNext()
  }
}

function resetPointer() {
  pointerStartX.value = null
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.manyou-page {
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.manyou-stage {
  min-height: 0;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  padding: clamp(18px, 3.2vh, 34px) clamp(10px, 1.2vw, 20px) clamp(14px, 2vh, 22px);
  overflow: hidden;
  background-image: url('/materials/xunimanyou/bcg-bottom.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.manyou-ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 50% 46%, rgba(82, 54, 21, 0.18), transparent 48%),
    linear-gradient(180deg, rgba(255, 247, 228, 0.12) 0%, rgba(123, 79, 34, 0.06) 100%);
}

.manyou-title-art {
  position: absolute;
  top: 60px;
  left: 45px;
  width: clamp(156px, 18vw, 328px);
  max-width: 34%;
  height: auto;
  z-index: 5;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 8px 14px rgba(53, 30, 10, 0.22));
  transform: scale(1.3);
}

.manyou-disc-right {
  position: absolute;
  right: -8.6%;
  bottom: -9%;
  width: min(38vw, 620px);
  height: auto;
  transform: scale(0.92);
  transform-origin: right bottom;
  z-index: 1;
  opacity: 0.95;
  pointer-events: none;
  filter: drop-shadow(0 18px 28px rgba(64, 37, 13, 0.22));
}

.manyou-tree-right {
  position: absolute;
  right: -0.8%;
  top: 18%;
  width: min(24vw, 380px);
  height: auto;
  transform: scale(1);
  transform-origin: right bottom;
  z-index: 4;
  opacity: 1;
  pointer-events: none;
  filter: contrast(1.12) saturate(1.06) drop-shadow(0 10px 16px rgba(73, 45, 22, 0.3));
}

.book-wrap {
  --seam-x: 50%;
  --seam-gap: 2.8%;
  --page-top: 7.12%;
  --page-height: 84.92%;
  --page-width: 41.85%;
  --left-x: calc(var(--seam-x) - var(--seam-gap) / 2 - var(--page-width));
  --right-x: calc(var(--seam-x) + var(--seam-gap) / 2);
  --content-inset-x: 8.2%;
  --content-inset-top: 8.1%;
  --content-inset-bottom: 9.4%;
  position: relative;
  width: min(70vw, 980px);
  aspect-ratio: 3369 / 2382;
  flex: 0 1 auto;
  isolation: isolate;
  z-index: 3;
}

.book-wrap::before {
  content: '';
  position: absolute;
  inset: 1.6%;
  z-index: 1;
  border-radius: 28px;
  border: 1px solid rgba(246, 223, 186, 0.52);
  background: linear-gradient(
    140deg,
    rgba(253, 241, 219, 0.15) 0%,
    rgba(215, 177, 120, 0.06) 45%,
    rgba(116, 73, 32, 0.12) 100%
  );
  box-shadow:
    0 10px 26px rgba(56, 34, 13, 0.26),
    inset 0 1px 0 rgba(255, 248, 235, 0.42);
  pointer-events: none;
}

.book-base {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 14px 26px rgba(56, 33, 11, 0.24));
}

.page-art-layer {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.page-shell {
  position: absolute;
  top: var(--page-top);
  width: var(--page-width);
  height: var(--page-height);
  overflow: hidden;
  pointer-events: none;
}

.page-shell-left {
  left: var(--left-x);
}

.page-shell-right {
  left: var(--right-x);
}

.page-art-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}

.page-art-left {
  /* Fine-tune left page art to visually align with right page height */
  transform: translateY(-0.9%) scaleY(1.018);
}

.spread-content {
  position: absolute;
  inset: 0;
  z-index: 3;
  transform-style: preserve-3d;
}

.content-page {
  position: absolute;
  top: calc(var(--page-top) + var(--content-inset-top));
  height: calc(var(--page-height) - var(--content-inset-top) - var(--content-inset-bottom));
  padding: clamp(9px, 1vw, 16px);
  overflow: hidden;
}

.content-page-left {
  left: calc(var(--left-x) + 5.2%);
  width: calc(var(--page-width) - 10.4%);
  transform-origin: right center;
}

.content-page-right {
  left: calc(var(--right-x) + var(--content-inset-x));
  width: calc(var(--page-width) - var(--content-inset-x) * 2);
  display: grid;
  grid-template-rows: auto 1fr;
  gap: clamp(8px, 1vw, 14px);
  transform-origin: left center;
}

.photo-grid {
  width: 100%;
  height: 100%;
  display: grid;
  gap: clamp(6px, 0.82vw, 10px);
  align-content: stretch;
}

.photo-grid.count-1 {
  grid-template-columns: 1fr;
  grid-template-rows: minmax(0, 1fr);
}

.photo-grid.count-2 {
  grid-template-columns: 1fr;
  grid-template-rows: repeat(2, minmax(0, 1fr));
}

.photo-grid.count-3 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(0, 1.35fr) minmax(0, 1fr);
}

.photo-grid.count-3 .store-photo-frame:first-child {
  grid-column: 1 / span 2;
}

.store-photo-frame {
  width: 100%;
  height: 100%;
  min-height: 0;
  aspect-ratio: auto;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(154, 116, 70, 0.28);
  box-shadow: 0 8px 16px rgba(57, 33, 10, 0.14);
  background: linear-gradient(180deg, rgba(252, 244, 229, 0.78), rgba(237, 224, 198, 0.58));
}

.store-photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.store-header {
  border-bottom: 1px solid rgba(112, 70, 31, 0.25);
  padding-bottom: clamp(5px, 0.7vw, 10px);
}

.store-kicker {
  margin: 0 0 2px;
  color: #7f613d;
  font-size: clamp(11px, 1vw, 15px);
  letter-spacing: 0.18em;
}

.store-title {
  margin: 0;
  color: #3d2613;
  font-size: clamp(20px, 2vw, 32px);
  line-height: 1.2;
}

.store-founded {
  margin: 6px 0 0;
  color: #68472b;
  font-size: clamp(12px, 1vw, 16px);
}

.store-desc {
  margin: 0;
  color: #462d19;
  font-size: clamp(13px, 1.05vw, 18px);
  line-height: 1.72;
  text-align: left;
}

.flip-sheet {
  position: absolute;
  top: var(--page-top);
  left: calc(var(--seam-x) + var(--seam-gap) / 2 - 0.2%);
  width: calc(var(--page-width) * 0.95);
  height: var(--page-height);
  transform-origin: left center;
  background:
    linear-gradient(90deg, rgba(87, 58, 28, 0.26), rgba(249, 241, 228, 0.08) 30%, transparent 68%),
    linear-gradient(180deg, rgba(255, 251, 243, 0.42), rgba(220, 191, 154, 0.1));
  opacity: 0;
  pointer-events: none;
  border-radius: 3px 14px 14px 3px;
  z-index: 4;
}

.book-wrap.is-flipping-next .spread-content {
  animation: flip-next-content 920ms cubic-bezier(0.2, 0.76, 0.24, 1);
}

.book-wrap.is-flipping-prev .spread-content {
  animation: flip-prev-content 920ms cubic-bezier(0.2, 0.76, 0.24, 1);
}

.book-wrap.is-flipping-next .flip-sheet {
  animation: flip-next-sheet 920ms cubic-bezier(0.2, 0.76, 0.24, 1);
}

.book-wrap.is-flipping-prev .flip-sheet {
  left: auto;
  right: calc(var(--seam-x) + var(--seam-gap) / 2 - 0.2%);
  transform-origin: right center;
  animation: flip-prev-sheet 920ms cubic-bezier(0.2, 0.76, 0.24, 1);
}

.book-wrap.is-flipping-next .content-page-right {
  animation: right-page-turn 920ms cubic-bezier(0.2, 0.76, 0.24, 1);
}

.book-wrap.is-flipping-prev .content-page-left {
  animation: left-page-turn 920ms cubic-bezier(0.2, 0.76, 0.24, 1);
}

.manyou-controls {
  z-index: 6;
  margin-top: auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 1.2vw, 16px);
  padding-top: clamp(6px, 1vh, 12px);
}

.page-btn {
  min-width: 104px;
  padding: 9px 16px;
  border-radius: 999px;
  color: #f6ecdb;
  background: linear-gradient(180deg, #8f5e31 0%, #724421 100%);
  border: 1px solid rgba(231, 195, 146, 0.5);
  cursor: pointer;
  box-shadow: 0 8px 14px rgba(78, 45, 16, 0.24);
  transition: transform 0.16s ease, filter 0.16s ease;
}

.page-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.07);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-indicator {
  margin: 0;
  min-width: 86px;
  text-align: center;
  color: #4e3219;
  font-size: clamp(14px, 1.3vw, 20px);
  font-weight: 700;
  letter-spacing: 0.08em;
}

@keyframes flip-next-content {
  0% {
    transform: perspective(1900px) rotateY(0deg) translateZ(0);
    filter: brightness(1);
  }
  40% {
    transform: perspective(1900px) rotateY(-10deg) translateZ(6px);
    filter: brightness(0.9);
  }
  100% {
    transform: perspective(1900px) rotateY(0deg) translateZ(0);
    filter: brightness(1);
  }
}

@keyframes flip-prev-content {
  0% {
    transform: perspective(1900px) rotateY(0deg) translateZ(0);
    filter: brightness(1);
  }
  40% {
    transform: perspective(1900px) rotateY(10deg) translateZ(6px);
    filter: brightness(0.9);
  }
  100% {
    transform: perspective(1900px) rotateY(0deg) translateZ(0);
    filter: brightness(1);
  }
}

@keyframes flip-next-sheet {
  0% {
    opacity: 0;
    transform: perspective(1700px) rotateY(0deg);
  }
  14% {
    opacity: 0.56;
  }
  55% {
    opacity: 0.78;
    transform: perspective(1700px) rotateY(-82deg);
  }
  100% {
    opacity: 0;
    transform: perspective(1700px) rotateY(-132deg);
  }
}

@keyframes flip-prev-sheet {
  0% {
    opacity: 0;
    transform: perspective(1700px) rotateY(0deg);
  }
  14% {
    opacity: 0.56;
  }
  55% {
    opacity: 0.78;
    transform: perspective(1700px) rotateY(82deg);
  }
  100% {
    opacity: 0;
    transform: perspective(1700px) rotateY(132deg);
  }
}

@keyframes right-page-turn {
  0% {
    transform: perspective(1800px) rotateY(0deg);
  }
  45% {
    transform: perspective(1800px) rotateY(-26deg);
  }
  100% {
    transform: perspective(1800px) rotateY(0deg);
  }
}

@keyframes left-page-turn {
  0% {
    transform: perspective(1800px) rotateY(0deg);
  }
  45% {
    transform: perspective(1800px) rotateY(26deg);
  }
  100% {
    transform: perspective(1800px) rotateY(0deg);
  }
}

@media (max-width: 980px) {
  .manyou-disc-right {
    right: -15%;
    bottom: -10%;
    width: min(56vw, 520px);
    transform: scale(0.82);
  }

  .manyou-tree-right {
    right: -2.8%;
    bottom: 33%;
    width: min(34vw, 330px);
    transform: scale(0.95);
  }

  .book-wrap {
    width: min(80vw, 860px);
  }
}

@media (max-width: 760px) {
  .manyou-stage {
    padding: 10px 8px 12px;
  }

  .manyou-title-art {
    top: 8px;
    left: 8px;
    width: clamp(124px, 34vw, 210px);
    max-width: 46%;
  }

  .manyou-disc-right {
    right: -24%;
    bottom: -11%;
    width: min(72vw, 480px);
    transform: scale(0.75);
    opacity: 0.9;
  }

  .manyou-tree-right {
    right: -1.2%;
    bottom: 14%;
    width: min(42vw, 220px);
    transform: scale(0.92);
    opacity: 0.96;
  }

  .book-wrap {
    width: min(120vw, 760px);
  }

  .content-page {
    padding: 7px;
  }

  .store-kicker {
    font-size: 10px;
  }

  .store-founded {
    margin-top: 4px;
    font-size: 11px;
  }

  .store-desc {
    font-size: 11px;
    line-height: 1.52;
  }

  .store-photo-frame {
    border-radius: 10px;
  }

  .page-btn {
    min-width: 88px;
    padding: 7px 12px;
    font-size: 13px;
  }

  .page-indicator {
    min-width: 72px;
    font-size: 14px;
  }
}
</style>
