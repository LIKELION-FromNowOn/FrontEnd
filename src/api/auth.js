import { call, ok } from './client'
import { clearSession, getSession, setSession } from './session'

/**
 * 인증 API — API 명세서 NOW-AUTH-001 ~ 005 · NOW-MY-001.
 *
 * 명세서의 인증에는 **비밀번호도, 인증코드도, 구글 로그인도 없다.**
 *   게스트로 시작 → (원하면) 이메일+닉네임으로 가입 → 이후 이메일만으로 로그인
 * 계정 키는 이메일이고 화면에 보이는 것은 닉네임이다. 실명은 받지 않는다.
 *
 * ⚠️ 화면 B01~B03(비밀번호 설정·이메일 인증)은 명세서에 없는 흐름이다.
 *    팀 확인 전까지 화면은 그대로 두고, 여기서는 명세서에 있는 것만 만들어 둔다.
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
  return data
}

/**
 * NOW-AUTH-002 · POST /auth/signup — 회원 등록.
 * 게스트로 쓰던 중이면 guestToken 을 같이 보내 그동안의 데이터를 계정으로 옮긴다.
 */
export async function signup({ email, nickname }) {
  const guestToken = getSession()?.userType === 'guest' ? getSession().token : undefined

  const data = await call('NOW-AUTH-002', {
    body: { email, nickname, ...(guestToken ? { guestToken } : null) },
    mock: () =>
      ok({
        token: 'eyJhbGciOiJIUzI1NiJ9.mock-member',
        userType: 'member',
        name: nickname,
      }),
  })
  setSession(data)
  return data
}

/** NOW-AUTH-003 · POST /auth/login — 이메일만으로 로그인 */
export async function login({ email }) {
  const data = await call('NOW-AUTH-003', {
    body: { email },
    mock: () =>
      ok({
        token: 'eyJhbGciOiJIUzI1NiJ9.mock-member',
        userType: 'member',
        name: '예니',
      }),
  })
  setSession(data)
  return data
}

/**
 * NOW-AUTH-004 · POST /auth/logout.
 * 서버가 stateless 라 실제로 지워야 하는 것은 이쪽 토큰이다.
 * 서버 호출이 실패해도 로컬 세션은 반드시 지운다 — 안 지우면 로그아웃이 안 된 것처럼 보인다.
 */
export async function logout() {
  try {
    await call('NOW-AUTH-004', { mock: () => ok(null) })
  } finally {
    clearSession()
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
        name: '예니',
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
    mock: () => ok({ name: nickname ?? '예니', email: email ?? null }),
  })
}

/** 앱 진입 시 — 세션이 없으면 게스트로 시작한다 */
export async function ensureSession() {
  return getSession() ?? (await startGuest())
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
