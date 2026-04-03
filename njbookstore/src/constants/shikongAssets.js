function asset(filename) {
  return `/materials/shikongxunzong/${filename}`
}

function indexAsset(filename) {
  return `/materials/Index_materials/${filename}`
}

export const SHIKONG_ASSETS = {
  bgBottom: asset('bcg-diceng.png'),
  bgTop: asset('bcg-shangceng.png'),
  bgDecoration: asset('bcg-decoration.png'),
  title: asset('title.png'),
  item: asset('item.png'),
  plankBg: indexAsset('header-1.png')
}

export const SHIKONG_PLAQUES = [
  { id: 'yezhaoyan', label: '\u53f6\u5146\u8a00' },
  { id: 'handong', label: '\u97e9\u4e1c' },
  { id: 'zhuwen', label: '\u6731\u6587' },
  { id: 'luyang', label: '\u9c81\u7f8a' },
  { id: 'sutong', label: '\u82cf\u7ae5' }
]

if (import.meta.env.DEV) {
  const missing = Object.entries(SHIKONG_ASSETS).filter(([, value]) => !value)
  if (missing.length) {
    console.warn('[shikongAssets] missing:', missing.map(([key]) => key))
  }
}
