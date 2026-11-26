/** Resolve UI task references without silently choosing among duplicate names. */
export function resolveTaskReference(reference, tasks = []) {
  if (!reference) return { status: 'not-found', matches: [] }
  const id = typeof reference === 'string' ? null : reference.id || reference.taskId
  const name = typeof reference === 'string' ? reference : reference.name || reference.taskName
  if (id) {
    const task = tasks.find((candidate) => candidate.id === id)
    return task ? { status: 'resolved', task, matches: [task] } : { status: 'not-found', matches: [] }
  }
  const matches = name
    ? tasks.filter((candidate) => [candidate.name, ...(candidate.nameAliases || [])].includes(name))
    : []
  return matches.length === 1
    ? { status: 'resolved', task: matches[0], matches }
    : { status: matches.length ? 'ambiguous' : 'not-found', matches }
}

/** Dynamic outbound URLs are intentionally limited to HTTPS. */
export function toHttpsUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}

function readableName(value) {
  return typeof value === 'string' && value.trim()
    && !/^(?:[0-9a-f]{24}(?:\s+name)?|\d+|unknown task)$/i.test(value.trim())
}

// tarkov.dev IDs for the two faction-paired quest lines. Older GraphQL
// references can omit factionName even when they carry the stable ID.
const FACTION_BY_TASK_ID = new Map([
  ['6613f3007f6666d56807c929', 'BEAR'], ['66151401efb0539ae10875ae', 'USEC'], // Drip-Out 1
  ['6613f307fca4f2f386029409', 'BEAR'], ['6615141bfda04449120269a7', 'USEC'], // Drip-Out 2
  ['5e381b0286f77420e3417a74', 'BEAR'], ['5e383a6386f77465910ce1f3', 'USEC'], // Textile 1
  ['5e4d4ac186f774264f758336', 'BEAR'], ['5e4d515e86f77438b2195244', 'USEC'], // Textile 2
])

export function getTaskDisplayName(task, fallback = 'タスク名未取得') {
  const names = [task?.name, ...(task?.nameAliases || [])]
  const faction = task?.factionName ?? FACTION_BY_TASK_ID.get(task?.id)
  let name = names.find(readableName)?.trim()
  const slug = task?.normalizedName
  if (!name && readableName(slug)) {
    const baseSlug = faction && slug.toLowerCase().endsWith('-' + faction.toLowerCase())
      ? slug.slice(0, -faction.length - 1)
      : slug
    name = baseSlug.replace(/[-_]+/g, ' ').trim()
  }
  if (!name) return fallback
  if (faction !== 'BEAR' && faction !== 'USEC') return name
  const suffix = new RegExp('[（(]' + faction + '[）)]$', 'i')
  return suffix.test(name) ? name : name + '（' + faction + '）'
}
