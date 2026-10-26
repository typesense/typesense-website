import { computed } from 'vue'
import { useData } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import type { TypesensePageData, TypesenseThemeConfig } from '../types'

export function useNavLinks() {
  const { page, theme } = useData<TypesenseThemeConfig>()

  return computed(() => {
    const version = (page.value as TypesensePageData).typesenseVersion ?? theme.value.typesenseLatestVersion
    return (theme.value.nav ?? [])
      .filter((item): item is DefaultTheme.NavItemWithLink => 'link' in item)
      .map((item) => (item.link.endsWith('/api/') ? { ...item, link: `/${version}/api/` } : item))
  })
}
