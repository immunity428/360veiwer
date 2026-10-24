import { useState } from 'react';
import { ModalShell } from './ModalShell';
import { Pin } from './Pin';
import { assetUrl } from '@/lib/spots';
import type { Area, Seat } from '@/types/spots';

interface Props {
  area: Area;
  onClose: () => void;
  onSeatSelect: (seat: Seat) => void;
}

// 拡大マップ画像の縦横比（1920×1080）
const MAP_ASPECT = 16 / 9;

// 拡大マップ画像はこのモーダルを開いたときに初めて読み込まれる
export function AreaMapModal({ area, onClose, onSeatSelect }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <ModalShell
      eyebrow='エリア詳細マップ'
      title={area.label}
      onClose={onClose}
      size='lg'
    >
      {area.description && (
        <p className='px-4 pt-3 text-xs leading-relaxed text-white/60 sm:text-sm'>
          {area.description}
        </p>
      )}

      {area.detailMap && !failed ? (
        // 画面の高さに収まる幅に制限して、地図全体が見切れずに表示されるようにする
        // （ヘッダー・説明文・座席ボタンの分として約240pxを引いている）
        <div
          className='relative mx-auto mt-3 flex-shrink-0 overflow-hidden rounded-lg bg-black/40'
          style={{
            width: `min(calc(100% - 1.5rem), calc((94dvh - 240px) * ${MAP_ASPECT}))`,
          }}
        >
          {!loaded && (
            <div className='flex aspect-[16/9] w-full items-center justify-center'>
              <div className='h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent' />
            </div>
          )}
          <img
            src={assetUrl(area.detailMap)}
            alt={`${area.label}の拡大マップ`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            draggable={false}
            className={
              loaded ? 'block w-full select-none' : 'absolute h-0 w-0 opacity-0'
            }
          />
          {loaded &&
            area.seats.map((seat, i) => (
              <Pin
                key={seat.id}
                label={seat.label}
                x={seat.x}
                y={seat.y}
                variant='seat'
                pending={!seat.panorama}
                index={i + 1}
                onClick={() => onSeatSelect(seat)}
              />
            ))}
        </div>
      ) : (
        <div className='mx-3 mt-3 flex aspect-[16/7] flex-col items-center justify-center gap-2 rounded-lg bg-black/30 text-sm text-white/40 sm:mx-4'>
          <span className='text-3xl' aria-hidden='true'>
            🗺️
          </span>
          <span>
            {failed
              ? '拡大マップを読み込めませんでした'
              : '拡大マップは準備中です'}
          </span>
          <span className='text-xs'>下の一覧から座席を選べます</span>
        </div>
      )}

      {area.detailMapCredit && area.detailMap && !failed && (
        <p className='px-4 pt-1 text-right text-[10px] text-white/30'>
          {area.detailMapCredit}
        </p>
      )}

      {/* 座席一覧（スマホでピンが小さいときの代替） */}
      <div className='px-4 pb-4 pt-3'>
        <p className='mb-2 text-[11px] text-white/40'>
          座席を選ぶと360°で景色を確認できます
        </p>
        {area.seats.length === 0 ? (
          <p className='text-xs text-white/40'>座席は準備中です</p>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {area.seats.map((seat, i) => (
              <button
                key={seat.id}
                type='button'
                onClick={() => onSeatSelect(seat)}
                className='flex items-center gap-1.5 rounded-full border border-white/10 bg-night/60 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-gold hover:text-white'
              >
                {/* スマホ：地図の番号ピンと対応する番号 ／ PC：色の点 */}
                <span
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[9px] font-bold leading-none sm:hidden ${seat.panorama ? 'bg-gold text-night' : 'border border-gold/60 text-gold'}`}
                >
                  {i + 1}
                </span>
                <span
                  className={`hidden h-2 w-2 flex-shrink-0 rounded-full sm:block ${seat.panorama ? 'bg-gold' : 'border border-gold/60'}`}
                />
                {seat.label}
                {!seat.panorama && (
                  <span className='text-[10px] text-white/35'>準備中</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </ModalShell>
  );
}
