/** Scroll behavior aligned with CSS `prefers-reduced-motion`. */
export function getScrollBehavior(): ScrollBehavior {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return 'auto'
  }
  return 'smooth'
}
