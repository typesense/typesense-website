const { getCopyLanguageByLabel, getCopyLanguageBySlug, normalizeCopyLanguages } = require('./copyLanguages')

const STORAGE_KEY = 'typesense.docs.copyMarkdownLanguages'
const URL_PARAM = 'languages'

function canUseBrowserLocation() {
  return typeof window !== 'undefined' && !!window.location
}

function readRawLanguagesFromLocation() {
  if (!canUseBrowserLocation()) {
    return null
  }

  const searchParams = new URLSearchParams(window.location.search || '')
  if (searchParams.has(URL_PARAM)) {
    return searchParams.get(URL_PARAM) || ''
  }

  const hash = window.location.hash || ''
  const queryIndex = hash.indexOf('?')
  if (queryIndex === -1) {
    return null
  }

  const hashParams = new URLSearchParams(hash.slice(queryIndex + 1))
  if (!hashParams.has(URL_PARAM)) {
    return null
  }

  return hashParams.get(URL_PARAM) || ''
}

function readPreferredCopyLanguagesFromUrl() {
  try {
    const raw = readRawLanguagesFromLocation()
    if (raw === null) {
      return null
    }

    const labels = raw
      .split(',')
      .map(value => value.trim())
      .map(slug => {
        const language = getCopyLanguageBySlug(slug)
        return language ? language.label : null
      })
      .filter(Boolean)

    return normalizeCopyLanguages(labels)
  } catch (error) {
    console.error('Failed to read preferred copy languages from URL:', error)
    return null
  }
}

function readPreferredCopyLanguagesFromStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return []
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    const parsedValue = value ? JSON.parse(value) : []
    return normalizeCopyLanguages(parsedValue)
  } catch (error) {
    console.error('Failed to read preferred copy languages from localStorage:', error)
    return []
  }
}

function stripLanguagesFromHash(url) {
  if (!url.hash) {
    return
  }

  const queryIndex = url.hash.indexOf('?')
  if (queryIndex === -1) {
    return
  }

  const hashParams = new URLSearchParams(url.hash.slice(queryIndex + 1))
  hashParams.delete(URL_PARAM)
  const remaining = hashParams.toString()
  url.hash = url.hash.slice(0, queryIndex) + (remaining ? `?${remaining}` : '')
}

function syncPreferredCopyLanguagesToUrl(languages) {
  if (typeof window === 'undefined' || !window.history || !window.history.replaceState) {
    return
  }

  try {
    const url = new URL(window.location.href)
    stripLanguagesFromHash(url)

    const normalizedLanguages = normalizeCopyLanguages(languages)
    const slugs = normalizedLanguages
      .map(label => getCopyLanguageByLabel(label))
      .filter(Boolean)
      .map(language => language.slug)

    if (slugs.length > 0) {
      url.searchParams.set(URL_PARAM, slugs.join(','))
    } else {
      url.searchParams.delete(URL_PARAM)
    }

    const nextHref = url.toString()
    if (nextHref !== window.location.href) {
      window.history.replaceState(window.history.state, '', nextHref)
    }
  } catch (error) {
    console.error('Failed to sync preferred copy languages to URL:', error)
  }
}

function readPreferredCopyLanguages() {
  if (typeof window === 'undefined') {
    return []
  }

  const fromUrl = readPreferredCopyLanguagesFromUrl()
  if (fromUrl !== null) {
    return fromUrl
  }

  return readPreferredCopyLanguagesFromStorage()
}

function writePreferredCopyLanguages(languages) {
  const normalizedLanguages = normalizeCopyLanguages(languages)

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedLanguages))
    } catch (error) {
      console.error('Failed to persist preferred copy languages to localStorage:', error)
    }
  }

  syncPreferredCopyLanguagesToUrl(normalizedLanguages)
  return normalizedLanguages
}

module.exports = {
  readPreferredCopyLanguages,
  syncPreferredCopyLanguagesToUrl,
  writePreferredCopyLanguages,
}
