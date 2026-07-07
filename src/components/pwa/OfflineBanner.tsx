import { useEffect, useState } from 'react'
import { loadData } from '../../lib/data'

export function OfflineBanner() {
  const [offline, setOffline] = useState(() => !navigator.onLine)

  useEffect(() => {
    const goOnline = () => setOffline(false)
    const goOffline = () => setOffline(true)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])

  if (!offline) return null

  const { config } = loadData()
  return (
    <div
      role="status"
      className="border-b border-hairline bg-white px-4 py-1.5 text-center font-mono text-[11px] tracking-wide text-slate"
    >
      offline — data as of {config.ratesLastUpdated}
    </div>
  )
}
