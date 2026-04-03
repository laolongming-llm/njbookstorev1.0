<template>
  <div class="shikong-page">
    <AppTopNav />

    <section class="shikong-stage">
      <div class="shikong-canvas">
        <img :src="A.bgBottom" alt="" class="layer bg-bottom" />
        <img :src="A.bgTop" alt="" class="layer bg-top" />

        <img :src="A.title" alt="时空寻踪" class="layer title-art" />

        <img :src="A.bgDecoration" alt="" class="layer decoration-art" />

        <div class="map-shell">
          <div ref="mapContainer" class="map-layer"></div>
          <div v-if="emptyHint" class="map-empty">{{ emptyHint }}</div>
        </div>

        <div class="plaques-wrap">
          <button
            v-for="plaque in plaques"
            :key="plaque.id"
            type="button"
            class="plaque-btn"
            :class="{ 'is-active': plaque.id === selectedPlaqueId }"
            :style="{ backgroundImage: `url(${A.item})` }"
            @click="selectedPlaqueId = plaque.id"
          >
            <span class="plaque-text">
              <span
                v-for="(char, index) in getLabelSlots(plaque.label)"
                :key="`${plaque.id}-${index}`"
                class="plaque-char"
              >
                {{ char }}
              </span>
            </span>
          </button>
        </div>

        <div class="intro-plaque-wrap">
          <button
            type="button"
            class="intro-plaque-btn"
            :style="{ backgroundImage: `url(${A.item})` }"
            :disabled="introLoading"
            @click="openWriterIntroPopup"
          >
            <span class="intro-plaque-text">
              {{ introLoading ? '简介加载中...' : '查看当前作家简介' }}
            </span>
          </button>
        </div>
      </div>
    </section>

    <div
      v-if="isIntroPopupVisible"
      class="shikong-intro-overlay"
      @click.self="closeWriterIntroPopup"
    >
      <section class="shikong-intro-dialog" role="dialog" aria-modal="true" :aria-label="`${currentWriterLabel}简介`">
        <header class="shikong-intro-header">
          <h3 class="shikong-popup-place shikong-intro-title">{{ currentWriterLabel }} · 简介</h3>
          <button
            type="button"
            class="shikong-intro-close"
            aria-label="关闭作家简介"
            @click="closeWriterIntroPopup"
          >
            ×
          </button>
        </header>

        <article class="shikong-popup shikong-intro-popup">

          <div class="shikong-popup-details shikong-intro-details">
            <img
              v-if="currentWriterIntroImage"
              class="shikong-popup-image shikong-intro-image"
              :src="currentWriterIntroImage"
              :alt="`${currentWriterLabel}照片`"
              loading="lazy"
            />
            <p v-if="introError" class="shikong-popup-desc shikong-intro-error">{{ introError }}</p>
            <template v-else>
              <p
                v-for="(paragraph, index) in currentWriterIntroParagraphs"
                :key="`${selectedPlaqueId}-${index}`"
                class="shikong-popup-desc shikong-intro-paragraph"
              >
                {{ paragraph }}
              </p>
              <p v-if="!currentWriterIntroParagraphs.length" class="shikong-popup-desc shikong-intro-paragraph">
                暂无作家简介。
              </p>
            </template>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import 'mapbox-gl/dist/mapbox-gl.css'

import AppTopNav from '../components/common/AppTopNav.vue'
import { SHIKONG_ASSETS as A, SHIKONG_PLAQUES } from '../constants/shikongAssets.js'

const MAPBOX_TOKEN = String(import.meta.env.VITE_MAPBOX_TOKEN || '').trim()
const DEFAULT_CENTER = [118.78, 32.04]
const DEFAULT_ZOOM = 11
const DATA_SOURCE_ID = 'shikong-points'
const DATA_LAYER_ID = 'shikong-point-layer'
const LABEL_LAYER_ID = 'shikong-label-layer'

const mapContainer = ref(null)
const selectedPlaqueId = ref('')
const plaques = ref([...SHIKONG_PLAQUES])
const emptyHint = ref('')
const isIntroPopupVisible = ref(false)
const introLoading = ref(false)
const introError = ref('')
const currentWriterIntroText = ref('')
const currentWriterIntroImage = ref('')

let map = null
let popup = null
let resizeHandler = null
let containerResizeObserver = null
let writerDataMap = {}
let pointLookup = new Map()
let introCache = new Map()

const WRITER_INTRO_ASSETS = {
  yezhaoyan: {
    image: '/materials/shikongxunzong/intro/yezhaoyan/yezhaoyan.jpg',
    introText: '/materials/shikongxunzong/intro/yezhaoyan/yzy_intro.txt'
  },
  handong: {
    image: '/materials/shikongxunzong/intro/handong/handong.jpg',
    introText: '/materials/shikongxunzong/intro/handong/hd_intro.txt'
  },
  zhuwen: {
    image: '/materials/shikongxunzong/intro/zhuwen/zhuwen.jpg',
    introText: '/materials/shikongxunzong/intro/zhuwen/zw_intro.txt'
  },
  luyang: {
    image: '/materials/shikongxunzong/intro/luyang/luyang.jpg',
    introText: '/materials/shikongxunzong/intro/luyang/ly_intro.txt'
  },
  sutong: {
    image: '/materials/shikongxunzong/intro/sutong/sutong.jpg',
    introText: '/materials/shikongxunzong/intro/sutong/st_intro.txt'
  }
}

const currentWriterLabel = computed(() => {
  const current = plaques.value.find((item) => item.id === selectedPlaqueId.value)
  return current?.label || '当前作家'
})

const currentWriterIntroParagraphs = computed(() => {
  return String(currentWriterIntroText.value || '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
})

function getLabelSlots(label) {
  const chars = [...label]
  if (chars.length === 2) return [chars[0], '', chars[1]]
  if (chars.length >= 3) return chars.slice(0, 3)
  return [chars[0] ?? '', '', '']
}

function fallbackPlaques() {
  plaques.value = [...SHIKONG_PLAQUES]
  selectedPlaqueId.value = SHIKONG_PLAQUES[0]?.id ?? ''
}

function safeSetPaint(layerId, property, value) {
  try {
    map.setPaintProperty(layerId, property, value)
  } catch {
    // ignore unsupported layer paint props
  }
}

function applyWarmTheme() {
  if (!map) return
  const layers = map.getStyle()?.layers || []

  layers.forEach((layer) => {
    const hint = `${layer.id} ${layer['source-layer'] || ''}`.toLowerCase()

    if (layer.type === 'background') {
      safeSetPaint(layer.id, 'background-color', '#efe4cf')
      return
    }

    if (layer.type === 'fill') {
      if (/(water|river|lake|ocean)/.test(hint)) {
        safeSetPaint(layer.id, 'fill-color', '#c4d3cf')
        safeSetPaint(layer.id, 'fill-opacity', 0.82)
        return
      }

      if (/(park|green|wood|landcover|grass)/.test(hint)) {
        safeSetPaint(layer.id, 'fill-color', '#d7d6b9')
        safeSetPaint(layer.id, 'fill-opacity', 0.64)
        return
      }

      safeSetPaint(layer.id, 'fill-color', '#eadfc9')
      safeSetPaint(layer.id, 'fill-outline-color', '#c7a577')
      safeSetPaint(layer.id, 'fill-opacity', 0.9)
      return
    }

    if (layer.type === 'line') {
      if (/(water|river|stream|canal)/.test(hint)) {
        safeSetPaint(layer.id, 'line-color', '#8eb3b2')
        safeSetPaint(layer.id, 'line-opacity', 0.78)
        return
      }

      if (/(road|street|path|bridge|tunnel)/.test(hint)) {
        safeSetPaint(layer.id, 'line-color', '#d5be98')
        safeSetPaint(layer.id, 'line-opacity', 0.88)
        return
      }

      safeSetPaint(layer.id, 'line-color', '#b98c5b')
      safeSetPaint(layer.id, 'line-opacity', 0.62)
      return
    }

    if (layer.type === 'fill-extrusion') {
      safeSetPaint(layer.id, 'fill-extrusion-color', '#d9c0a1')
      safeSetPaint(layer.id, 'fill-extrusion-opacity', 0.46)
      return
    }

    if (layer.type === 'symbol') {
      safeSetPaint(layer.id, 'text-color', '#5d4428')
      safeSetPaint(layer.id, 'text-halo-color', '#f8f0df')
      safeSetPaint(layer.id, 'text-halo-width', 1.2)
      safeSetPaint(layer.id, 'icon-color', '#8d663b')
    }
  })
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function normalizeIntroText(text) {
  return String(text || '')
    .replaceAll('\r\n', '\n')
    .replaceAll('\r', '\n')
    .trim()
}

function hasMojibake(value) {
  return /[ÃÂÅæäéöÜ]/.test(value)
}

function scoreReadableZh(value) {
  const hanCount = (value.match(/[\u4e00-\u9fff]/g) || []).length
  const replacementCount = (value.match(/\uFFFD/g) || []).length
  const mojibakePenalty = hasMojibake(value) ? 120 : 0
  return hanCount - replacementCount * 12 - mojibakePenalty
}

function decodeIntroBuffer(buffer) {
  const utf8Text = normalizeIntroText(new TextDecoder('utf-8').decode(buffer))
  if (!utf8Text) return ''

  const utf8HasReplacement = utf8Text.includes('\uFFFD')
  if (!utf8HasReplacement) {
    return utf8Text
  }

  let gbText = ''
  try {
    gbText = normalizeIntroText(new TextDecoder('gb18030').decode(buffer))
  } catch {
    gbText = ''
  }

  if (!gbText) return utf8Text
  return scoreReadableZh(gbText) >= scoreReadableZh(utf8Text) ? gbText : utf8Text
}

async function loadWriterIntro(writerId) {
  if (!writerId) return { image: '', text: '', error: '未识别当前作家。' }

  if (introCache.has(writerId)) {
    return introCache.get(writerId)
  }

  const asset = WRITER_INTRO_ASSETS[writerId]
  if (!asset) {
    const missing = { image: '', text: '', error: '当前作家暂无简介资料。' }
    introCache.set(writerId, missing)
    return missing
  }

  let text = ''
  let error = ''

  try {
    const response = await fetch(asset.introText, { cache: 'no-store' })
    if (!response.ok) {
      throw new Error(`intro fetch failed: ${response.status}`)
    }
    const buffer = await response.arrayBuffer()
    text = decodeIntroBuffer(buffer)
    if (!text) {
      error = '当前作家简介为空。'
    }
  } catch {
    error = '当前作家简介加载失败，请稍后重试。'
  }

  const result = { image: asset.image, text, error }
  introCache.set(writerId, result)
  return result
}

function closeWriterIntroPopup() {
  isIntroPopupVisible.value = false
}

function handleIntroEscClose(event) {
  if (event.key === 'Escape') {
    closeWriterIntroPopup()
  }
}

async function openWriterIntroPopup() {
  if (introLoading.value) return

  introLoading.value = true
  introError.value = ''

  const writerId = selectedPlaqueId.value
  const payload = await loadWriterIntro(writerId)

  currentWriterIntroImage.value = payload.image || ''
  currentWriterIntroText.value = payload.text || ''
  introError.value = payload.error || ''
  isIntroPopupVisible.value = true
  introLoading.value = false
}

function closePopup() {
  if (!popup) return
  popup.remove()
  popup = null
}

function relayoutPopup() {
  if (!popup || !map) return
  const lngLat = popup.getLngLat()
  popup.setLngLat(lngLat)
}

function applyPopupImageSizing(image, details) {
  if (!image) return

  const naturalW = image.naturalWidth || 0
  const naturalH = image.naturalHeight || 0
  if (!naturalW || !naturalH) return

  const host = details || image.parentElement
  if (!host) return

  const style = window.getComputedStyle(host)
  const paddingX = (Number.parseFloat(style.paddingLeft) || 0) + (Number.parseFloat(style.paddingRight) || 0)
  const hostWidth = host.clientWidth || 0
  const contentWidth = Math.max(hostWidth - paddingX, 0)
  if (!contentWidth) return

  const viewportH = window.innerHeight || 900
  const maxW = Math.min(contentWidth, 440)
  const maxH = Math.min(Math.max(viewportH * 0.46, 240), 360)
  const minW = 220
  const minH = 160

  const downScale = Math.min(maxW / naturalW, maxH / naturalH, 1)
  const upScale = Math.min(Math.max(minW / naturalW, minH / naturalH, 1), 1.2)
  const scale = downScale < 1 ? downScale : upScale

  image.style.width = `${Math.round(naturalW * scale)}px`
  image.style.height = `${Math.round(naturalH * scale)}px`
}

function resizeVisiblePopupImages() {
  if (!popup) return
  const root = popup.getElement?.()
  if (!root) return

  const openedPanels = root.querySelectorAll('.shikong-popup-details')
  openedPanels.forEach((panel) => {
    if (!(panel instanceof HTMLElement) || panel.style.display === 'none') return
    const image = panel.querySelector('.shikong-popup-image')
    if (image instanceof HTMLImageElement) {
      applyPopupImageSizing(image, panel)
    }
  })
}

function createPopupContent(point) {
  const root = document.createElement('div')
  root.className = 'shikong-popup'

  const place = document.createElement('h3')
  place.className = 'shikong-popup-place'
  place.textContent = point.placeName || '未知地点'
  root.appendChild(place)

  const list = document.createElement('div')
  list.className = 'shikong-popup-events'
  root.appendChild(list)

  let expandedIndex = null

  point.events.forEach((event, index) => {
    const item = document.createElement('article')
    item.className = 'shikong-popup-event'

    const trigger = document.createElement('button')
    trigger.type = 'button'
    trigger.className = 'shikong-popup-trigger'
    trigger.setAttribute('aria-expanded', 'false')
    trigger.innerHTML = `
      <span class="shikong-popup-trigger-title">${escapeHtml(event.title || '未命名事件')}</span>
      <span class="shikong-popup-trigger-icon">展开</span>
    `

    const details = document.createElement('div')
    details.className = 'shikong-popup-details'
    details.style.display = 'none'

    if (event.image) {
      const image = document.createElement('img')
      image.className = 'shikong-popup-image'
      image.src = event.image
      image.alt = event.title || '地点图片'
      image.loading = 'lazy'
      image.addEventListener('load', () => {
        applyPopupImageSizing(image, details)
        requestAnimationFrame(() => {
          relayoutPopup()
        })
      })
      details.appendChild(image)
    }

    if (event.timeText) {
      const time = document.createElement('p')
      time.className = 'shikong-popup-time'
      time.textContent = event.timeText
      details.appendChild(time)
    }

    const desc = document.createElement('p')
    desc.className = 'shikong-popup-desc'
    desc.textContent = event.description || '暂无事件说明'
    details.appendChild(desc)

    trigger.addEventListener('click', () => {
      expandedIndex = expandedIndex === index ? null : index
      const nodes = list.querySelectorAll('.shikong-popup-event')

      nodes.forEach((node, idx) => {
        const btn = node.querySelector('.shikong-popup-trigger')
        const panel = node.querySelector('.shikong-popup-details')
        const icon = node.querySelector('.shikong-popup-trigger-icon')
        const opened = idx === expandedIndex

        btn?.setAttribute('aria-expanded', opened ? 'true' : 'false')
        if (panel) panel.style.display = opened ? 'block' : 'none'
        if (icon) icon.textContent = opened ? '收起' : '展开'
        if (opened && panel) {
          const image = panel.querySelector('.shikong-popup-image')
          if (image) applyPopupImageSizing(image, panel)
        }
      })

      requestAnimationFrame(() => {
        relayoutPopup()
      })
    })

    item.appendChild(trigger)
    item.appendChild(details)
    list.appendChild(item)
  })

  return root
}

function toFeatureCollection(writerId) {
  pointLookup = new Map()
  const points = writerDataMap[writerId]?.points || []

  const features = points
    .filter((point) => Number.isFinite(point.lon) && Number.isFinite(point.lat))
    .map((point) => {
      let labelAnchor = 'top'

      if (point.placeName?.includes('《钟山》杂志社')) {
        labelAnchor = 'bottom'
      } else if (point.placeName?.includes('江苏文艺出版社')) {
        labelAnchor = 'top'
      }

      pointLookup.set(point.pointId, point)
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.lon, point.lat]
        },
        properties: {
          pointId: point.pointId,
          placeName: point.placeName,
          labelAnchor
        }
      }
    })

  return { type: 'FeatureCollection', features }
}

function updateWriterPoints() {
  if (!map || !map.getSource(DATA_SOURCE_ID)) return

  const featureCollection = toFeatureCollection(selectedPlaqueId.value)
  map.getSource(DATA_SOURCE_ID).setData(featureCollection)
  closePopup()

  if (!featureCollection.features.length) {
    emptyHint.value = '该作家暂无可展示的地图事件'
    map.easeTo({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM, duration: 500 })
    return
  }

  emptyHint.value = ''
  const bounds = new mapboxgl.LngLatBounds()
  featureCollection.features.forEach((feature) => bounds.extend(feature.geometry.coordinates))
  map.fitBounds(bounds, { padding: 80, maxZoom: 12, duration: 600 })
}

function addDataLayers() {
  if (!map || map.getSource(DATA_SOURCE_ID)) return

  map.addSource(DATA_SOURCE_ID, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] }
  })

  map.addLayer({
    id: DATA_LAYER_ID,
    type: 'circle',
    source: DATA_SOURCE_ID,
    paint: {
      'circle-color': '#ab4b2f',
      'circle-radius': 7,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#f6efe1'
    }
  })

  map.addLayer({
    id: LABEL_LAYER_ID,
    type: 'symbol',
    source: DATA_SOURCE_ID,
    layout: {
      'text-field': ['get', 'placeName'],
      'text-size': 12,
      'text-offset': ['literal', [0, 0]],
      'text-anchor': ['coalesce', ['get', 'labelAnchor'], 'top'],
      'text-variable-anchor': ['top', 'bottom'],
      'text-radial-offset': 1.2,
      'text-allow-overlap': true
    },
    paint: {
      'text-color': '#3a2915',
      'text-halo-color': '#f7efdf',
      'text-halo-width': 1.5
    }
  })

  map.on('mouseenter', DATA_LAYER_ID, () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', DATA_LAYER_ID, () => {
    map.getCanvas().style.cursor = ''
  })

  map.on('click', DATA_LAYER_ID, (event) => {
    const feature = event.features?.[0]
    if (!feature) return

    const point = pointLookup.get(feature.properties?.pointId)
    if (!point) return

    const [lng, lat] = feature.geometry.coordinates
    const projected = map.project([lng, lat])
    const canvasWidth = map.getCanvas().clientWidth || 0
    let anchor = 'bottom'
    if (projected.x < canvasWidth * 0.36) {
      anchor = 'left'
    } else if (projected.x > canvasWidth * 0.64) {
      anchor = 'right'
    }

    closePopup()
    popup = new mapboxgl.Popup({
      className: 'shikong-mapbox-popup',
      closeButton: true,
      closeOnClick: false,
      maxWidth: '500px',
      anchor,
      offset: 14
    })
      .setLngLat([lng, lat])
      .setDOMContent(createPopupContent(point))
      .addTo(map)
  })
}

async function loadShikongData() {
  try {
    const [writersResp, eventsResp] = await Promise.all([
      fetch('/data/shikong/writers.json'),
      fetch('/data/shikong/events-map.json')
    ])

    if (!writersResp.ok || !eventsResp.ok) {
      throw new Error(`fetch failed: writers=${writersResp.status}, events=${eventsResp.status}`)
    }

    const writers = await writersResp.json()
    const eventsMap = await eventsResp.json()
    writerDataMap = eventsMap?.writers || {}

    const normalized = (Array.isArray(writers) ? writers : [])
      .map((item) => ({
        id: String(item.id || '').trim(),
        label: String(item.name || '').trim() || String(item.id || '').trim(),
        order: Number(item.order ?? 999)
      }))
      .filter((item) => item.id)
      .sort((a, b) => a.order - b.order)

    if (!normalized.length) {
      fallbackPlaques()
      return
    }

    plaques.value = normalized
    selectedPlaqueId.value = normalized[0].id
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Shikong] Failed to load shikong data, fallback to static plaques.', error)
    }
    writerDataMap = {}
    fallbackPlaques()
  }
}

function initMap() {
  if (!mapContainer.value) return
  if (!MAPBOX_TOKEN) {
    emptyHint.value = '地图服务未配置，请设置 VITE_MAPBOX_TOKEN 后重试。'
    return
  }
  mapboxgl.accessToken = MAPBOX_TOKEN

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/light-v11',
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    attributionControl: false
  })

  map.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

  try {
    map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }))
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[Shikong] Failed to attach language control.', error)
    }
  }

  map.on('load', () => {
    applyWarmTheme()
    addDataLayers()
    updateWriterPoints()
    map.resize()
  })

  resizeHandler = () => {
    if (map) map.resize()
    resizeVisiblePopupImages()
    relayoutPopup()
  }

  if (typeof ResizeObserver !== 'undefined') {
    containerResizeObserver = new ResizeObserver(() => {
      if (map) map.resize()
      resizeVisiblePopupImages()
      relayoutPopup()
    })
    containerResizeObserver.observe(mapContainer.value)
  }

  window.addEventListener('resize', resizeHandler)
}

watch(selectedPlaqueId, () => {
  updateWriterPoints()
})

onMounted(async () => {
  await loadShikongData()
  initMap()
  window.addEventListener('keydown', handleIntroEscClose)
})

onBeforeUnmount(() => {
  closePopup()

  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }

  window.removeEventListener('keydown', handleIntroEscClose)

  if (containerResizeObserver) {
    containerResizeObserver.disconnect()
    containerResizeObserver = null
  }

  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.shikong-page {
  height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
  background:
    radial-gradient(circle at 20% 14%, rgba(255, 246, 226, 0.42), transparent 26%),
    linear-gradient(180deg, #f0ddbd 0%, #ead6ae 100%);
}

/* 隐藏导航栏的占位元素，避免导航栏下方出现多余空白 */
:deep(.nav-spacer) {
  display: none;
}

.shikong-stage {
  position: relative;
  min-height: 0;
  overflow: hidden;
  padding-top: 80px;
}

.shikong-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  isolation: isolate;
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
  z-index: 1;
  opacity: 0.36;
  mix-blend-mode: multiply;
}

.title-art {
  top: -6%;
  left: -1%;
  z-index: 5;
  width: min(24.5%, 430px);
  filter:
    drop-shadow(0 16px 20px rgba(58, 37, 18, 0.34))
    drop-shadow(0 2px 2px rgba(255, 250, 238, 0.55));
    transform:scale(0.8);
}

.map-shell {
  position: absolute;
  top: 8.9%;
  left: 22.5%;
  width: 56.5%;
  height: 71.4%;
  z-index: 4;
  border-radius: clamp(20px, 1.8vw, 34px);
}

.map-shell::before {
  content: '';
  position: absolute;
  inset: -1.8% -1.2% -3.2% -1.2%;
  border-radius: 42px;
  background:
    radial-gradient(circle at 30% 30%, rgba(190, 161, 122, 0.22), transparent 20%),
    radial-gradient(circle at 78% 22%, rgba(255, 247, 234, 0.5), transparent 18%),
    linear-gradient(180deg, rgba(247, 239, 223, 0.24), rgba(232, 215, 186, 0.18));
  box-shadow: 0 18px 32px rgba(83, 54, 26, 0.08);
}

.map-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 1;
  overflow: hidden;
  background: #ebe0cb;
  box-shadow:
    0 0 0 2px rgba(148, 108, 62, 0.32),
    0 16px 32px rgba(71, 40, 16, 0.16);
}

.map-empty {
  position: absolute;
  inset: auto 20px 20px 20px;
  z-index: 8;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255, 249, 236, 0.92);
  color: #5d4428;
  font-size: 13px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(68, 44, 23, 0.16);
}

.decoration-art {
  left: 50%;
  bottom: -2%;
  z-index: 6;
  width: 100%;
  transform: translateX(-50%);
  filter: drop-shadow(0 12px 20px rgba(77, 49, 20, 0.16));
}

.plaques-wrap {
  position: absolute;
  top: 10.5%;
  right: 3.4%;
  z-index: 7;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(8px, 0.9vh, 14px);
  width: min(9.8%, 168px);
  height: min(57%, 560px);
}

.intro-plaque-wrap {
  position: absolute;
  top: 70.2%;
  right: 3.8%;
  width: min(9.1%, 156px);
  z-index: 7;
}

.intro-plaque-btn {
  width: 100%;
  aspect-ratio: 1088 / 424;
  border: none;
  padding: 0 14%;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  cursor: pointer;
  color: #f7efde;
  text-shadow: 0 2px 6px rgba(41, 21, 8, 0.36);
  transition: transform 0.18s ease, filter 0.18s ease;
  filter: drop-shadow(0 10px 14px rgba(73, 42, 16, 0.18));
}

.intro-plaque-btn:hover:not(:disabled) {
  transform: translateX(-4px);
  filter: brightness(1.12) drop-shadow(0 18px 22px rgba(73, 42, 16, 0.3));
}

.intro-plaque-btn:disabled {
  cursor: wait;
  opacity: 0.88;
}

.intro-plaque-text {
  display: block;
  font-size: clamp(10px, 0.78vw, 14px);
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
}

.plaque-btn {
  width: 100%;
  flex: 0 0 auto;
  aspect-ratio: 1088 / 424;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  cursor: pointer;
  transition: transform 0.18s ease, filter 0.18s ease;
  filter: drop-shadow(0 10px 14px rgba(73, 42, 16, 0.18));
}

.plaque-btn:hover {
  transform: translateX(-4px);
  filter: brightness(1.12) drop-shadow(0 18px 22px rgba(73, 42, 16, 0.3));
}

.plaque-btn.is-active {
  transform: none;
  filter: brightness(1.1) drop-shadow(0 16px 20px rgba(73, 42, 16, 0.28));
}

.plaque-btn.is-active:hover {
  transform: translateX(-4px);
  filter: brightness(1.12) drop-shadow(0 18px 22px rgba(73, 42, 16, 0.3));
}

.plaque-btn.is-active::after {
  content: '★';
  position: absolute;
  top: 50%;
  left: -17%;
  transform: translateY(-50%);
  color: #7a311f;
  font-size: clamp(20px, 2.1vw, 32px);
  text-shadow:
    0 0 8px rgba(247, 224, 173, 0.82),
    0 2px 4px rgba(86, 49, 18, 0.36);
  pointer-events: none;
}

.plaque-text {
  color: #f7efde;
  font-size: clamp(15px, 1.16vw, 23px);
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 2px 6px rgba(41, 21, 8, 0.36);
  display: inline-grid;
  grid-template-columns: repeat(3, 1em);
  align-items: center;
  justify-items: center;
  column-gap: 0.28em;
  width: calc(3em + 0.56em);
  justify-content: center;
  align-self: center;
  white-space: nowrap;
}

.plaque-char {
  text-align: center;
}

.map-layer :deep(.mapboxgl-map),
.map-layer :deep(.mapboxgl-canvas-container),
.map-layer :deep(.mapboxgl-canvas) {
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

:deep(.mapboxgl-ctrl-bottom-right) {
  right: 20px;
  bottom: 50px;
}

:deep(.mapboxgl-ctrl-bottom-left) {
  left: auto;
  right: 34px;
  bottom: 10px;
}

:deep(.mapboxgl-ctrl-bottom-left .mapboxgl-ctrl),
:deep(.mapboxgl-ctrl-bottom-right .mapboxgl-ctrl) {
  margin: 0;
}

:deep(.mapboxgl-ctrl-logo) {
  margin: 0;
}

:deep(.mapboxgl-ctrl-group) {
  overflow: hidden;
  border-radius: 14px;
  background: rgba(249, 242, 228, 0.9);
  box-shadow:
    0 10px 24px rgba(81, 47, 18, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

:deep(.mapboxgl-ctrl-group button) {
  width: 34px;
  height: 34px;
}

:deep(.mapboxgl-ctrl button .mapboxgl-ctrl-icon) {
  filter: sepia(0.55) saturate(0.95);
}

:deep(.shikong-mapbox-popup .mapboxgl-popup-content) {
  position: relative;
  width: min(500px, 76vw);
  max-height: 82vh;
  overflow: auto;
  padding: 14px 14px 12px;
  border-radius: 16px;
  background: rgba(255, 252, 245, 0.9);
  box-shadow: 0 10px 24px rgba(68, 44, 23, 0.2);
}

:deep(.shikong-mapbox-popup .mapboxgl-popup-content)::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background-image: url('/materials/shikongxunzong/bcg-box.png');
  background-size: 100% 100%;
  background-position: left center;
  background-repeat: no-repeat;
  clip-path: inset(0 1px 0 0 round 16px);
  opacity: 0.92;
  pointer-events: none;
}

:deep(.shikong-mapbox-popup .mapboxgl-popup-tip) {
  border-top-color: rgba(247, 242, 233, 0.95) !important;
}

:deep(.shikong-mapbox-popup .mapboxgl-popup-close-button) {
  top: 2px;
  right: 2px;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 0 12px 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  line-height: 1;
  color: #6a4a2a;
  background: rgba(251, 244, 230, 0.82);
  transition: background-color 0.2s ease, color 0.2s ease;
}

:deep(.shikong-mapbox-popup .mapboxgl-popup-close-button:hover) {
  background: rgba(235, 218, 191, 0.95);
  color: #4f3217;
}

:deep(.shikong-mapbox-popup .mapboxgl-popup-close-button:focus-visible) {
  outline: 2px solid rgba(131, 87, 41, 0.7);
  outline-offset: 1px;
}

:deep(.shikong-popup) {
  position: relative;
  z-index: 1;
}

:deep(.shikong-popup-place) {
  margin: 0 0 12px;
  color: #3f2d18;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
}

:deep(.shikong-popup-events) {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

:deep(.shikong-popup-event) {
  border: 1px solid rgba(176, 145, 108, 0.34);
  border-radius: 10px;
  background: rgba(255, 253, 248, 0.84);
}

:deep(.shikong-popup-trigger) {
  width: 100%;
  border: none;
  background: transparent;
  padding: 9px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: #4f3720;
  text-align: left;
}

:deep(.shikong-popup-trigger-title) {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
}

:deep(.shikong-popup-trigger-icon) {
  font-size: 12px;
  color: #7b5a35;
  margin-left: 8px;
  flex-shrink: 0;
}

:deep(.shikong-popup-details) {
  border-top: 1px dashed rgba(166, 130, 88, 0.4);
  padding: 10px 10px 12px;
}

:deep(.shikong-popup-time) {
  margin: 0 0 6px;
  font-size: 12px;
  color: #725333;
}

:deep(.shikong-popup-desc) {
  margin: 0;
  font-size: 13px;
  line-height: 1.55;
  color: #4a341f;
  white-space: pre-wrap;
}

:deep(.shikong-popup-image) {
  display: block;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: min(46vh, 360px);
  min-width: min(220px, 100%);
  min-height: 160px;
  object-fit: contain;
  border-radius: 8px;
  background: rgba(248, 244, 236, 0.92);
  border: 1px solid rgba(176, 145, 108, 0.2);
  margin: 0 auto 8px;
}

.shikong-intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 112px 16px 16px;
  background: rgba(29, 18, 10, 0.42);
}

.shikong-intro-dialog {
  position: relative;
  width: min(560px, 90vw);
  max-height: calc(100vh - 128px);
  overflow: hidden;
  border-radius: 16px;
  background: rgba(255, 252, 245, 0.9);
  box-shadow: 0 14px 30px rgba(68, 44, 23, 0.24);
}

.shikong-intro-dialog::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  background-image: url('/materials/shikongxunzong/bcg-box.png');
  background-size: 100% 100%;
  background-position: left center;
  background-repeat: no-repeat;
  opacity: 0.92;
  pointer-events: none;
}

.shikong-intro-header {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 10px 4px 14px;
  background: rgba(255, 252, 245, 0.92);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

.shikong-intro-title {
  margin: 0;
}

.shikong-intro-popup {
  position: relative;
  z-index: 1;
  padding: 8px 14px 12px;
  max-height: calc(100vh - 190px);
  overflow: auto;
}

.shikong-intro-details {
  background: rgba(255, 253, 248, 0.84);
  border: 1px solid rgba(176, 145, 108, 0.34);
  border-radius: 10px;
  padding: 12px 12px 14px;
}

.shikong-intro-image {
  width: min(100%, 330px);
  min-width: 0;
  max-height: min(40vh, 360px);
  min-height: 150px;
  object-fit: contain;
  object-position: center center;
  margin-bottom: 10px;
}

.shikong-intro-error {
  color: #7a311f;
}

.shikong-intro-paragraph {
  margin-bottom: 8px;
  text-indent: 2em;
}

.shikong-intro-paragraph:last-child {
  margin-bottom: 0;
}

.shikong-intro-close {
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  padding: 0;
  border: none;
  border-radius: 0 12px 0 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  line-height: 1;
  color: #6a4a2a;
  background: rgba(251, 244, 230, 0.82);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.shikong-intro-close:hover {
  background: rgba(235, 218, 191, 0.95);
  color: #4f3217;
}

.shikong-intro-close:focus-visible {
  outline: 2px solid rgba(131, 87, 41, 0.7);
  outline-offset: 1px;
}

@media (max-width: 1200px) {
  .map-shell {
    left: 23%;
    width: 55%;
    height: 68%;
  }

  .plaques-wrap {
    right: 2.6%;
    width: min(10.4%, 154px);
    height: min(60%, 520px);
  }

  .intro-plaque-wrap {
    right: 2.9%;
    width: min(10%, 148px);
    top: 71%;
  }
}

@media (max-width: 860px) {
  .title-art {
    top: 1.5%;
    left: 1%;
    width: min(26%, 220px);
  }

  .map-shell {
    top: 12.6%;
    left: 18%;
    width: 64%;
    height: 60%;
    border-radius: 24px;
  }

  .plaques-wrap {
    top: 72%;
    left: 18%;
    right: 8%;
    width: 74%;
    height: auto;
    flex-direction: row;
    justify-content: space-between;
    gap: 8px;
  }

  .plaque-btn {
    width: calc((100% - 32px) / 5);
    min-width: 100px;
  }

  .intro-plaque-wrap {
    top: 82%;
    left: 34%;
    right: auto;
    width: min(32%, 210px);
  }

  .decoration-art {
    bottom: -1%;
  }
}

@media (max-width: 640px) {
  .title-art {
    top: -1%;
    left: 1%;
    width: min(32%, 176px);
  }

  .map-shell {
    top: 11.2%;
    left: 15.8%;
    width: 69%;
    height: 55.5%;
    border-radius: 18px;
  }

  .plaques-wrap {
    top: 68%;
    left: 13%;
    right: 4%;
    width: 83%;
    gap: 6px;
  }

  .plaque-btn {
    min-width: 0;
  }

  .plaque-text {
    font-size: 13px;
    column-gap: 0.22em;
    width: calc(3em + 0.44em);
  }

  .intro-plaque-wrap {
    top: 80.5%;
    left: 31%;
    width: 38%;
  }

  .intro-plaque-text {
    font-size: 11px;
  }

  .shikong-intro-image {
    width: min(100%, 280px);
    min-height: 130px;
    max-height: min(34vh, 300px);
  }

  .shikong-intro-popup {
    max-height: calc(100vh - 165px);
  }
}
</style>
