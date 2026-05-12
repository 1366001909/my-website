import { useState } from 'react'
import aboutPhotoUrl from '../assets/about-photo.jpg'
import {
  aboutPhotoAlt,
  aboutParagraphs,
  brandItems,
} from '../content/about'

export function AboutSection() {
  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 text-left sm:text-center">
      <h2
        id="about-heading"
        className="m-0 mb-8 text-2xl font-medium text-[var(--text-h)]"
      >
        关于我
      </h2>

      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10 md:text-left">
        <div className="mx-auto w-full max-w-xs shrink-0 md:mx-0">
          {!photoFailed ? (
            <img
              src={aboutPhotoUrl}
              alt={aboutPhotoAlt}
              width={320}
              height={400}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full rounded-2xl border border-[var(--border)] object-cover"
              onError={() => setPhotoFailed(true)}
            />
          ) : (
            <div
              role="img"
              aria-label={aboutPhotoAlt}
              className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--code-bg)] text-sm text-[var(--text)]"
            >
              照片暂不可用
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-4 text-pretty text-base leading-relaxed text-[var(--text)] sm:text-center md:text-left">
          {aboutParagraphs.map((text, i) => (
            <p key={i} className="m-0">
              {text}
            </p>
          ))}
        </div>
      </div>

      {brandItems.length > 0 ? (
        <ul className="mt-12 flex list-none flex-wrap justify-start gap-6 p-0 sm:justify-center md:justify-start">
          {brandItems.map((item) => (
            <li
              key={item.name}
              className="flex min-w-[8rem] max-w-[12rem] flex-col items-center gap-2 text-center sm:max-w-none"
            >
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-[var(--text-h)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
                >
                  {item.name}
                </a>
              ) : (
                <span className="text-sm font-medium text-[var(--text-h)]">
                  {item.name}
                </span>
              )}
              <span
                className="flex h-14 w-14 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--code-bg)] text-xs font-semibold uppercase tracking-wide text-[var(--text-h)]"
                aria-hidden
              >
                {item.abbr}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
