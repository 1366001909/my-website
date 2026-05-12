import projectPlaceholder from '../assets/projects/project-placeholder.svg'

/** 占位截图：四条记录共用本地 SVG；GitHub 链接为示例仓库，请替换为你的真实地址。 */

export type ProjectItem = {
  id: string
  name: string
  summary: string
  githubUrl: string
  imageSrc: string
  imageAlt: string
}

function assertHttpsGithub(url: string, context: string) {
  if (!url.startsWith('https://')) {
    throw new Error(`${context}: githubUrl must start with https:// — got ${url}`)
  }
}

const rawProjects: ProjectItem[] = [
  {
    id: 'p1',
    name: '个人品牌站',
    summary:
      '基于 React 与 Vite 的单页站点，含 Hero、导航与主题切换，部署于 GitHub Pages。',
    githubUrl: 'https://github.com/octocat/Hello-World',
    imageSrc: projectPlaceholder,
    imageAlt: '个人品牌站项目封面占位图',
  },
  {
    id: 'p2',
    name: '组件库实验',
    summary: '封装常用 UI 模式与无障碍实践，探索 design token 与暗色主题一体化。',
    githubUrl: 'https://github.com/octocat/Spoon-Knife',
    imageSrc: projectPlaceholder,
    imageAlt: '组件库实验项目封面占位图',
  },
  {
    id: 'p3',
    name: 'CLI 小工具',
    summary: 'Node 脚本集合，用于本地工作流自动化；强调零配置与可测试性。',
    githubUrl: 'https://github.com/octocat/linguist',
    imageSrc: projectPlaceholder,
    imageAlt: 'CLI 小工具项目封面占位图',
  },
  {
    id: 'p4',
    name: '数据可视化练习',
    summary: '以静态数据集驱动的图表练习，关注性能与可读性，无后端依赖。',
    githubUrl: 'https://github.com/octocat/boysenberry-repo-1',
    imageSrc: projectPlaceholder,
    imageAlt: '数据可视化练习项目封面占位图',
  },
]

rawProjects.forEach((p) => assertHttpsGithub(p.githubUrl, p.id))

export const projects: ProjectItem[] = rawProjects
