import { useState } from 'react';
import { Pin } from '@/components/Pin';
import { AreaMapModal } from '@/components/AreaMapModal';
import { PanoramaModal } from '@/components/PanoramaModal';
import { spots, assetUrl } from '@/lib/spots';
import type { Area, Seat } from '@/types/spots';

export default function App() {
  const [area, setArea] = useState<Area | null>(null);
  const [seat, setSeat] = useState<Seat | null>(null);

  const openArea = (a: Area) => {
    setSeat(null);
    setArea(a);
  };
  const closeAll = () => {
    setSeat(null);
    setArea(null);
  };

  return (
    <div className='min-h-screen bg-night font-sans text-white'>
      <header className='relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-night to-[#12101e] px-4 py-8 text-center sm:py-10'>
        <div
          className='pointer-events-none absolute inset-0'
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 20% 50%,rgba(204,30,36,0.08) 0%,transparent 70%),radial-gradient(ellipse 60% 80% at 80% 50%,rgba(232,184,75,0.06) 0%,transparent 70%)',
          }}
        />
        <p className='mb-1.5 text-[11px] uppercase tracking-[0.2em] text-gold'>
          Suwa Lake Fireworks Festival
        </p>
        <h1 className='mb-1 text-2xl font-black leading-tight sm:text-4xl'>
          諏訪湖<span className='text-gold'>花火</span>大会
          <br className='sm:hidden' /> 会場マップ
        </h1>
        <p className='text-xs text-white/50 sm:text-sm'>
          チケットを買う前に、座席から見える景色を360°で確認できます
        </p>
      </header>

      <ol className='flex flex-wrap items-center justify-center gap-2 px-4 py-3 text-[11px] text-white/40'>
        <li className='rounded bg-white/5 px-2 py-0.5'>① エリアを選択</li>
        <li aria-hidden='true'>→</li>
        <li className='rounded bg-white/5 px-2 py-0.5'>② 座席を選択</li>
        <li aria-hidden='true'>→</li>
        <li className='rounded bg-white/5 px-2 py-0.5'>③ 360°で確認</li>
      </ol>

      <main className='mx-auto mb-8 max-w-6xl px-0 sm:px-4'>
        <div className='relative overflow-hidden border-y border-white/10 shadow-[0_0_60px_rgba(204,30,36,0.12)] sm:rounded-xl sm:border'>
          <img
            src={assetUrl(spots.map.image)}
            alt={spots.map.alt}
            className='block w-full select-none'
            draggable={false}
          />
          {spots.areas.map((a) => (
            <Pin
              key={a.id}
              label={a.label}
              x={a.x}
              y={a.y}
              variant='area'
              onClick={() => openArea(a)}
            />
          ))}
        </div>
        {spots.map.credit && (
          <p className='px-4 pt-1 text-right text-[10px] text-white/30 sm:px-0'>
            {spots.map.credit}
          </p>
        )}

        <div className='mt-4 flex flex-wrap gap-2 px-4 sm:px-0'>
          {spots.areas.map((a) => (
            <button
              key={a.id}
              type='button'
              onClick={() => openArea(a)}
              className='flex items-center gap-1.5 rounded-full border border-white/10 bg-surface px-3 py-1.5 text-[11px] text-white/60 transition-colors hover:border-brand hover:text-white'
            >
              <span className='h-2 w-2 flex-shrink-0 rounded-full bg-brand' />
              {a.label}
              <span className='text-white/30'>{a.seats.length}席</span>
            </button>
          ))}
        </div>
      </main>

      {area && !seat && (
        <AreaMapModal area={area} onClose={closeAll} onSeatSelect={setSeat} />
      )}
      {area && seat && (
        <PanoramaModal
          area={area}
          seat={seat}
          onBack={() => setSeat(null)}
          onClose={closeAll}
        />
      )}

      <footer className='border-t border-white/10 py-6 text-center text-xs text-white/30'>
        360°viwer
      </footer>
    </div>
  );
}
