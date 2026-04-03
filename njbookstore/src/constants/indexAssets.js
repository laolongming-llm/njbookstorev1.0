const INDEX_BASE = '/materials/Index_materials'
const LUNBO_BASE = `${INDEX_BASE}/lunbo`

function asset(filename) {
  return `${INDEX_BASE}/${filename}`
}

export const ASSETS = {
  background: asset('backgroud.png'),
  topNavFrame: asset('nav.png'),
  navItemBg: asset('header-1.png'),
  loginIcon: asset('login_pattern.png'),

  heroPicture: asset('column-picture.png'),
  heroDecorate: asset('column-decorate.png'),
  titleRight: asset('title.png'),
  titleLeft: asset('title2.png'),

  carouselBg: asset('column1.png'),
  carouselSwallow: asset('column1-decorate1.png'),
  carouselCloud: asset('column1-decorate2.png'),
  carouselDiscLeft: asset('zhuanpan left.png'),
  carouselDiscRight: asset('zhuanpan right.png'),
  carouselHeaderBar: asset('header2.png'),

  columnsMain: asset('column2.png'),
  columnHeaderBar: asset('header-1.png'),
  bottomScroll: asset('bottom.png')
}

const CAROUSEL_PATHS = [
  'bishanshuju/bishanshuju.jpg',
  'cangxiangjiushudian/cangxiangjiushudian.jpg',
  'chaoliushudian/chaoliushudian1.jpg',
  'chaoliushudian/chaoliushudian2.jpg',
  'chuqiushudian/chuqiushudian1.jpg',
  'chuqiushudian/chuqiushudian2.jpg',
  'gujishudian/gujishudian1.jpg',
  'gujishudian/gujishudian2.jpg',
  'handong/handong1.jpg',
  'handong/handong2.jpg',
  'hongweijiushudian/hongweijiushudian1.jpg',
  'hongweijiushudian/hongweijiushudian2.jpg',
  'huamojiushudian/huamojiushudian.jpg',
  'huazhoushudian/huazhoushudian1.jpg',
  'huazhoushudian/huazhoushudian2.jpg',
  'huihuangjiushudian/huihuangjiushudian1.jpg',
  'huihuangjiushudian/huihuangjiushudian2.jpg',
  'jinlintushuguan/jinlintushuguan.jpg',
  'juyishudian/juyishudian.jpg',
  'letaoleshudian/letaoleshudian.jpg',
  'letaoshudian/letaoshudian.jpg',
  'luyang/luyang1.jpg',
  'luyang/luyang2.webp',
  'meiyoumingzideshudian/meiyoumingzideshudian1.jpg',
  'meiyoumingzideshudian/meiyoumingzideshudian2.jpg',
  'nanhangjiushudian/nanhangjiushudian.jpg',
  'nanjinggujishudian/nanjinggujishudian.jpg',
  'pinyuzhaishudian/pinyuzhaishudian1.jpg',
  'pojiushudian/pojiushudian1.jpg',
  'pojiushudian/pojiushudian2.jpg',
  'pojiushudian/pojiushudian3.jpg',
  'sutong/sutong1.jpg',
  'sutong/sutong2.jpg',
  'weichushudian/weichu1.jpg',
  'weichushudian/weichushudian2.jpg',
  'weichushudian/weichushudian3.jpg',
  'xianfengshudian/xianfengshudian.jpg',
  'xianfengyiheshuguan/xianfengyiheshuguan.jpg',
  'xuerenshudian/xuerenshudian1.jpg',
  'xuerenshudian/xuerenshudian2.jpg',
  'xuerenshudian/xuerenshudian3.jpg',
  'yezhaoyan/yezhaoyan1.jpg',
  'yezhaoyan/yezhaoyan2.jpg',
  'yongfengshe/yongfengshe.jpg',
  'yuanbojiushudian/yanbojiushudian1.jpg',
  'yuanbojiushudian/yuanboshudian2.jpg',
  'zhuwen/zhuwen1.jpg',
  'zhuwen/zhuwen2.jpg'
]

export const CAROUSEL_IMAGES = CAROUSEL_PATHS.map((relativePath, index) => {
  const [folder, filename] = relativePath.split('/')
  return {
    id: index + 1,
    src: `${LUNBO_BASE}/${relativePath}`,
    folder,
    filename
  }
})

if (import.meta.env.DEV) {
  const missing = Object.entries(ASSETS).filter(([, value]) => !value)
  if (missing.length) {
    console.warn('[indexAssets] missing:', missing.map(([key]) => key))
  }
  console.log(`[indexAssets] loaded carousel images: ${CAROUSEL_IMAGES.length}`)
}
