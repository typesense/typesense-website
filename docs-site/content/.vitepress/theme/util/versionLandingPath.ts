// from 0.20 on, <version>/README.md only forwards to <version>/api/, which also
// holds the what's new section. earlier versions have a real landing page
export default function versionLandingPath(version: string): string {
  const [major, minor] = version.split('.').map(Number)
  return major === 0 && minor < 20 ? `/${version}/` : `/${version}/api/`
}
