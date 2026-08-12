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
