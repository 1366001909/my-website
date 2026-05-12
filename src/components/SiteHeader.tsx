import type { KeyboardEvent, MouseEvent } from 'react'
import { heroName } from '../content/hero'

export type SectionId = 'home' | 'projects' | 'about' | 'contact'

type SiteHeaderProps = {
  onNavigate: (id: SectionId) => void
  activeSection: SectionId
}

const links: { id: SectionId; label: string }[] = [
  { id: 'home', label: '首页' },
  { id: 'projects', label: '项目' },
  { id: 'about', label: '关于我' },
  { id: 'contact', label: '联系我' },
]

function NavAnchor({
  id,
  label,
  activeSection,
  onNavigate,
}: {
  id: SectionId
  label: string
  activeSection: SectionId
  onNavigate: (id: SectionId) => void
}) {
  function activate(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    onNavigate(id)
  }

  function onKeyDown(e: KeyboardEvent<HTMLAnchorElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onNavigate(id)
    }
  }

  const active = activeSection === id

  return (
    <a
      href={`#${id}`}
      className={[
        'inline-flex min-h-9 min-w-[4.25rem] items-center justify-center rounded-lg border px-3 py-1.5 text-sm font-medium transition-[color,background-color,border-color,box-shadow] duration-150 sm:min-h-10 sm:px-4 sm:text-base',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
        active
          ? 'border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent)] shadow-sm'
          : 'border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] text-[var(--text-h)] hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]',
      ].join(' ')}
      aria-current={active ? 'page' : undefined}
      onClick={activate}
      onKeyDown={onKeyDown}
    >
      {label}
    </a>
  )
}

export function SiteHeader({ onNavigate, activeSection }: SiteHeaderProps) {
  function brandActivate(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    onNavigate('home')
  }

  function brandKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onNavigate('home')
    }
  }

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex min-h-[var(--nav-height)] flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] px-3 py-2 backdrop-blur-sm sm:px-5"
    >
      <button
        type="button"
        className={[
          'max-w-[45%] truncate rounded-lg border px-3 py-1.5 text-left text-base font-semibold transition-[color,background-color,border-color,box-shadow] duration-150 sm:max-w-none sm:px-4 sm:text-lg',
          activeSection === 'home'
            ? 'border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--accent)] shadow-sm'
            : 'border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] text-[var(--text-h)] hover:border-[var(--accent-border)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]',
        ].join(' ')}
        onClick={brandActivate}
        onKeyDown={brandKeyDown}
        aria-label={`回到首页，${heroName}`}
        aria-current={activeSection === 'home' ? 'page' : undefined}
      >
        {heroName}
      </button>

      <nav
        className="flex flex-shrink-0 flex-wrap items-center justify-end gap-x-1.5 gap-y-1.5 sm:gap-x-2"
        aria-label="主导航"
      >
        {links.map(({ id, label }) => (
          <NavAnchor
            key={id}
            id={id}
            label={label}
            activeSection={activeSection}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </header>
  )
}
