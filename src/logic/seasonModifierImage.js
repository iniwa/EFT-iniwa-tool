const width = 1040
const padding = 40
const right = width - padding
const columnGap = 32
const modifierColumnWidth = (right - padding - columnGap) / 2
const modifierTop = 320
const modifierHeaderHeight = 48
const emptyRowHeight = 32
const maxBitmapSize = 4096
const font = '"Meiryo", "Yu Gothic", system-ui, sans-serif'

const colors = {
  background: '#111715', panel: '#1f2924', line: '#35423a', text: '#f4f3eb',
  muted: '#c4c9bf', gain: '#b1d8ab', cost: '#f1bbaa', gold: '#e2cc9b', note: '#2a271d',
}

export const PROVISIONAL_IMAGE_NOTE = '未確定情報｜効果・ポイントはシーズン開始前に変更される可能性があります'

export function formatModifierPoints(points) {
  return `${points > 0 ? '+' : points < 0 ? '−' : ''}${Math.abs(points)} pt`
}

function wrap(context, value, maxWidth) {
  const lines = []
  let line = ''
  for (const character of value) {
    if (line && context.measureText(line + character).width > maxWidth) {
      lines.push(line.trimEnd())
      line = character.trimStart()
    } else {
      line += character
    }
  }
  if (line) lines.push(line.trimEnd())
  return lines
}

export function renderSeasonModifierPng(season, evaluation) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas rendering is unavailable')

  const groups = [
    { title: 'Positive', label: 'ポイント消費', kind: 'positive', color: colors.cost },
    { title: 'Negative', label: 'ポイント獲得', kind: 'negative', color: colors.gain },
  ].map((group) => {
    const rows = evaluation.selected.filter((item) => item.kind === group.kind).map((item) => {
      context.font = `700 23px ${font}`
      const names = wrap(context, item.name, modifierColumnWidth - 130)
      context.font = `400 18px ${font}`
      const effects = wrap(context, item.description, modifierColumnWidth - 20)
      return { names, effects, points: item.points, height: 24 + names.length * 31 + effects.length * 26 }
    })
    const rowsHeight = rows.reduce((total, row) => total + row.height, 0)
    return { ...group, rows, height: modifierHeaderHeight + (rowsHeight || emptyRowHeight) }
  })

  const notices = []
  if (!evaluation.isPointValid) notices.push('ポイント不足')
  if (evaluation.unknownIds.length) notices.push(`効果を確認できない項目 ${evaluation.unknownIds.length}件`)
  if (season.status === 'pre-release') notices.push(PROVISIONAL_IMAGE_NOTE)

  const modifiersBottom = modifierTop + Math.max(...groups.map((group) => group.height))
  const height = modifiersBottom + padding + notices.length * 48
  const scale = Math.min(2, maxBitmapSize / height)
  canvas.width = Math.round(width * scale)
  canvas.height = Math.min(maxBitmapSize, Math.ceil(height * scale))
  context.scale(scale, scale)
  context.textBaseline = 'top'

  function box(color, x, y, w, h) {
    context.fillStyle = color
    context.fillRect(x, y, w, h)
  }

  function text(value, x, y, size, color, { bold = false, align = 'left' } = {}) {
    context.font = `${bold ? 700 : 400} ${size}px ${font}`
    context.fillStyle = color
    context.textAlign = align
    context.fillText(value, x, y)
  }

  box(colors.background, 0, 0, width + 1, height + 1)
  box(colors.gold, padding, 36, 56, 3)
  text('PERSONAL MODIFIER', padding, 52, 18, colors.gold, { bold: true })
  const [title, subtitle] = season.displayName.split(' — ')
  text(title, padding, 84, 46, colors.text, { bold: true })
  const count = `選択中 ${evaluation.selectedCount}件`
  text(subtitle ? `${subtitle}  /  ${count}` : count, padding, 146, 20, colors.muted)

  const columnWidth = (right - padding) / 3
  box(colors.panel, padding, 190, right - padding, 98)
  const totals = [
    ['獲得', evaluation.earned, colors.gain],
    ['消費', -evaluation.spent, colors.cost],
    ['残高', evaluation.balance, evaluation.isPointValid ? colors.text : colors.cost],
  ]
  totals.forEach(([label, points, color], index) => {
    const x = padding + columnWidth * index
    if (index > 0) box(colors.line, x, 205, 1, 68)
    text(label, x + 22, 204, 18, colors.muted)
    text(formatModifierPoints(points), x + 22, 233, 32, color, { bold: true })
  })

  box(colors.line, width / 2, modifierTop, 1, modifiersBottom - modifierTop - 12)
  groups.forEach((group, index) => {
    const left = padding + index * (modifierColumnWidth + columnGap)
    const columnRight = left + modifierColumnWidth
    text(group.title, left, modifierTop, 25, group.color, { bold: true })
    text(group.label, columnRight, modifierTop + 5, 17, colors.muted, { align: 'right' })
    let y = modifierTop + modifierHeaderHeight
    if (!group.rows.length) text('選択なし', left + 10, y, 18, colors.muted)

    for (const row of group.rows) {
      const rowTop = y
      text(formatModifierPoints(row.points), columnRight - 10, rowTop, 24, group.color, { bold: true, align: 'right' })
      for (const line of row.names) {
        text(line, left + 10, y, 23, colors.text, { bold: true })
        y += 31
      }
      for (const line of row.effects) {
        text(line, left + 10, y, 18, colors.muted)
        y += 26
      }
      box(colors.line, left, y + 4, modifierColumnWidth, 1)
      y = rowTop + row.height
    }
  })

  let y = modifiersBottom
  for (const notice of notices) {
    box(colors.note, padding, y + 4, right - padding, 40)
    text(notice, padding + 12, y + 13, 17, colors.gold)
    y += 48
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('PNG export failed'))
    }, 'image/png')
  })
}
