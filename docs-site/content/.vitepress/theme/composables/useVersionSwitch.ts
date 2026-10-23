import { computed } from 'vue'
import { useData, useRoute, useRouter, withBase } from 'vitepress'
import type { TypesensePageData, TypesenseThemeConfig } from '../types'

// shared by the version dropdown and the "switch to latest" warning
export function useVersionSwitch() {
  const { page, theme } = useData<TypesenseThemeConfig>()
  const route = useRoute()
  const router = useRouter()

  const versions = computed<string[]>(() => theme.value.typesenseVersions || [])
  const latestVersion = computed<string>(() => theme.value.typesenseLatestVersion)
  const currentVersion = computed<string | null>(
    () => (page.value as TypesensePageData).typesenseVersion ?? null,
  )
  const versionPages = computed<Record<string, string[]>>(() => theme.value.typesenseVersionPages || {})

  // route.path carries the /docs/ base, version-relative logic doesn't want it
  const relPath = computed(() => route.path.replace(/^\/docs/, '') || '/')

  const isApiPage = computed(() => /\/api(\/|$)/.test(relPath.value))

  const currentPath = computed(() => {
    if (!currentVersion.value) return '/'
    const m = relPath.value.match(new RegExp(`^/${currentVersion.value}(/.*)?$`))
    // cleanUrls is false, getVersionedPath re-appends exactly one .html
    return m && m[1] ? m[1].replace(/\.html$/, '') : '/'
  })

  // read at call time, a computed with no reactive deps would never update
  const readHash = () => (typeof window !== 'undefined' ? window.location.hash : '')

  function compareVersions(a: string | null, b: string | null): number {
    if (!a || !b) return 0
    const aParts = String(a).split('.')
    const bParts = String(b).split('.')
    const len = Math.max(aParts.length, bParts.length)
    for (let i = 0; i < len; i += 1) {
      const aNum = parseInt(aParts[i] || '0', 10)
      const bNum = parseInt(bParts[i] || '0', 10)
      if (Number.isNaN(aNum) || Number.isNaN(bNum)) {
        const aSeg = aParts[i] || ''
        const bSeg = bParts[i] || ''
        if (aSeg === bSeg) continue
        return aSeg > bSeg ? 1 : -1
      }
      if (aNum > bNum) return 1
      if (aNum < bNum) return -1
    }
    return 0
  }

  const showVersionWarning = computed(
    () => !!currentVersion.value && currentVersion.value !== latestVersion.value,
  )
  const isOlderThanLatest = computed(() => compareVersions(currentVersion.value, latestVersion.value) < 0)
  const isNewerThanLatest = computed(() => compareVersions(currentVersion.value, latestVersion.value) > 0)

  // every version keeps the same /api/… layout, only which pages exist differs
  function getVersionedPath(version: string): string {
    return `/${version}${currentPath.value}.html${readHash()}`.replace(/\/\.html/, '/')
  }

  // versions predating this page get greyed out rather than linking to a 404
  function versionHasPage(version: string): boolean {
    const pages = versionPages.value[version]
    return !pages || pages.includes(currentPath.value)
  }

  // getVersionedPath stays base-relative for RouterLink, which adds its own
  function goToVersion(version: string) {
    if (currentVersion.value !== version) router.go(withBase(getVersionedPath(version)))
  }

  function switchVersion(event: Event) {
    goToVersion((event.target as HTMLSelectElement).value)
  }

  return {
    versions,
    latestVersion,
    currentVersion,
    isApiPage,
    showVersionWarning,
    isOlderThanLatest,
    isNewerThanLatest,
    getVersionedPath,
    versionHasPage,
    goToVersion,
    switchVersion,
  }
}
