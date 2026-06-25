import projectPlaceholder from '../assets/projects/project-placeholder.svg'
import aiTextPolisherCover from '../assets/projects/ai-text-polisher-cover.png'
import jianpuCover from '../assets/projects/jianpu-cover.png'

/** 占位截图：四条记录共用本地 SVG；GitHub 链接为示例仓库，请替换为你的真实地址。 */

export type ProjectItem = {
  id: string
  name: string
  summary: string
  githubUrl: string
  /** 点击封面图跳转的在线访问地址（可选） */
  projectUrl?: string
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
    name: '个人写作助手',
    summary:
      '基于 React 与 DeepSeek 的 AI 文本润色工具，支持在线写作优化，已部署可访问。',
    githubUrl: 'https://github.com/1366001909/ai-text-polisher',
    projectUrl: 'http://43.139.224.190:3000',
    imageSrc: aiTextPolisherCover,
    imageAlt: '个人写作助手 AI Text Polisher 界面截图',
  },
  {
    id: 'p3',
    name: '简谱曲库',
    summary:
      '基于 Django 与 MySQL 的简谱图片收藏站，支持分类浏览、搜索与管理后台，已部署可访问。',
    githubUrl: 'https://github.com/1366001909/jianpu',
    projectUrl: 'http://43.139.224.190/',
    imageSrc: jianpuCover,
    imageAlt: '简谱曲库网站界面截图',
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
