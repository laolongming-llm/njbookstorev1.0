/**
 * 首页页面配置 —— 文案、导航、栏目等均在此统一管理。
 * 后续微调导航位置：只改每个模块的 hotspot.centerX / centerY / width。
 */

// 四个导航项统一 width，centerX 等间距（间隔 13%）
// 微调位置只改 centerX / centerY；整体变大小只改 width
export const NAV_MODULES = [
  {
    id: 'shikong',
    title: '时空寻踪',
    route: '/shikong',
    hotspot: { centerX: 45, centerY: 50, width: 12 }
  },
  {
    id: 'shuyuan',
    title: '作家书缘',
    route: '/shuyuan',
    hotspot: { centerX: 58, centerY: 50, width: 12 }
  },
  {
    id: 'manyou',
    title: '虚拟漫游书店',
    route: '/manyou',
    hotspot: { centerX: 71, centerY: 50, width: 12 }
  },
  {
    id: 'shalong',
    title: '沙龙互动共创',
    route: '/shalong',
    hotspot: { centerX: 84, centerY: 50, width: 12 }
  }
]

export const LOGIN_HOTSPOT = {
  centerX: 96.8,
  centerY: 50,
  width: 3.2
}

/* ---- 轮播区 ---- */

export const CAROUSEL_CONFIG = {
  title: '南京实体书店巡礼与作家群像',
  intervalMs: 4000,
  transitionMs: 700
}

export const CAROUSEL_IMAGE_META = [
  { id: 1, normalScale: 1, transparentScale: 1, offsetX: 0, offsetY: 0 },
  { id: 2, normalScale: 1, transparentScale: 1, offsetX: 0, offsetY: 0 },
  { id: 3, normalScale: 1, transparentScale: 1, offsetX: 0, offsetY: 0 },
  { id: 4, normalScale: 1, transparentScale: 1, offsetX: 0, offsetY: 0 },
  { id: 5, normalScale: 1, transparentScale: 1, offsetX: 0, offsetY: 0 }
]
