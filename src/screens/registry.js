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
  {
    path: '/login',
    key: 'login',
    code: 'A01',
    title: '로그인',
    kind: 'required',
    links: ['/auth/email'],
  },
  {
    path: '/auth/email',
    key: 'authEmail',
    code: 'B01',
    title: '이메일 입력',
    kind: 'required',
    links: ['/auth/password'],
  },
  {
    path: '/auth/password',
    key: 'authPassword',
    code: 'B02',
    title: '비밀번호 설정',
    kind: 'required',
    /* 이메일 인증(B03)은 범위 밖이라 흐름에서 뺐다.
       이미 가입한 계정이면 이 화면 안에서 로그인으로 바뀐다. */
    links: [],
  },
  {
    path: '/auth/verify',
    key: 'authVerify',
    code: 'B03',
    title: '이메일 인증',
    kind: 'required',
    links: ['/onboarding/care-items'],
  },

  // ── C 온보딩 ────────────────────────────
  {
    path: '/onboarding/care-items',
    key: 'careItems',
    code: 'C01',
    title: '관리 항목 선택',
    kind: 'required',
    links: ['/check'],
  },

  // ── D 데일리 체크 ───────────────────────
  {
    path: '/check',
    key: 'condition',
    code: 'D01',
    title: '오늘 컨디션',
    kind: 'required',
    links: ['/check/analyzing'],
  },
  {
    path: '/check/analyzing',
    key: 'analyzing',
    code: 'D02',
    title: '케어 분석 중',
    kind: 'required',
    links: ['/home'],
  },
  {
    path: '/condition',
    key: 'conditionHub',
    code: 'F_WeeklyCondition',
    title: '오늘의 컨디션',
    kind: 'required',
    tab: true,
    links: ['/check', '/onboarding/care-items'],
  },

  // ── F 홈 · 첫 발자국 (탭) ───────────────
  {
    path: '/home',
    key: 'home',
    code: 'F01',
    title: '홈',
    kind: 'required',
    tab: true,
    links: ['/first-step', '/check'],
  },
  {
    path: '/first-step/intro',
    key: 'firstStepIntro',
    code: 'E01',
    title: '첫 발자국 소개',
    kind: 'required',
    tab: true,
    links: ['/first-step', '/home'],
  },
  {
    path: '/first-step',
    key: 'firstStepList',
    code: 'F02',
    title: '첫 발자국 목록',
    kind: 'required',
    tab: true,
    links: ['/first-step/detail'],
  },
  {
    path: '/first-step/detail',
    key: 'firstStepDetail',
    code: 'F03',
    title: '첫 발자국 상세',
    kind: 'required',
    tab: true,
    links: ['/home'],
  },
  {
    path: '/first-step/manage',
    key: 'firstStepManage',
    code: 'F_FirstStepManage',
    title: '내 첫 발자국 관리',
    kind: 'required',
    tab: true,
    links: ['/first-step', '/care/start'],
  },
  {
    path: '/character',
    key: 'characterIntro',
    code: 'F_CharacterIntro',
    title: '캐릭터 소개',
    kind: 'optional',
    tab: true,
    links: ['/home'],
  },

  // ── G 덜어내기 (탭) ─────────────────────
  {
    path: '/reduce',
    key: 'reduceIntro',
    code: 'G01',
    title: '덜어내기',
    kind: 'required',
    tab: true,
    links: ['/reduce/result'],
  },
  {
    path: '/reduce/result',
    key: 'reduceResult',
    code: 'G02',
    title: '덜어내기 결과',
    kind: 'required',
    tab: true,
    links: ['/reduce/record'],
  },
  {
    path: '/reduce/record',
    key: 'reduceRecord',
    code: 'G02',
    title: '덜어내기 기록',
    kind: 'required',
    tab: true,
    links: ['/home'],
  },

  // ── I 마이 (탭) ─────────────────────────
  {
    path: '/my',
    key: 'my',
    code: 'I01',
    title: '마이',
    kind: 'required',
    tab: true,
    links: ['/my/profile', '/my/notifications'],
  },
  {
    path: '/my/nickname',
    key: 'editNickname',
    title: '닉네임 수정',
    kind: 'required',
    tab: true,
    links: ['/my'],
  },
  {
    path: '/my/profile',
    key: 'profileSettings',
    code: 'I02',
    title: '프로필 설정',
    kind: 'required',
    tab: true,
    links: ['/my/nickname'],
  },
  {
    path: '/my/notifications',
    key: 'notificationSettings',
    code: 'I03',
    title: '알림 설정',
    kind: 'required',
    tab: true,
    links: ['/my'],
  },
  {
    path: '/my/guide',
    key: 'serviceGuide',
    code: 'I04',
    title: '서비스 안내',
    kind: 'required',
    tab: true,
    links: ['/my'],
  },
  {
    path: '/my/contact',
    key: 'contact',
    code: 'I05',
    title: '문의하기',
    kind: 'required',
    tab: true,
    links: ['/my'],
  },

  // ── 시안 없이 API 명세만으로 구현한 화면 ──
  // 기존 색·간격 토큰만 써서 짰다. 시안이 나오면 값만 갈아끼우면 된다.
  // ── H 기록 (탭) ─────────────────────────
  {
    path: '/records',
    key: 'records',
    code: 'H01',
    title: '기록',
    kind: 'required',
    tab: true,
    links: ['/records/condition', '/records/reductions'],
  },
  {
    path: '/records/condition',
    key: 'recordCondition',
    code: 'H02',
    title: '이번 주 컨디션',
    kind: 'required',
    tab: true,
    links: ['/check'],
  },
  {
    path: '/records/reductions',
    key: 'reductionHistory',
    code: 'H03',
    title: '최근 덜어내기 기록',
    kind: 'required',
    tab: true,
    links: ['/reduce/record'],
  },
  {
    path: '/care/start',
    key: 'careStart',
    title: '케어 시작',
    kind: 'required',
    links: ['/records', '/home'],
  },
  {
    path: '/coach',
    key: 'coach',
    title: '케어 코치',
    kind: 'required',
    tab: true,
    links: ['/home'],
  },
]
