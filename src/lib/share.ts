export function generateShareLink(type: 'cv' | 'portfolio' | 'presentation', data: object): string {
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(data))))
  const base = window.location.origin + window.location.pathname
  return `${base}#/share/${type}/${encoded}`
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
    document.body.appendChild(ta); ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta); return ok
  }
}
