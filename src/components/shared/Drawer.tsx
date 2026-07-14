import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface DrawerProps {
  label: string
  kicker?: string
  header: ReactNode
  onClose: () => void
  children: ReactNode
}

/**
 * Right-side detail drawer: backdrop, slide-in panel, Escape/backdrop close,
 * focus moved to the close button on open and restored on close.
 */
export function Drawer({ label, kicker, header, onClose, children }: DrawerProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previous = document.activeElement
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous instanceof HTMLElement) previous.focus()
    }
  }, [onClose])

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-ink/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={label}
        data-testid="country-drawer"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-hairline bg-paper shadow-drawer"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.26, ease: 'easeOut' }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-hairline bg-white p-5">
          <div className="min-w-0">
            {kicker && (
              <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ultramarine">
                {kicker}
              </p>
            )}
            {header}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="rounded-chip border border-hairline p-2 text-slate hover:text-ink"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        <div className="flex-1 space-y-7 overflow-y-auto p-5">{children}</div>
      </motion.aside>
    </>
  )
}
