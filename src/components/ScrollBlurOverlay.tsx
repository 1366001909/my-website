type ScrollBlurOverlayProps = {
  active: boolean
}

/**
 * Full-viewport visual feedback during in-page navigation.
 * z-index below SiteHeader; pointer-events none per design.
 */
export function ScrollBlurOverlay({ active }: ScrollBlurOverlayProps) {
  if (!active) {
    return null
  }

  return (
    <div
      className="scroll-blur-overlay pointer-events-none fixed inset-0 z-40"
      aria-hidden="true"
    />
  )
}
