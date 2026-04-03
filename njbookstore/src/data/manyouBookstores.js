const MANYOU_IMAGE_BASE = '/materials/xunimanyou/shudianzhaopian'

function img(path) {
  return `${MANYOU_IMAGE_BASE}/${path}`
}

export const MANYOU_BOOKSTORES = [
  {
    id: 'gujishudian',
    name: '南京古籍书店',
    founded: '前身1936年（中华书局南京分局），1956年公私合营，1990年代定名',
    description:
      '太平南路民国建筑内的老字号古籍书店，主营古籍、线装书、碑帖，是南京古籍文化的重要地标。傅抱石、武中奇、亚明等文化名流都曾是书店常客。',
    images: [img('gujishudian/gujishudian1.jpg'), img('gujishudian/gujishudian2.jpg')]
  },
  {
    id: 'juyishudian',
    name: '聚益书店',
    founded: '1990年代（仓巷第一家旧书店）',
    description:
      '朝天宫仓巷老牌旧书店，曾带动仓巷旧书街的鼎盛，主营旧书与老物件，是南京旧书文化的重要符号。',
    images: [img('juyishudian/juyishudian.jpg')]
  },
  {
    id: 'xuerenshudian',
    name: '学人书店',
    founded: '2000年6月',
    description:
      '位于南大附近，被不少读者称为“第二图书馆”，主营文史哲旧书，藏量十余万册，是高校师生常去的淘书点。店内除旧书外还有复刻古籍、黑胶与老物件，二层长期陈列店主收藏。',
    images: [
      img('xuerenshudian/xuerenshudian1.jpg'),
      img('xuerenshudian/xuerenshudian2.jpg'),
      img('xuerenshudian/xuerenshudian3.jpg')
    ]
  },
  {
    id: 'weichushudian',
    name: '唯楚书店',
    founded: '2003年',
    description:
      '汉口路旧书店，店名取自“惟楚有才”，主营学术与文史类旧书，客源以高校师生为主，是南京旧书圈知名老店。书店内部以密集书架见长，保持了传统旧书店的淘书氛围。',
    images: [
      img('weichushudian/weichu1.jpg'),
      img('weichushudian/weichushudian2.jpg'),
      img('weichushudian/weichushudian3.jpg')
    ]
  },
  {
    id: 'pinyuzhaishudian',
    name: '品雨斋书店',
    founded: '2003年',
    description:
      '主营特价人文社科书，曾在广州路、青岛路等地经营，2020年后关闭实体店，转为网店与库房售书。',
    images: [img('pinyuzhaishudian/pinyuzhaishudian1.jpg')]
  },
  {
    id: 'letaoshudian',
    name: '乐匋书店',
    founded: '2000年（一说2004年注册）',
    description:
      '南师大附近的专业古籍书店，主营古籍、文史、艺术类图书，兼售名家手稿与信札，是南京旧书店中的代表性门店。',
    images: [img('letaoshudian/letaoshudian.jpg')]
  },
  {
    id: 'chuqiushudian',
    name: '春秋书店',
    founded: '2013年4月23日',
    description: '鼓楼区个体书店，主营图书与文具零售，经营稳定，服务周边社区与学生群体。',
    images: [img('chuqiushudian/chuqiushudian1.jpg'), img('chuqiushudian/chuqiushudian2.jpg')]
  },
  {
    id: 'hongweijiushudian',
    name: '宏伟旧书店',
    founded: '未查到',
    description: '南京旧书市场常见的旧书店类型，主营二手旧书，多分布于高校周边或旧书街区。',
    images: [
      img('hongweijiushudian/hongweijiushudian1.jpg'),
      img('hongweijiushudian/hongweijiushudian2.jpg')
    ]
  },
  {
    id: 'huihuangjiushudian',
    name: '辉煌旧书店',
    founded: '未查到',
    description: '南京旧书圈的小型旧书店，主营二手文史类旧书，面向本地淘书客，公开资料较少。',
    images: [
      img('huihuangjiushudian/huihuangjiushudian1.jpg'),
      img('huihuangjiushudian/huihuangjiushudian2.jpg')
    ]
  },
  {
    id: 'chaoliushudian',
    name: '潮流书店',
    founded: '未查到',
    description:
      '仓巷旧书街现存书店之一，主营旧书，店主曹勇长期见证仓巷旧书业从兴盛到转型，是本地淘书据点。',
    images: [img('chaoliushudian/chaoliushudian1.jpg'), img('chaoliushudian/chaoliushudian2.jpg')]
  },
  {
    id: 'huamojiushudian',
    name: '华墨书店',
    founded: '未查到',
    description: '南京书店名录中较少见的小型独立旧书店，以二手旧书流通为主。',
    images: [img('huamojiushudian/huamojiushudian.jpg')]
  },
  {
    id: 'yuanbojiushudian',
    name: '渊博旧书店',
    founded: '未查到',
    description: '南京旧书市场中的小型旧书店，主营二手旧书，服务周边居民与学生，公开资料有限。',
    images: [img('yuanbojiushudian/yanbojiushudian1.jpg'), img('yuanbojiushudian/yuanboshudian2.jpg')]
  },
  {
    id: 'letaoleshudian',
    name: '乐淘乐书店',
    founded: '未查到',
    description: '主营二手书或特价书，面向大众读者，满足日常淘书与补书需求。',
    images: [img('letaoleshudian/letaoleshudian.jpg')]
  },
  {
    id: 'meiyoumingzideshudian',
    name: '没有名字的书店',
    founded: '未查到',
    description:
      '南京特色的无名独立书店，属于小众文艺空间，无公开招牌，主要依靠口碑传播，相关信息较为零散。',
    images: [
      img('meiyoumingzideshudian/meiyoumingzideshudian1.jpg'),
      img('meiyoumingzideshudian/meiyoumingzideshudian2.jpg')
    ]
  },
  {
    id: 'huazhoushudian',
    name: '花洲书店',
    founded: '未查到',
    description:
      '曾为南京知名旧书店，后关闭实体店并转做孔夫子旧书网线上经营，主营旧书与文史资料。',
    images: [img('huazhoushudian/huazhoushudian1.jpg'), img('huazhoushudian/huazhoushudian2.jpg')]
  },
  {
    id: 'pojiushudian',
    name: '破旧书店',
    founded: '未查到',
    description: '名称直白，主打低价二手旧书，面向学生与普通读者，公开资料较少。',
    images: [
      img('pojiushudian/pojiushudian1.jpg'),
      img('pojiushudian/pojiushudian2.jpg'),
      img('pojiushudian/pojiushudian3.jpg')
    ]
  },
  {
    id: 'cangxiangjiushudian',
    name: '仓巷旧书店',
    founded: '未查到',
    description:
      '“仓巷旧书店”更常作为仓巷旧书街多家店铺的泛称，并非单一独立书店，没有统一创立时间。',
    images: [img('cangxiangjiushudian/cangxiangjiushudian.jpg')]
  },
  {
    id: 'nanhangjiushudian',
    name: '南航旧书店',
    founded: '未查到',
    description: '位于南京航空航天大学周边，主营教材、教辅与二手旧书，主要服务校内师生。',
    images: [img('nanhangjiushudian/nanhangjiushudian.jpg')]
  }
]
