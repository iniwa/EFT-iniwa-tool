/** IDs that bulk completion may safely set without fabricating a choice. */
export function getBulkCompletableStepIds(chapter, isVisible = () => true) {
  return (chapter?.phases || []).flatMap((phase) => phase.steps || [])
    .filter((step) => isVisible(step) && !step.optional && ['check', 'wait'].includes(step.type))
    .map((step) => step.id)
}

/** A step counts as done only with a value this version understands (stale choice values never count). */
export function isStepDone(step, value) {
  if (!step || step.type === 'note') return false
  if (step.type === 'choice') return (step.options || []).some((o) => o.value === value)
  return value === true
}

/** Evaluate showIf against saved progress. showIf may point at another chapter. */
export function isStepVisible(step, chapterId, progress) {
  if (!step?.showIf) return true
  const cId = step.showIf.chapterId || chapterId
  return progress?.[cId]?.[step.showIf.stepId] === step.showIf.value
}

/** Count required (non-note, non-optional, visible) steps and finished ones. */
export function getChapterStats(chapter, progress) {
  let done = 0
  let total = 0
  for (const phase of chapter?.phases || []) {
    for (const step of phase.steps || []) {
      if (step.optional || step.type === 'note' || !isStepVisible(step, chapter.id, progress)) continue
      total++
      if (isStepDone(step, progress?.[chapter.id]?.[step.id])) done++
    }
  }
  return { done, total, complete: total > 0 && done === total }
}

/** First unfinished required step (the "next action"), with its phase. Null when none. */
export function findNextStep(chapter, progress) {
  for (const phase of chapter?.phases || []) {
    for (const step of phase.steps || []) {
      if (step.optional || step.type === 'note' || !isStepVisible(step, chapter.id, progress)) continue
      if (!isStepDone(step, progress?.[chapter.id]?.[step.id])) return { phase, step }
    }
  }
  return null
}

/**
 * Saved records this version cannot place: unknown chapters/steps, or choice values that no longer exist.
 * They are kept untouched (backup/restore) but never counted as clears.
 */
export function findUnmappedRecords(chapters, progress) {
  const byId = new Map((chapters || []).map((c) => [c.id, c]))
  const result = []
  for (const [chapterId, steps] of Object.entries(progress || {})) {
    if (!steps || typeof steps !== 'object') continue
    const chapter = byId.get(chapterId)
    const known = new Map((chapter?.phases || []).flatMap((p) => p.steps || []).map((s) => [s.id, s]))
    for (const [stepId, value] of Object.entries(steps)) {
      if (!value) continue
      const step = known.get(stepId)
      if (!step) result.push({ chapterId, stepId, value, reason: chapter ? 'step' : 'chapter' })
      else if (step.type === 'choice' && !step.options?.some((o) => o.value === value)) result.push({ chapterId, stepId, value, reason: 'value' })
    }
  }
  return result
}
