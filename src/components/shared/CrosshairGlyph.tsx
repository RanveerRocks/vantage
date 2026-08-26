export function CrosshairGlyph({ size = 20, color = '#2440C9' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="6.5" stroke={color} strokeWidth="1.5" />
      <line x1="12" y1="1" x2="12" y2="5.5" stroke={color} strokeWidth="1.5" />
      <line x1="12" y1="18.5" x2="12" y2="23" stroke={color} strokeWidth="1.5" />
      <line x1="1" y1="12" x2="5.5" y2="12" stroke={color} strokeWidth="1.5" />
      <line x1="18.5" y1="12" x2="23" y2="12" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.75" fill="#B98A1F" />
    </svg>
  )
}
