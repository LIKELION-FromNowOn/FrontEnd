/**
 * 화면 14개 레지스트리 (계획서 roles_0811 기준).
 * 라우팅·탭바·stub 화면이 전부 이 목록 하나에서 생성된다.
 * 디자인/기능이 완성되는 화면은 `element`를 실제 컴포넌트로 교체하면 됨.
 *
 *   tab   : 하단 탭바에 노출 (오늘·기록·예정·마이). 순서는 order로.
 *   kind  : 'required'(필수 11) | 'optional'(선택 3)
 *   links : stub에서 눌러 이동할 관련 화면 경로 (골격 네비게이션용)
 */
export const SCREENS = [
  // ── 탭 화면 4개 ─────────────────────────────
  { path: '/', key: 'today', title: '오늘', tab: '오늘', order: 0, kind: 'required',
    links: ['/checkin', '/why', '/subtract', '/coach'] },
  { path: '/records', key: 'records', title: '기록', tab: '기록', order: 1, kind: 'required',
    links: ['/timer'] },
  { path: '/upcoming', key: 'upcoming', title: '예정', tab: '예정', order: 2, kind: 'optional',
    links: ['/items'] },
  { path: '/my', key: 'my', title: '마이', tab: '마이', order: 3, kind: 'required',
    links: ['/items', '/weekly'] },

  // ── push 화면 (탭바 없음) ─────────────────────
  { path: '/onboarding', key: 'onboarding', title: '온보딩 · 첫 발자국', kind: 'required',
    links: ['/'] },
  { path: '/checkin', key: 'checkin', title: '오늘 상태 점검', kind: 'required',
    links: ['/why'] },
  { path: '/why', key: 'why', title: '왜 지금 이것인가', kind: 'required',
    links: ['/evidence', '/subtract'] },
  { path: '/subtract', key: 'subtract', title: '덜어내기', kind: 'required',
    links: ['/evidence'] },
  { path: '/evidence', key: 'evidence', title: '근거 보기', kind: 'required',
    links: ['/guide'] },
  { path: '/guide', key: 'guide', title: '안내문 원문', kind: 'required',
    links: [] },
  { path: '/coach', key: 'coach', title: '케어 코치', kind: 'required',
    links: ['/timer'] },
  { path: '/timer', key: 'timer', title: '타이머', kind: 'required',
    links: ['/records'] },
  { path: '/weekly', key: 'weekly', title: '주간 리뷰', kind: 'optional',
    links: ['/records'] },
  { path: '/items', key: 'items', title: '관리 항목 고르기', kind: 'optional',
    links: ['/my'] },
]

export const TABS = SCREENS
  .filter((s) => s.tab)
  .sort((a, b) => a.order - b.order)
