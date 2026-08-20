import { call, ok } from './client'
import { clearSession, getSession, setSession } from './session'
import { forgetMe } from './useMe'
import { MIN_CARE_ITEMS } from '../screens/options'

/**
 * 인증 API — API 명세서 NOW-AUTH-001 ~ 005 · NOW-MY-001.
 *
 * ⚠️ **명세서와 서버가 다르다 — 서버는 비밀번호를 받는다** (2026-08-20 실측).
 *      POST /auth/signup {} → 400 "이메일 · 비밀번호 · 닉네임을 확인해 주세요"
 *      POST /auth/login  {} → 400 "이메일 형식이 올바르지 않습니다"
 *      오류 코드에도 INVALID_CREDENTIALS(401 이메일·비밀번호 불일치)가 있다.
 *    명세서는 「게스트 → 이메일+닉네임 가입 → 이메일만으로 로그인」이라 비밀번호가 없다.
 *    서버 쪽이 나중이므로 요청 본문은 서버에 맞춰 두었고, **확인 요청해 둔 상태다.**
 *    그래서 signup·login 은 아직 실연동으로 켜지 않는다(live.js 참고).
 *
 * 계정 키는 이메일이고 화면에 보이는 것은 닉네임이다. 실명은 받지 않는다.
 *
 * ⚠️ 화면 B01~B03(비밀번호 설정·이메일 인증)은 명세서에 없는 흐름인데,
 *    서버가 비밀번호를 받는다면 B02 는 오히려 필요한 화면이 된다. 같이 확인 중이다.
 *
 * mock 값은 명세서의 응답 예시와 같은 모양으로 맞춰 두었다.
 * live.js 의 해당 줄을 true 로 바꾸면 그대로 서버 응답으로 대체된다.
 */

/**
 * NOW-AUTH-001 · POST /auth/guest — 게스트 세션 발급.
 *
 * 8/18 기준 서버에서 유일하게 살아 있는 API 다. 가장 먼저 붙일 자리.
 * 게스트도 기능 제한이 없다(접근성을 낮추기 위한 결정).
 */
export async function startGuest() {
  const data = await call('NOW-AUTH-001', {
    /* 실서버 실측과 같은 모양. 유효기간 30일 (핸드오프 2장). */
    mock: () =>
      ok({
        token: 'eyJhbGciOiJIUzI1NiJ9.mock-guest',
        userType: 'guest',
        expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      }),
  })
  setSession(data)
  forgetMe()
  return data
}

/**
 * NOW-AUTH-002 · POST /auth/signup — 회원 등록 (201).
 *
 * ★ **guestToken 을 반드시 같이 보낸다.**
 *   게스트로 고른 관리 항목·상태 체크·판정이 새 계정으로 넘어간다.
 *   안 보내면 빈 계정이 만들어지고 그때까지 한 것이 전부 날아간다.
 *   응답의 migrated 가 true 면 넘어간 것이다 (2026-08-21 백엔드 실측 확인).
 *
 * 400 VALIDATION_FAILED  비밀번호 8~64자 · 닉네임 필수 · 이메일 형식
 * 409 EMAIL_ALREADY_EXISTS  이미 등록된 이메일
 */
export async function signup({ email, password, nickname }) {
  const guestToken = getSession()?.userType === 'guest' ? getSession().token : undefined

  const data = await call('NOW-AUTH-002', {
    body: { email, password, nickname, ...(guestToken ? { guestToken } : null) },
    mock: () =>
      ok({
        token: 'eyJhbGciOiJIUzI1NiJ9.mock-member',
        userType: 'member',
        migrated: Boolean(guestToken),
      }),
  })
  setSession(data)
  forgetMe()
  return data
}

/**
 * NOW-AUTH-003 · POST /auth/login — 이메일 + 비밀번호.
 *
 * ⚠️ **틀린 이유를 갈라서 보여주지 않는다.** 없는 계정이든 비밀번호가 틀렸든
 *    서버가 똑같이 401 INVALID_CREDENTIALS 를 준다 — 갈라서 알려주면
 *    「이 이메일은 가입돼 있다」를 확인시켜 주는 셈이라 가입자 목록을 만들 수 있다.
 *    화면 문구도 「이메일 또는 비밀번호가 올바르지 않습니다」 하나로 둔다.
 */
export async function login({ email, password }) {
  const data = await call('NOW-AUTH-003', {
    body: { email, password },
    mock: () =>
      ok({
        token: 'eyJhbGciOiJIUzI1NiJ9.mock-member',
        userType: 'member',
        name: null,
      }),
  })
  setSession(data)
  forgetMe()
  return data
}

/**
 * NOW-AUTH-004 · POST /auth/logout.
 * 서버가 stateless 라 실제로 지워야 하는 것은 이쪽 토큰이다.
 * 서버 호출이 실패해도 로컬 세션은 반드시 지운다 — 안 지우면 로그아웃이 안 된 것처럼 보인다.
 */
export async function logout() {
  try {
    /* 서버는 { loggedOut: true } 를 준다 (2026-08-20 실측). */
    await call('NOW-AUTH-004', { mock: () => ok({ loggedOut: true }) })
  } finally {
    clearSession()
    forgetMe()
  }
}

/**
 * NOW-AUTH-005 · GET /me — 내 정보 조회.
 * 온보딩 분기의 기준이다. hasCheckin 이 false 면 온보딩으로 보낸다.
 */
export function getMe() {
  return call('NOW-AUTH-005', {
    mock: () =>
      ok({
        userId: 'u_mock',
        userType: 'guest',
        /* 게스트는 서버가 name 을 null 로 준다. 이름을 지어 넣지 않는다. */
        name: null,
        email: null,
        currentState: 'normal',
        recommendationPaused: false,
        itemCount: 4,
        hasCheckin: true,
      }),
  })
}

/** NOW-MY-001 · PATCH /me — 닉네임·이메일 부분 수정. 실명은 받지 않는다. */
export function updateProfile({ nickname, email }) {
  return call('NOW-MY-001', {
    body: {
      ...(nickname ? { nickname } : null),
      ...(email ? { email } : null),
    },
    mock: () => ok({ name: nickname ?? null, email: email ?? null }),
  })
}

/** 앱 진입 시 — 세션이 없으면 게스트로 시작한다 */
export async function ensureSession() {
  return getSession() ?? (await startGuest())
}

/**
 * 인증·진입 뒤에 어느 화면으로 보낼지 (GET /me).
 *
 * 명세의 「매일 아침 하루 한 번만 묻는다. 앱을 열 때마다 묻지 않는다」(4차 회의 확정)를
 * 여기서 지킨다 — hasCheckin 이 true 면 오늘은 이미 물어본 것이라 다시 안 묻는다.
 * 푸시 알림으로 묻는 기능은 만들기로 한 적이 없다(서버에 푸시 준비가 없다).
 *
 *   항목이 최소 개수에 못 미치면  → 관리 항목 선택
 *   오늘 상태를 아직 안 물었으면  → 오늘 컨디션
 *   둘 다 됐으면                → 홈
 */
export async function nextScreen() {
  try {
    const me = await getMe()
    if ((me?.itemCount ?? 0) < MIN_CARE_ITEMS) return '/onboarding/care-items'
    if (!me?.hasCheckin) return '/check'
    return '/home'
  } catch {
    // 못 물어봤으면 처음부터 시작한다. 여기서 막히면 앱에 들어갈 수가 없다.
    return '/onboarding/care-items'
  }
}

/**
 * 구글 로그인 — **API 명세서에 없는 흐름이다.**
 *
 * A01 시안에 「구글로 계속하기」 버튼이 있어 화면은 남겨 두었지만, 명세서의 인증은
 * 게스트 → 이메일 가입 → 이메일 로그인 셋뿐이고 OAuth 엔드포인트가 없다.
 * 팀에서 「구글 로그인을 넣는다」로 정해지면 백엔드에 시작 엔드포인트를 요청하고
 * 여기서 그쪽으로 넘기면 된다. 그전까지는 서버를 부르지 않고 흐름만 이어 준다.
 *
 * TODO(팀 확인): 구글 로그인을 뺄지, 명세서에 추가할지.
 */
export function startGoogleLogin() {
  return { mocked: true, reason: 'API 명세서에 OAuth 엔드포인트가 없습니다' }
}
