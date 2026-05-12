export const aboutPhotoAlt = '个人照片'

/** 恰好三段简介，顺序为自上而下展示 */
export const aboutParagraphs: [string, string, string] = [
  '你好，我是一名热爱前端与工程化的开发者，关注可访问性、性能与可维护性。',
  '平时喜欢把复杂需求拆成清晰模块，用 TypeScript 与组件化思维把界面做得稳定、好改。',
  '若你有合作或交流想法，欢迎在下方「联系我」留言或发邮件，我会尽快回复。',
]

export type BrandItem = {
  name: string
  /** Logo 待定时的占位缩写，显示在灰底方块内 */
  abbr: string
  href?: string
}

export const brandItems: BrandItem[] = [
  { name: '示例品牌 A', abbr: 'A', href: 'https://example.com' },
  { name: '示例品牌 B', abbr: 'B' },
]
