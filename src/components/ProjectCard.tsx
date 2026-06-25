import { useState } from 'react'
import type { ProjectItem } from '../content/projects'

type ProjectCardProps = {
  project: ProjectItem
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [imageBroken, setImageBroken] = useState(false)

  const coverContent = imageBroken ? (
    <div
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--accent-bg)] to-[var(--code-bg)] text-2xl font-medium text-[var(--accent)]"
      aria-hidden
    >
      {project.name.slice(0, 1)}
    </div>
  ) : (
    <img
      src={project.imageSrc}
      alt={project.imageAlt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
      onError={() => setImageBroken(true)}
    />
  )

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg)] transition-shadow duration-200 motion-reduce:hover:border-[var(--accent-border)] motion-reduce:hover:shadow-md motion-safe:transition-[transform,box-shadow,border-color] motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-[var(--accent-border)] motion-safe:hover:shadow-lg focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg)]">
      <div className="aspect-video w-full overflow-hidden bg-[var(--code-bg)]">
        {project.projectUrl ? (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full transition-opacity duration-150 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent)]"
            aria-label={`访问 ${project.name}`}
          >
            {coverContent}
          </a>
        ) : (
          coverContent
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4 text-left">
        <h3 className="m-0 text-lg font-medium text-[var(--text-h)]">
          {project.name}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--text)]">
          {project.summary}
        </p>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex w-fit rounded-md text-sm font-medium text-[var(--accent)] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          GitHub
        </a>
      </div>
    </article>
  )
}
