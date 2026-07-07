import { useEffect, useState } from 'react'

const VISITS_KEY = 'vantage-visits'
const SESSION_KEY = 'vantage-visit-counted'
const DECIDED_KEY = 'vantage-install-decided'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** Count one visit per browser session; returns the total so far. */
function countVisit(): number {
  const counted = sessionStorage.getItem(SESSION_KEY)
  const current = Number(localStorage.getItem(VISITS_KEY) ?? '0')
  if (counted) return current
  const next = current + 1
  localStorage.setItem(VISITS_KEY, String(next))
  sessionStorage.setItem(SESSION_KEY, '1')
  return next
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [visits, setVisits] = useState(0)

  useEffect(() => {
    setVisits(countVisit())
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  const decided = localStorage.getItem(DECIDED_KEY) !== null
  if (!installEvent || visits < 2 || decided) return null

  async function install() {
    if (!installEvent) return
    await installEvent.prompt()
    await installEvent.userChoice
    localStorage.setItem(DECIDED_KEY, '1')
    setInstallEvent(null)
  }

  function dismiss() {
    localStorage.setItem(DECIDED_KEY, '1')
    setInstallEvent(null)
  }

  return (
    <div
      role="dialog"
      aria-label="Install Vantage"
      className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-xs rounded-card border border-hairline bg-white p-4 shadow-sm"
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-ultramarine">
        Add to home screen
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-ink">
        Install Vantage for quick access. It works offline with the last data you loaded.
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={install}
          className="rounded-chip bg-ultramarine px-3 py-1.5 text-sm text-paper hover:bg-ultramarine/90"
        >
          Install
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-chip border border-hairline px-3 py-1.5 text-sm text-slate hover:text-ink"
        >
          Not now
        </button>
      </div>
    </div>
  )
}
