import type { DefaultTheme, PageData } from 'vitepress'
import type { DocSearchProps } from 'typesense-docsearch.js'
import type { CopyTabGroup } from './util/markdownCopy'

export interface TypesenseThemeConfig extends DefaultTheme.Config {
  typesenseVersions: string[]
  typesenseLatestVersion: string
  typesenseVersionPages: Record<string, string[]>
  typesenseDocsearch?: Omit<DocSearchProps, 'container'>
  searchPlaceholder?: string
}

export interface TypesensePageData extends PageData {
  typesenseVersion?: string | null
  markdown?: string
  markdownUrl?: string
  markdownCopyTabGroups?: CopyTabGroup[]
  markdownCopyLanguages?: string[]
}
