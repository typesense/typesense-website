// enough to tell a 0.25.1 path segment from guide, overview, latest
export default function isSemVer(value: string): boolean {
  const parts = value.split('.')
  return parts.length === 3 && parts.every(part => part !== '' && Number.isInteger(Number(part)))
}
