import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { CAROUSEL_IMAGES } from '../constants/indexAssets.js'
import { CAROUSEL_CONFIG } from '../constants/indexPageConfig.js'

const TOTAL = CAROUSEL_IMAGES.length

export function useIndexCarousel() {
  const currentIndex = ref(0)
  const paused = ref(false)
  let timer = null

  function wrapIndex(i) {
    return ((i % TOTAL) + TOTAL) % TOTAL
  }

  function advance() {
    currentIndex.value = wrapIndex(currentIndex.value + 1)
  }

  function retreat() {
    currentIndex.value = wrapIndex(currentIndex.value - 1)
  }

  function goTo(index) {
    currentIndex.value = wrapIndex(index)
  }

  const prevImage = computed(() => CAROUSEL_IMAGES[wrapIndex(currentIndex.value - 1)])
  const currentImage = computed(() => CAROUSEL_IMAGES[currentIndex.value])
  const nextImage = computed(() => CAROUSEL_IMAGES[wrapIndex(currentIndex.value + 1)])

  const dots = computed(() =>
    CAROUSEL_IMAGES.map((_, i) => ({
      index: i,
      active: i === currentIndex.value
    }))
  )

  function startAutoPlay() {
    stopAutoPlay()
    timer = setInterval(() => {
      if (!paused.value) advance()
    }, CAROUSEL_CONFIG.intervalMs)
  }

  function stopAutoPlay() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function pause() { paused.value = true }
  function resume() { paused.value = false }

  onMounted(startAutoPlay)
  onBeforeUnmount(stopAutoPlay)

  return {
    currentIndex,
    prevImage,
    currentImage,
    nextImage,
    dots,
    total: TOTAL,
    advance,
    retreat,
    goTo,
    pause,
    resume
  }
}
