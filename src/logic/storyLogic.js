/** IDs that bulk completion may safely set without fabricating a choice. */
export function getBulkCompletableStepIds(chapter, isVisible = () => true) {
  return (chapter?.phases || []).flatMap((phase) => phase.steps || [])
    .filter((step) => isVisible(step) && !step.optional && ['check', 'wait'].includes(step.type))
    .map((step) => step.id)
}
