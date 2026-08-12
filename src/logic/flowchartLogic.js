/** Return scrollable stage bounds from the measured SVG, without arbitrary margins. */
export function getZoomedStageBounds(width, height, zoom = 1) {
  const factor = Number.isFinite(zoom) && zoom > 0 ? zoom : 1
  return {
    width: Math.max(1, Math.ceil((Number(width) || 0) * factor)),
    height: Math.max(1, Math.ceil((Number(height) || 0) * factor)),
  }
}
