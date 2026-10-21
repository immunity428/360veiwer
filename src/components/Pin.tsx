interface Props {
  label: string
  x: number
  y: number
  variant: 'area' | 'seat'
  /** 360°画像が未撮影の座席 */
  pending?: boolean
  onClick: () => void
}

// ピンの中心が (x%, y%) に来るように配置する
export function Pin({ label, x, y, variant, pending, onClick }: Props) {
  const tone =
    variant === 'area'
      ? 'bg-brand text-white hover:bg-brand-dark text-[11px] sm:text-sm px-2.5 sm:px-3.5 py-1 sm:py-1.5'
      : pending
        ? 'bg-night/80 text-gold ring-gold/60 text-[10px] sm:text-xs px-2 py-0.5 sm:py-1'
        : 'bg-gold text-night hover:bg-yellow-300 text-[10px] sm:text-xs px-2 py-0.5 sm:py-1'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={pending ? `${label}（撮影準備中）` : label}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95 focus:outline-none focus-visible:scale-110"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <span
        className={`block whitespace-nowrap rounded-full font-bold leading-snug shadow-md shadow-black/40 ring-1 ring-white/20 transition-colors ${tone}`}
      >
        {label}
      </span>
    </button>
  )
}
