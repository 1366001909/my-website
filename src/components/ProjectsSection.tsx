import { projects } from '../content/projects'
import { ProjectCard } from './ProjectCard'

export function ProjectsSection() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 text-left sm:text-center">
      <h2 id="projects-heading" className="m-0 mb-8 text-2xl font-medium text-[var(--text-h)]">
        项目
      </h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 md:gap-8">
        {projects.map((project) => (
          <li key={project.id} className="min-w-0">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  )
}
