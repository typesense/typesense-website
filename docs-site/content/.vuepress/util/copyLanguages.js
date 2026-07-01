const COPY_LANGUAGES = Object.freeze([
  { label: 'JavaScript', slug: 'javascript' },
  { label: 'PHP', slug: 'php' },
  { label: 'Python', slug: 'python' },
  { label: 'Ruby', slug: 'ruby' },
  { label: 'Dart', slug: 'dart' },
  { label: 'Java', slug: 'java' },
  { label: 'Go', slug: 'go' },
  { label: 'Swift', slug: 'swift' },
  { label: 'Shell', slug: 'shell' },
])

const COPY_LANGUAGE_OPTIONS = COPY_LANGUAGES.map(language => language.label)
const COPY_LANGUAGE_SLUGS = COPY_LANGUAGES.map(language => language.slug)

const COPY_LANGUAGE_BY_LABEL = COPY_LANGUAGES.reduce((acc, language) => {
  acc[language.label] = language
  return acc
}, {})

const COPY_LANGUAGE_BY_SLUG = COPY_LANGUAGES.reduce((acc, language) => {
  acc[language.slug] = language
  return acc
}, {})

function getCopyLanguageByLabel(label) {
  return COPY_LANGUAGE_BY_LABEL[label] || null
}

function getCopyLanguageBySlug(slug) {
  return COPY_LANGUAGE_BY_SLUG[String(slug || '').toLowerCase()] || null
}

function normalizeCopyLanguages(languages) {
  const selected = new Set(Array.isArray(languages) ? languages : [])
  return COPY_LANGUAGE_OPTIONS.filter(label => selected.has(label))
}

module.exports = {
  COPY_LANGUAGES,
  COPY_LANGUAGE_OPTIONS,
  COPY_LANGUAGE_SLUGS,
  getCopyLanguageByLabel,
  getCopyLanguageBySlug,
  normalizeCopyLanguages,
}
