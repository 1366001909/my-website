import { useRef } from 'react'
import { heroName, heroRole, heroTagline } from '../content/hero'
import { HeroParticles } from './HeroParticles'
import { ThemeToggle } from './ThemeToggle'

export type HeroSectionProps = {
  onNavigateToProjects?: () => void
}

export function HeroSection({ onNavigateToProjects }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={containerRef}
      className="relative grid min-h-[100svh] place-items-center px-5 py-12"
      aria-label="个人介绍"
    >
      <div className="hero-backdrop" aria-hidden="true" />

      <HeroParticles containerRef={containerRef} />

      <div className="relative z-10 w-full max-w-[min(40rem,92vw)] text-center">
        <h1 className="m-0 mb-3 text-4xl font-medium tracking-tight text-[var(--text-h)] sm:text-5xl md:text-6xl">
          {heroName}
        </h1>
        <p className="mb-4 text-lg text-[var(--text)] sm:text-xl">{heroRole}</p>
        <p className="mx-auto max-w-prose text-pretty text-base leading-relaxed text-[var(--text)] sm:text-lg">
          {heroTagline}
        </p>
        {onNavigateToProjects ? (
          <button
            type="button"
            className="mt-6 inline-flex items-center justify-center rounded-md border-2 border-[var(--accent-border)] bg-[var(--accent-bg)] px-5 py-2.5 text-base font-medium text-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            onClick={onNavigateToProjects}
          >
            查看项目
          </button>
        ) : null}
        <ThemeToggle />
      </div>
    </section>
  )
}
