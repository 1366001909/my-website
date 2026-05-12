import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AboutSection } from './components/AboutSection'
import { ContactSection } from './components/ContactSection'
import { HeroSection } from './components/HeroSection'
import { ProjectsSection } from './components/ProjectsSection'
import { ScrollBlurOverlay } from './components/ScrollBlurOverlay'
import { SiteHeader, type SectionId } from './components/SiteHeader'
import { getScrollBehavior } from './lib/scroll'

function App() {
  const [blurActive, setBlurActive] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>(() => {
    if (typeof window === 'undefined') return 'home'
    const raw = window.location.hash.replace(/^#/, '')
    if (
      raw === 'home' ||
      raw === 'projects' ||
      raw === 'about' ||
      raw === 'contact'
    ) {
      return raw
    }
    return 'home'
  })
  const endBlurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearEndBlurTimer() {
    if (endBlurTimerRef.current !== null) {
      clearTimeout(endBlurTimerRef.current)
      endBlurTimerRef.current = null
    }
  }

  function scheduleEndBlur() {
    clearEndBlurTimer()
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ms = reduced ? 120 : 480
    endBlurTimerRef.current = setTimeout(() => {
      setBlurActive(false)
      endBlurTimerRef.current = null
    }, ms)
  }

  function beginNavigate(id: SectionId) {
    clearEndBlurTimer()
    setActiveSection(id)
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) {
      setBlurActive(true)
    }
    document.getElementById(id)?.scrollIntoView({
      behavior: getScrollBehavior(),
      block: 'start',
    })
    scheduleEndBlur()
  }

  useLayoutEffect(() => {
    const raw = window.location.hash.replace(/^#/, '')
    if (
      raw === 'home' ||
      raw === 'projects' ||
      raw === 'about' ||
      raw === 'contact'
    ) {
      document.getElementById(raw)?.scrollIntoView({
        behavior: getScrollBehavior(),
        block: 'start',
      })
    }
  }, [])

  useEffect(() => {
    const sectionIds: SectionId[] = [
      'home',
      'projects',
      'about',
      'contact',
    ]
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting && e.target.id)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const id = intersecting[0]?.target?.id
        if (
          id === 'home' ||
          id === 'projects' ||
          id === 'about' ||
          id === 'contact'
        ) {
          setActiveSection(id)
        }
      },
      { threshold: [0.12, 0.28, 0.45], rootMargin: '-64px 0px -42% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    return () => clearEndBlurTimer()
  }, [])

  return (
    <>
      <SiteHeader onNavigate={beginNavigate} activeSection={activeSection} />
      <ScrollBlurOverlay active={blurActive} />
      <main className="site-main">
        <section id="home" className="section-anchor">
          <HeroSection
            onNavigateToProjects={() => beginNavigate('projects')}
          />
        </section>
        <section
          id="projects"
          className="section-anchor border-t border-[var(--border)] bg-[var(--bg)]"
          aria-labelledby="projects-heading"
        >
          <ProjectsSection />
        </section>
        <section
          id="about"
          className="section-anchor border-t border-[var(--border)] bg-[var(--bg)]"
          aria-labelledby="about-heading"
        >
          <AboutSection />
        </section>
        <section
          id="contact"
          className="section-anchor border-t border-[var(--border)] bg-[var(--code-bg)]"
          aria-labelledby="contact-heading"
        >
          <ContactSection />
        </section>
      </main>
    </>
  )
}

export default App
