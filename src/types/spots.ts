// src/data/spots.json の型。項目の意味は spots.schema.json を参照。

export interface ViewParams {
  pitch: number
  yaw: number
  hfov: number
}

export interface Seat {
  id: string
  label: string
  /** 拡大マップ上のピン位置（%） */
  x: number
  y: number
  description?: string
  /** 360°画像（public/ からのパス）。未撮影なら null */
  panorama: string | null
  ticketUrl: string | null
  view?: Partial<ViewParams>
}

export interface Area {
  id: string
  label: string
  /** 会場マップ上のピン位置（%） */
  x: number
  y: number
  description: string
  /** 拡大マップ画像（public/ からのパス）。未作成なら null */
  detailMap: string | null
  detailMapCredit?: string
  seats: Seat[]
}

export interface SpotsData {
  map: {
    image: string
    alt: string
    credit?: string
  }
  areas: Area[]
}
