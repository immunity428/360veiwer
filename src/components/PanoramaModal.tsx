import { useEffect, useRef, useState } from 'react';
import { ModalShell } from './ModalShell';
import { assetUrl, DEFAULT_VIEW } from '@/lib/spots';
import type { Area, Seat } from '@/types/spots';

interface PannellumViewer {
  destroy: () => void;
}
declare global {
  interface Window {
    pannellum?: {
      viewer: (
        container: HTMLElement,
        config: Record<string, unknown>,
      ) => PannellumViewer;
    };
  }
}

// Pannellum 本体は最初に360°ビューを開いたときだけ読み込む（初期表示を軽くするため）
let pannellumReady: Promise<void> | null = null;
function loadPannellum() {
  pannellumReady ??= Promise.all([
    import('pannellum/build/pannellum.css'),
    import('pannellum/build/pannellum.js'),
  ]).then(() => undefined);
  return pannellumReady;
}

interface Props {
  area: Area;
  seat: Seat;
  onBack: () => void;
  onClose: () => void;
}

export function PanoramaModal({ area, seat, onBack, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!seat.panorama || !containerRef.current) return;
    let viewer: PannellumViewer | null = null;
    let cancelled = false;
    setError(false);

    loadPannellum()
      .then(() => {
        if (cancelled || !containerRef.current || !window.pannellum) return;
        const view = { ...DEFAULT_VIEW, ...seat.view };
        viewer = window.pannellum.viewer(containerRef.current, {
          type: 'equirectangular',
          panorama: assetUrl(seat.panorama!),
          autoLoad: true,
          autoRotate: -2,
          compass: false,
          showZoomCtrl: true,
          showFullscreenCtrl: true,
          pitch: view.pitch,
          yaw: view.yaw,
          hfov: view.hfov,
          strings: {
            loadingLabel: '読み込み中...',
            loadButtonLabel: 'クリックして読み込む',
            loadError: '画像を読み込めませんでした',
            genericWebGLError: 'お使いの端末は360°表示に対応していません',
          },
        });
      })
      .catch(() => !cancelled && setError(true));

    return () => {
      cancelled = true;
      try {
        viewer?.destroy();
      } catch {
        /* noop */
      }
    };
  }, [seat]);

  return (
    <ModalShell
      eyebrow={`${area.label} ・ 360° View`}
      title={seat.label}
      onClose={onClose}
      onBack={onBack}
      backLabel='マップに戻る'
      size='screen'
    >
      {seat.panorama && !error ? (
        <div ref={containerRef} className='min-h-0 w-full flex-1 bg-black' />
      ) : (
        <div className='flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-2 bg-black text-sm text-white/40'>
          <span className='text-4xl' aria-hidden='true'>
            🌐
          </span>
          <span>
            {error
              ? '360°ビューアを読み込めませんでした'
              : 'この座席の360°写真は撮影準備中です'}
          </span>
        </div>
      )}

      <div className='flex flex-col gap-3 border-t border-white/10 px-4 py-3 sm:flex-row sm:items-center'>
        <div className='flex-1 text-xs leading-relaxed text-white/50'>
          {seat.description && (
            <p className='mb-1 text-white/70'>{seat.description}</p>
          )}
          {seat.panorama && <p>ドラッグ / スワイプで視点を動かせます</p>}
        </div>
        {seat.ticketUrl && (
          <a
            href={seat.ticketUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-night shadow-md shadow-black/30 transition-colors hover:bg-yellow-300'
          >
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              aria-hidden='true'
            >
              <path d='M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6' />
              <polyline points='16 2 22 2 22 8' />
              <line x1='11' y1='13' x2='22' y2='2' />
            </svg>
            チケットを購入する
          </a>
        )}
      </div>
    </ModalShell>
  );
}
