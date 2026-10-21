import { useEffect, type ReactNode } from 'react'

interface Props {
  eyebrow: string
  title: string
  onClose: () => void
  onBack?: () => void
  backLabel?: string
  size?: 'md' | 'lg'
  children: ReactNode
}

// 閉じるのは × ボタンのみ（背景クリック・Escでは閉じない）
export function ModalShell({ eyebrow, title, onClose, onBack, backLabel, size = 'md', children }: Props) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const width = size === 'lg' ? 'max-w-6xl' : 'max-w-3xl'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`flex max-h-[94dvh] w-full ${width} animate-fade-up flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl shadow-black/70`}>
        <div className="flex flex-shrink-0 items-center justify-between gap-3 bg-gradient-to-r from-brand to-brand-dark px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            {onBack && (
              <>
                <button
                  type="button"
                  onClick={onBack}
                  className="flex flex-shrink-0 items-center gap-1 text-xs text-white/75 transition-colors hover:text-white"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  {backLabel ?? '戻る'}
                </button>
                <span className="text-white/30" aria-hidden="true">|</span>
              </>
            )}
            <div className="min-w-0">
              <p className="mb-0.5 text-[10px] uppercase tracking-widest text-white/60">{eyebrow}</p>
              <p className="truncate text-base font-bold text-white sm:text-lg">{title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-lg text-white transition-colors hover:bg-white/30"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
