import type { DefaultTheme } from 'vitepress'

// the vuepress sidebar verbatim, converted below rather than hand-retyped
import vuepressSidebarData from './data/vuepress-sidebar.cjs'
const vuepressSidebar = vuepressSidebarData as Record<string, VuePressItem[]>

type VuePressTuple = [string, string]
type VuePressGroup = {
  title: string
  collapsable?: boolean
  path?: string
  children: VuePressItem[]
}
type VuePressItem = VuePressTuple | VuePressGroup

const normalizeLink = (link: string): string =>
  link.replace(/\.(md|html)$/, '')

const isTuple = (item: VuePressItem): item is VuePressTuple => Array.isArray(item)

const convertItem = (item: VuePressItem): DefaultTheme.SidebarItem => {
  if (isTuple(item)) {
    const [link, text] = item
    return { text, link: normalizeLink(link) }
  }

  const group: DefaultTheme.SidebarItem = {
    text: item.title,
    // vuepress `collapsable: false` means always-open
    collapsed: item.collapsable === false ? false : undefined,
    items: item.children.map(convertItem),
  }
  if (item.path) group.link = normalizeLink(item.path)
  return group
}

export const sidebar: DefaultTheme.Sidebar = Object.fromEntries(
  Object.entries(vuepressSidebar).map(([prefix, items]) => [
    prefix,
    items.map(convertItem),
  ]),
)
