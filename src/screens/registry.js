/**
 * 화면 목록. 피그마 시안의 화면 코드(A01, B01 …)를 기준으로 한다.
 * 라우팅과 개발용 화면 목록이 이 배열 하나에서 생성된다.
 *
 * 시안이 나온 화면은 router.jsx의 REAL 맵에 컴포넌트를 등록하고,
 * 아직 안 나온 화면은 자동으로 StubScreen이 뜬다.
 *
 *   code : 피그마 화면 코드
 *   kind : 'required'(필수) | 'optional'(선택)
 *   links: 골격 상태에서 이동해볼 관련 화면
 */
export const SCREENS = [
  // ── A·B 인증 ────────────────────────────
  { path: '/', key: 'login', code: 'A01', title: '로그인', kind: 'required',
    links: ['/auth/email'] },
  { path: '/auth/email', key: 'authEmail', code: 'B01', title: '이메일 입력', kind: 'required',
    links: ['/auth/password'] },
  { path: '/auth/password', key: 'authPassword', code: 'B02', title: '비밀번호 설정', kind: 'required',
    links: ['/auth/verify'] },
  { path: '/auth/verify', key: 'authVerify', code: 'B03', title: '이메일 인증', kind: 'required',
    links: ['/onboarding/care-items'] },

  // ── C 온보딩 ────────────────────────────
  { path: '/onboarding/care-items', key: 'careItems', code: 'C01', title: '관리 항목 선택', kind: 'required',
    links: ['/check'] },

  // ── D 데일리 체크 ───────────────────────
  { path: '/check', key: 'condition', code: 'D01', title: '오늘 컨디션', kind: 'required',
    links: ['/check/analyzing'] },
  { path: '/check/analyzing', key: 'analyzing', code: 'D02', title: '케어 분석 중', kind: 'required',
    links: ['/home'] },

  // ── E 첫 발자국 · 홈 ────────────────────
  { path: '/home', key: 'home', code: 'E01', title: '홈', kind: 'required',
    links: ['/first-step', '/check'] },
  { path: '/first-step/intro', key: 'firstStepIntro', code: 'E01', title: '첫 발자국 소개', kind: 'required',
    links: ['/first-step', '/home'] },
  { path: '/first-step', key: 'firstStepList', code: 'E01', title: '첫 발자국 목록', kind: 'required',
    links: ['/home'] },

  // ── 아직 시안 없음 (와이어프레임 단계) ───
  { path: '/subtract', key: 'subtract', title: '덜어내기', kind: 'required', links: ['/home'] },
  { path: '/coach', key: 'coach', title: '케어 코치', kind: 'required', links: ['/home'] },
  { path: '/settings', key: 'settings', title: '설정', kind: 'required', links: ['/home'] },
]
