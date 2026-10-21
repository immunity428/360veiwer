import raw from '@/data/spots.json'
import type { SpotsData, ViewParams } from '@/types/spots'

// spots.json はビルド時にコードへ組み込まれる（実行時の fetch なし）
export const spots = raw as unknown as SpotsData

export const DEFAULT_VIEW: ViewParams = { pitch: 0, yaw: 0, hfov: 100 }

/** spots.json に書いた public/ からのパスを URL に変換する */
export function assetUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
