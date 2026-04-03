import { ref } from 'vue'

const WRITERS_DATA_PATH = '/data/zuojiashuyuan/writers-content.json'
const MANIFEST_DATA_PATH = '/data/zuojiashuyuan/writer-images-manifest.json'

const SECTION_KEYS = ['experience', 'works', 'activities']

export const SHUYUAN_SECTION_META = {
  experience: { label: '作家经历' },
  works: { label: '作品一览' },
  activities: { label: '文化活动' }
}

const YEAR_PATTERN = /(?<!\d)(19|20)\d{2}(?!\d)/g
const DATE_TOKEN_PATTERN = /(19|20)\d{2}\s*年(?:\s*\d{1,2}\s*月)?(?:\s*\d{1,2}\s*日)?/g
const CAPTION_WORK_PATTERN = /《([^》]+)》/g

function normalizeText(value) {
  return String(value || '').replace(/\r/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
}

function uniqueStrings(items) {
  const seen = new Set()
  const result = []
  items.forEach((item) => {
    const text = normalizeText(item)
    if (!text || seen.has(text)) return
    seen.add(text)
    result.push(text)
  })
  return result
}

function extractYears(text) {
  const target = String(text || '')
  return uniqueStrings(Array.from(target.matchAll(YEAR_PATTERN)).map((match) => match[0]))
}

function extractDateTokens(text) {
  const target = String(text || '')
  return uniqueStrings(Array.from(target.matchAll(DATE_TOKEN_PATTERN)).map((match) => match[0].replace(/\s+/g, '')))
}

function extractWorkTitles(text) {
  const target = String(text || '')
  return uniqueStrings(Array.from(target.matchAll(CAPTION_WORK_PATTERN)).map((match) => match[1]))
}

function stripCaptionPrefix(caption) {
  const text = normalizeText(caption)
  if (!text) return ''
  const stripped = text.replace(/^图\s*(?:\d+\s*-\s*\d+|\d+|-\s*\d+)\s*[:：、.．]?\s*/, '').trim()
  return stripped
}

function sortYearTokens(tokens) {
  return [...tokens].sort((a, b) => Number(a) - Number(b))
}

function parseCaptionCode(caption) {
  const text = normalizeText(caption)
  if (!text) {
    return { baseCode: '', major: null, minor: null, type: 'none' }
  }

  let match = text.match(/^图\s*(\d+)\s*-\s*(\d+)/)
  if (match) {
    return {
      baseCode: `图${match[1]}-${match[2]}`,
      major: Number(match[1]),
      minor: Number(match[2]),
      type: 'major_minor'
    }
  }

  match = text.match(/^图\s*(\d+)/)
  if (match) {
    return {
      baseCode: `图${match[1]}`,
      major: Number(match[1]),
      minor: null,
      type: 'major_only'
    }
  }

  match = text.match(/^图\s*-\s*(\d+)/)
  if (match) {
    return {
      baseCode: '',
      major: null,
      minor: Number(match[1]),
      type: 'minor_only'
    }
  }

  return { baseCode: '', major: null, minor: null, type: 'unparsed' }
}

function inferFallbackMajor(parsedItems) {
  const majorCounter = new Map()
  parsedItems.forEach((item) => {
    if (item.major == null) return
    const current = majorCounter.get(item.major) || 0
    majorCounter.set(item.major, current + 1)
  })

  let fallbackMajor = 1
  let maxCount = 0
  majorCounter.forEach((count, major) => {
    if (count <= maxCount) return
    maxCount = count
    fallbackMajor = major
  })

  return fallbackMajor
}

function buildDisplayCodes(images) {
  const parsed = images.map((img) => parseCaptionCode(img.caption))
  const fallbackMajor = inferFallbackMajor(parsed)
  const duplicateCounter = new Map()

  return parsed.map((item, index) => {
    let baseCode = ''
    if (item.type === 'major_minor' || item.type === 'major_only') {
      baseCode = item.baseCode
    } else if (item.type === 'minor_only') {
      baseCode = `图${fallbackMajor}-${item.minor}`
    } else {
      baseCode = `图${index + 1}`
    }

    const count = (duplicateCounter.get(baseCode) || 0) + 1
    duplicateCounter.set(baseCode, count)

    if (count > 1) {
      return `${baseCode} (${count})`
    }
    return baseCode
  })
}

function resolveAspectClass(width, height) {
  const w = Number(width) || 0
  const h = Number(height) || 0
  if (!w || !h) return 'unknown'
  if (w === h) return 'square'
  return w > h ? 'landscape' : 'portrait'
}

function buildSection(sectionKey, rawSection, manifestMap) {
  const safeSection = rawSection || {}
  const paragraphList = Array.isArray(safeSection.paragraphs) ? safeSection.paragraphs : []
  const imageList = Array.isArray(safeSection.images) ? safeSection.images : []

  const paragraphs = paragraphList
    .map((paragraph, idx) => {
      const text = normalizeText(paragraph.text)
      if (!text) return null
      return {
        id: `${sectionKey}-p-${idx + 1}`,
        sourceParagraphIndex: Number(paragraph.sourceParagraphIndex) || idx + 1,
        style: paragraph.style || '',
        align: paragraph.align || '',
        text,
        years: extractYears(text),
        dateTokens: extractDateTokens(text)
      }
    })
    .filter(Boolean)

  const displayCodes = buildDisplayCodes(imageList)

  const images = imageList.map((image, idx) => {
    const manifestItem = manifestMap.get(image.blockId) || {}
    const captionRaw = normalizeText(image.caption || manifestItem.caption || '')
    const captionText = stripCaptionPrefix(captionRaw)
    const titles = uniqueStrings([
      ...(Array.isArray(image.workTitlesDetected) ? image.workTitlesDetected : []),
      ...(Array.isArray(manifestItem.workTitlesDetected) ? manifestItem.workTitlesDetected : []),
      ...extractWorkTitles(captionRaw)
    ])

    const sourceParagraphIndex = Number(image.sourceParagraphIndex || manifestItem.sourceParagraphIndex) || idx + 1
    const width = Number(image.width || manifestItem.width) || 0
    const height = Number(image.height || manifestItem.height) || 0
    const webPath = image.webPath || manifestItem.webPath || ''

    return {
      id: image.blockId || `${sectionKey}-img-${idx + 1}`,
      sequence: idx + 1,
      sourceParagraphIndex,
      fileName: image.fileName || manifestItem.fileName || '',
      webPath,
      captionRaw,
      captionText,
      displayCode: displayCodes[idx] || `图${idx + 1}`,
      workTitles: titles,
      width,
      height,
      aspectClass: resolveAspectClass(width, height),
      years: extractYears(captionRaw),
      dateTokens: extractDateTokens(captionRaw)
    }
  })

  const yearsDetectedRaw = Array.isArray(safeSection.yearsDetected) ? safeSection.yearsDetected : []
  const dateTokensDetectedRaw = Array.isArray(safeSection.dateTokensDetected) ? safeSection.dateTokensDetected : []
  const workTitlesDetectedRaw = Array.isArray(safeSection.workTitlesDetected) ? safeSection.workTitlesDetected : []

  const years = sortYearTokens(
    uniqueStrings([
      ...yearsDetectedRaw,
      ...paragraphs.flatMap((item) => item.years),
      ...images.flatMap((item) => item.years)
    ])
  )

  const dateTokens = uniqueStrings([
    ...dateTokensDetectedRaw,
    ...paragraphs.flatMap((item) => item.dateTokens),
    ...images.flatMap((item) => item.dateTokens)
  ])

  const workTitles = uniqueStrings([
    ...workTitlesDetectedRaw,
    ...images.flatMap((item) => item.workTitles)
  ])

  const flowItems = [
    ...paragraphs.map((item, idx) => ({
      kind: 'paragraph',
      order: idx + 1,
      sourceParagraphIndex: item.sourceParagraphIndex,
      payload: item
    })),
    ...images.map((item, idx) => ({
      kind: 'image',
      order: idx + 1,
      sourceParagraphIndex: item.sourceParagraphIndex,
      payload: item
    }))
  ].sort((a, b) => {
    if (a.sourceParagraphIndex !== b.sourceParagraphIndex) {
      return a.sourceParagraphIndex - b.sourceParagraphIndex
    }
    if (a.kind !== b.kind) {
      return a.kind === 'paragraph' ? -1 : 1
    }
    return a.order - b.order
  })

  return {
    key: sectionKey,
    name: safeSection.name || SHUYUAN_SECTION_META[sectionKey].label,
    paragraphCount: paragraphs.length,
    imageCount: images.length,
    paragraphs,
    images,
    years,
    dateTokens,
    workTitles,
    flowItems
  }
}

function normalizeWriter(writer, manifestMap) {
  const safeWriter = writer || {}
  const safeSections = safeWriter.sections || {}

  const sections = SECTION_KEYS.reduce((acc, sectionKey) => {
    acc[sectionKey] = buildSection(sectionKey, safeSections[sectionKey], manifestMap)
    return acc
  }, {})

  const overviewSummary =
    sections.experience.paragraphs[0]?.text ||
    sections.works.paragraphs[0]?.text ||
    sections.activities.paragraphs[0]?.text ||
    '暂无作家内容'

  const overviewYears = sortYearTokens(
    uniqueStrings([
      ...sections.experience.years,
      ...sections.works.years,
      ...sections.activities.years
    ])
  )

  return {
    id: safeWriter.id || '',
    name: safeWriter.name || '未命名作家',
    order: Number(safeWriter.order) || 999,
    sections,
    overview: {
      summary: overviewSummary,
      years: overviewYears,
      workTitles: sections.works.workTitles,
      totalParagraphs:
        sections.experience.paragraphCount +
        sections.works.paragraphCount +
        sections.activities.paragraphCount,
      totalImages:
        sections.experience.imageCount +
        sections.works.imageCount +
        sections.activities.imageCount
    }
  }
}

async function loadJson(url) {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`请求失败 ${response.status}: ${url}`)
  }
  return response.json()
}

export function useShuyuanData() {
  const loading = ref(false)
  const error = ref('')
  const writers = ref([])
  const generatedAt = ref('')

  async function loadData() {
    loading.value = true
    error.value = ''

    try {
      const [contentJson, manifestJson] = await Promise.all([
        loadJson(WRITERS_DATA_PATH),
        loadJson(MANIFEST_DATA_PATH)
      ])

      const writerList = Array.isArray(contentJson?.writers) ? contentJson.writers : []
      const manifestImages = Array.isArray(manifestJson?.images) ? manifestJson.images : []
      const manifestMap = new Map(manifestImages.map((item) => [item.blockId, item]))

      writers.value = writerList
        .map((item) => normalizeWriter(item, manifestMap))
        .sort((a, b) => a.order - b.order)

      generatedAt.value = contentJson?.generatedAt || manifestJson?.generatedAt || ''
    } catch (err) {
      writers.value = []
      generatedAt.value = ''
      error.value = err instanceof Error ? err.message : '作家书缘数据加载失败'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    writers,
    generatedAt,
    loadData
  }
}
