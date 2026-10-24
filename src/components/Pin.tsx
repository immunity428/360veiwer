interface Props {
  label: string;
  x: number;
  y: number;
  variant: 'area' | 'seat';
  /** 360°画像が未撮影の座席 */
  pending?: boolean;
  /** 座席の通し番号。スマホではラベルの代わりにこの番号の丸ピンを表示する */
  index?: number;
  onClick: () => void;
}

// ピンの中心が (x%, y%) に来るように配置する
export function Pin({ label, x, y, variant, pending, index, onClick }: Props) {
  const color =
    variant === 'area'
      ? 'bg-brand text-white hover:bg-brand-dark'
      : pending
        ? 'bg-night/80 text-gold ring-gold/60'
        : 'bg-gold text-night hover:bg-yellow-300';
  const size =
    variant === 'area'
      ? 'text-[11px] sm:text-sm px-2.5 sm:px-3.5 py-1 sm:py-1.5'
      : 'text-[10px] sm:text-xs px-2 py-0.5 sm:py-1';
  // スマホでは座席を小さな番号ピンにして、密集しても重ならないようにする
  const compact = variant === 'seat' && index !== undefined;

  return (
    <button
      type='button'
      onClick={onClick}
      aria-label={pending ? `${label}（撮影準備中）` : label}
      title={label}
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95 focus:outline-none focus-visible:scale-110 ${compact ? 'p-1 sm:p-0' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {compact && (
        <span
          className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold leading-none shadow shadow-black/40 ring-1 ring-white/60 sm:hidden ${color}`}
        >
          {index}
        </span>
      )}
      <span
        className={`${compact ? 'hidden sm:block' : 'block'} whitespace-nowrap rounded-full font-bold leading-snug shadow-md shadow-black/40 ring-1 ring-white/20 transition-colors ${color} ${size}`}
      >
        {label}
      </span>
    </button>
  );
}
