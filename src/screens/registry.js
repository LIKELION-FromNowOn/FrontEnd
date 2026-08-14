/**
 * 화면 목록. 피그마 시안의 화면 코드(A01, B01, F01 …)를 기준으로 한다.
 * 라우팅이 이 배열 하나에서 생성된다.
 *
 * 시안이 나온 화면은 router.jsx의 REAL 맵에 컴포넌트를 등록하고,
 * 아직 안 나온 화면은 자동으로 StubScreen이 뜬다.
 *
 *   tab  : true면 하단 4탭 레이아웃 아래에 놓인다
 *   kind : 'required'(필수) | 'optional'(선택)
 */
export const SCREENS = [
  // ── A·B 인증 (탭바 없음) ────────────────
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

  // ── F 홈 · 첫 발자국 (탭) ───────────────
  { path: '/home', key: 'home', code: 'F01', title: '홈', kind: 'required', tab: true,
    links: ['/first-step', '/check'] },
  { path: '/first-step', key: 'firstStepList', code: 'F02', title: '첫 발자국 목록', kind: 'required', tab: true,
    links: ['/first-step/detail'] },
  { path: '/first-step/detail', key: 'firstStepDetail', code: 'F03', title: '첫 발자국 상세', kind: 'required', tab: true,
    links: ['/home'] },

  // ── G 덜어내기 (탭) ─────────────────────
  { path: '/reduce', key: 'reduceIntro', code: 'G01', title: '덜어내기', kind: 'required', tab: true,
    links: ['/reduce/result'] },
  { path: '/reduce/result', key: 'reduceResult', code: 'G02', title: '덜어내기 결과', kind: 'required', tab: true,
    links: ['/reduce/record'] },
  { path: '/reduce/record', key: 'reduceRecord', code: 'G02', title: '덜어내기 기록', kind: 'required', tab: true,
    links: ['/home'] },

  // ── 아직 시안 없음 ──────────────────────
  { path: '/records', key: 'records', title: '기록', kind: 'required', tab: true, links: ['/home'] },
  { path: '/my', key: 'my', title: '마이', kind: 'required', tab: true, links: ['/home'] },
  { path: '/care/start', key: 'careStart', title: '케어 시작', kind: 'required', links: ['/home'] },
  { path: '/coach', key: 'coach', title: '케어 코치', kind: 'required', links: ['/home'] },
]
