// spots.json の内容チェック。`npm run build` の直前に自動で実行されます。
// エラーがあるとビルドが止まるので、壊れたデータが本番に出ることはありません。
//   手動で実行: npm run check
import { readFileSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = join(root, 'public')
const jsonPath = join(root, 'src/data/spots.json')

const MAX_BYTES = 25 * 1024 * 1024 // Cloudflare Pages の1ファイル上限
const WARN_BYTES = 10 * 1024 * 1024

const errors = []
const warnings = []
const err = (where, msg) => errors.push(`  ✖ ${where}: ${msg}`)
const warn = (where, msg) => warnings.push(`  ⚠ ${where}: ${msg}`)

let data
try {
  data = JSON.parse(readFileSync(jsonPath, 'utf8'))
} catch (e) {
  console.error(`✖ spots.json を読み込めません（カンマや括弧の抜けを確認してください）\n  ${e.message}`)
  process.exit(1)
}

const isPercent = (v) => typeof v === 'number' && v >= 0 && v <= 100

function checkImage(where, path, { required = false, panorama = false } = {}) {
  if (path === null || path === undefined) {
    if (required) err(where, '画像のパスが必要です')
    return
  }
  if (typeof path !== 'string' || path.startsWith('/')) {
    err(where, `"${path}" は public/ からの相対パスで書いてください（例: images/areas/foo.jpg）`)
    return
  }
  const file = join(publicDir, path)
  if (!existsSync(file)) {
    err(where, `public/${path} が見つかりません`)
    return
  }
  const size = statSync(file).size
  const mb = (size / 1024 / 1024).toFixed(1)
  if (size > MAX_BYTES) err(where, `${mb}MB あります。25MBを超えるとデプロイできません`)
  else if (panorama && size > WARN_BYTES) warn(where, `${mb}MB あります。表示が遅くなるので圧縮を推奨します`)
}

const ids = new Map()
function checkId(where, id) {
  if (typeof id !== 'string' || !/^[a-z0-9-]+$/.test(id)) {
    err(where, `id "${id}" は英小文字・数字・ハイフンのみで書いてください`)
  } else if (ids.has(id)) {
    err(where, `id "${id}" が ${ids.get(id)} と重複しています`)
  } else {
    ids.set(id, where)
  }
}

checkImage('map.image', data.map?.image, { required: true })

if (!Array.isArray(data.areas) || data.areas.length === 0) {
  err('areas', 'エリアが1つもありません')
}

let seatCount = 0
let noPanorama = 0
let noTicket = 0

for (const [i, area] of (data.areas ?? []).entries()) {
  const a = `areas[${i}]（${area.label ?? area.id}）`
  checkId(a, area.id)
  if (!area.label) err(a, 'label が空です')
  if (!isPercent(area.x) || !isPercent(area.y)) err(a, 'x / y は 0〜100 の数値で書いてください')
  checkImage(`${a}.detailMap`, area.detailMap)
  if (!Array.isArray(area.seats)) {
    err(a, 'seats は配列で書いてください（座席がなければ []）')
    continue
  }
  if (area.seats.length === 0) warn(a, '座席が登録されていません')

  for (const [j, seat] of area.seats.entries()) {
    const s = `${a} > seats[${j}]（${seat.label ?? seat.id}）`
    seatCount++
    checkId(s, seat.id)
    if (!seat.label) err(s, 'label が空です')
    if (!isPercent(seat.x) || !isPercent(seat.y)) err(s, 'x / y は 0〜100 の数値で書いてください')

    if (seat.panorama === null) noPanorama++
    else checkImage(`${s}.panorama`, seat.panorama, { panorama: true })

    if (seat.ticketUrl === null) noTicket++
    else if (typeof seat.ticketUrl !== 'string' || !seat.ticketUrl.startsWith('https://')) {
      err(s, 'ticketUrl は https:// から始まるURLか null にしてください')
    }

    const v = seat.view ?? {}
    if (v.pitch !== undefined && !(v.pitch >= -90 && v.pitch <= 90)) err(s, 'view.pitch は -90〜90 です')
    if (v.yaw !== undefined && !(v.yaw >= -180 && v.yaw <= 180)) err(s, 'view.yaw は -180〜180 です')
    if (v.hfov !== undefined && !(v.hfov >= 30 && v.hfov <= 120)) err(s, 'view.hfov は 30〜120 です')
  }
}

console.log(`spots.json: ${data.areas?.length ?? 0} エリア / ${seatCount} 座席`)
if (noPanorama) console.log(`  ・360°画像が未設定の座席: ${noPanorama}（「撮影準備中」と表示されます）`)
if (noTicket) console.log(`  ・チケットURLが未設定の座席: ${noTicket}（購入ボタンは表示されません）`)
if (warnings.length) console.log(['\n注意:', ...warnings].join('\n'))
if (errors.length) {
  console.error(['\nエラー:', ...errors].join('\n'))
  process.exit(1)
}
console.log('✔ チェックOK')
