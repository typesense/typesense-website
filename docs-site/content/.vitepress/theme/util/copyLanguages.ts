// the label doubles as the id
const COPY_LANGUAGES = {
  JavaScript: 'javascript',
  PHP: 'php',
  Python: 'python',
  Ruby: 'ruby',
  Dart: 'dart',
  Java: 'java',
  Go: 'go',
  Swift: 'swift',
  Shell: 'shell',
} as const

export type CopyLanguageLabel = keyof typeof COPY_LANGUAGES
export type CopyLanguageSlug = (typeof COPY_LANGUAGES)[CopyLanguageLabel]

export interface CopyLanguage {
  label: CopyLanguageLabel
  slug: CopyLanguageSlug
}

// non-integer keys preserve insertion order, these stay as declared
const COPY_LANGUAGE_OPTIONS = Object.keys(COPY_LANGUAGES) as CopyLanguageLabel[]
const COPY_LANGUAGE_SLUGS = Object.values(COPY_LANGUAGES)

function getCopyLanguageByLabel(label: string): CopyLanguage | null {
  return label in COPY_LANGUAGES ? { label: label as CopyLanguageLabel, slug: COPY_LANGUAGES[label as CopyLanguageLabel] } : null
}

function getCopyLanguageBySlug(slug: string): CopyLanguage | null {
  const normalized = (slug || '').toLowerCase()
  const label = COPY_LANGUAGE_OPTIONS.find(candidate => COPY_LANGUAGES[candidate] === normalized)
  return label ? { label, slug: COPY_LANGUAGES[label] } : null
}

function normalizeCopyLanguages(languages: unknown): CopyLanguageLabel[] {
  const selected = new Set(Array.isArray(languages) ? languages : [])
  return COPY_LANGUAGE_OPTIONS.filter(label => selected.has(label))
}

export {
  COPY_LANGUAGES,
  COPY_LANGUAGE_OPTIONS,
  COPY_LANGUAGE_SLUGS,
  getCopyLanguageByLabel,
  getCopyLanguageBySlug,
  normalizeCopyLanguages,
}
