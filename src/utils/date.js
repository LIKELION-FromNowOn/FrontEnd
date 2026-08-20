/**
 * 날짜 다루기.
 *
 * 서버는 날짜를 늘 `YYYY-MM-DD` 로 준다. 시안은 「8월 18일」로 적는다.
 * **그 사이를 바꾸는 건 화면 몫이다** — 서버가 사람이 읽을 문구를 만들어 주지 않는다
 * (2026-08-20 백엔드 확인). 그래서 여기 한 곳에만 둔다.
 */

/** Date → `YYYY-MM-DD`. 서버가 이 형식만 받는다(다르면 400). */
export const ymd = (d) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/**
 * `2026-08-18` → `8월 18일`.
 *
 * 형식이 다르면 **받은 값을 그대로 돌려준다.** 날짜처럼 안 생긴 것을 억지로 해석하면
 * 엉뚱한 날이 화면에 뜬다 — 차라리 원문이 보이는 편이 알아채기 쉽다.
 * 연도는 붙이지 않는다. 기록 탭은 이번 주·이번 달만 보는 화면이라 시안에도 없다.
 */
export function formatDay(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso ?? ''))
  if (!m) return iso ?? ''
  return `${Number(m[2])}월 ${Number(m[3])}일`
}
