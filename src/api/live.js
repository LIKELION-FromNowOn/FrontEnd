/**
 * 엔드포인트별 실연동 스위치.
 *
 * 백엔드가 슬랙 backend 에 「이 묶음 됐습니다」를 올리면 해당 줄의 live 를 true 로 바꾼다.
 * 그 줄만 실제 서버를 부르고 나머지는 계속 목으로 돈다. 전역 스위치 하나로 두면
 * 서버에 1건밖에 없는 지금 상태에서 켜는 순간 화면이 전부 깨지기 때문이다.
 *
 * key 는 API 명세서의 API ID 다.
 * ⚠️ 기능 명세서의 ID와는 번호가 다르다(36건 중 30건 불일치). 여기 것은 **API 명세서** 기준이고,
 *    헷갈리면 ID 대신 아래 method + path 로 이야기하는 편이 안전하다.
 *
 * bundle 은 요구사항 명세서의 전달 묶음이다. 묶음째로 켜면 된다 — setBundleLive('auth') 참고.
 */
const ep = (bundle, method, path, name) => ({ bundle, method, path, name, live: false })

export const ENDPOINTS = {
  // ── 요구사항 No.14 · 인증·관리항목·상태·프로필 13건 (송원석) ──
  /* ✅ 2026-08-19 실서버 실측 완료 — 지금 살아 있는 유일한 API (FE-HANDOFF-0819.md).
     PM 문서의 `postAuthGuest` 가 이 줄입니다. */
  'NOW-AUTH-001': {
    ...ep('auth', 'POST', '/auth/guest', '게스트 세션 발급'),
    live: true,
  },
  /* ⚠️ 가입·로그인은 경로가 살아 있는데도 켜지 않는다 — 2026-08-20 실측 이유가 있다.
     **서버가 비밀번호를 받는다.** 명세서에는 없는 값이다.
       POST /auth/signup {} → 400 "이메일 · 비밀번호 · 닉네임을 확인해 주세요"
     요청 본문은 서버에 맞춰 뒀지만(api/auth.js) 성공 응답을 못 봤고,
     비밀번호가 들어오면 화면 흐름(B02 비밀번호 설정)도 같이 정해야 한다.
     명세서와 서버 중 어느 쪽이 맞는지 확인되면 그때 이 두 줄을 켠다. */
  'NOW-AUTH-002': ep('auth', 'POST', '/auth/signup', '회원 등록'),
  'NOW-AUTH-003': ep('auth', 'POST', '/auth/login', '로그인'),
  /* ✅ 2026-08-20 실측 — { loggedOut: true }. 계정 없이 확인할 수 있는 유일한 인증 건이었다. */
  'NOW-AUTH-004': { ...ep('auth', 'POST', '/auth/logout', '로그아웃'), live: true },
  /* ✅ 2026-08-20 실측 — { userId, userType, name, email, currentState,
     recommendationPaused, itemCount, hasCheckin }. 아직 부르는 화면은 없다. */
  'NOW-AUTH-005': { ...ep('auth', 'GET', '/me', '내 정보 조회'), live: true },
  /* ✅ 2026-08-20 백엔드가 실서버 목록에 넣었다. 게스트로 부르면 403 GUEST_FORBIDDEN 이라
     성공 응답은 못 봤지만, 부르는 화면이 아직 없어서 켜 두어도 깨질 것이 없다.
     프로필 화면을 붙일 때 응답을 보고 목을 맞춘다. */
  'NOW-MY-001': { ...ep('auth', 'PATCH', '/me', '프로필 수정'), live: true },
  /* ✅ 2026-08-20 배포 — 관리 항목 3건(조회·직접 입력·삭제)이 켜졌다.
     PUT 은 원래 배포분이지만 아래 덜어내기 흐름의 첫 단계라 같이 켠다.
     ⚠️ 직접 입력 항목은 PUT 으로 저장하면 400 이다. POST /me/items/custom · DELETE 로만 다룬다. */
  'NOW-ITEM-001': { ...ep('auth', 'GET', '/me/items', '내 항목 조회'), live: true },
  'NOW-ITEM-002': { ...ep('auth', 'PUT', '/me/items', '내 항목 저장'), live: true },
  'NOW-ITEM-003': {
    ...ep('auth', 'POST', '/me/items/custom', '직접 입력 항목 추가'),
    live: true,
  },
  'NOW-ITEM-004': {
    ...ep('auth', 'DELETE', '/me/items/{itemId}', '항목 삭제'),
    live: true,
  },
  /* ✅ 2026-08-20 — 켠다. 전에 미뤄뒀던 이유(징후 id 가 없어 signalScore 가 조용히 0)는
     GET /signals 를 같이 켜면서 없어졌다. 실측으로 sig_04·sig_01·sig_13 을 보내면
     signalScore 7 (임계값 5) 로 오고 전환 제안도 뜬다.
     ⚠️ 징후는 반드시 **id** 로 보낸다. 이름을 보내면 오류 없이 0 점이 된다. */
  'NOW-STATE-001': { ...ep('auth', 'POST', '/checkins', '상태 체크 제출'), live: true },
  /* 판정(POST /subtract/evaluate)이 checkinId 를 요구해서(400 VALIDATION_FAILED)
     덜어내기 화면이 이걸 먼저 부른다. 2026-08-20 실측으로 정상 동작 확인. */
  'NOW-STATE-002': {
    ...ep('auth', 'GET', '/checkins/latest', '최근 상태 조회'),
    live: true,
  },
  /* ✅ 2026-08-20 실측 — checkinId 가 필수다(없으면 400).
     수락·거절에 따라 응답이 다르고, 거절 유예는 일수가 아니라 시각으로 온다. api/me.js 참고. */
  'NOW-STATE-003': {
    ...ep('auth', 'POST', '/state/transition', '상태 전환 응답'),
    live: true,
  },

  /* ── 요구사항 No.19 · 마스터 3건 (김민정) ──
     ✅ 2026-08-20 실측 — 셋 다 살아 있고 시드도 들어가 있다(카테고리 7 · 항목 32 · 징후 14).
     배포 안내의 「8개」 목록에는 없었지만 확인해 보니 이미 도는 상태였다.

     이걸 켜야 하는 이유가 있다. PUT /me/items 는 **마스터의 itemId** 를 받는다.
     항목 이름을 보내면 400 VALIDATION_FAILED(`items[n].itemId — must not be blank`) 다.
     즉 마스터가 목이면 관리 항목 저장부터 안 되고, 그 뒤 판정·오늘의 행동이 통째로 막힌다. */
  'NOW-MASTER-001': {
    ...ep('master', 'GET', '/categories', '카테고리 조회'),
    live: true,
  },
  'NOW-MASTER-002': {
    ...ep('master', 'GET', '/care-items', '관리 항목 마스터 조회'),
    live: true,
  },
  'NOW-MASTER-003': { ...ep('master', 'GET', '/signals', '이상 징후 조회'), live: true },

  /* ── 요구사항 No.26 · 덜어내기 판정 3건 (송원석) ──
     ✅ 2026-08-20 배포 — 앞 단계가 붙어서 이제 성공 응답이 온다.
     흐름: 게스트 → PUT /me/items(3개 이상) → POST /checkins → evaluate → result → revert → GET /today
     AI 가 실제 근거 문장을 쓴다. 응답의 generatedBy 가 'llm' 으로 온다(예전엔 늘 'fallback'). */
  'NOW-SUB-001': {
    ...ep('subtract', 'POST', '/subtract/evaluate', '덜어내기 판정'),
    live: true,
  },
  'NOW-SUB-002': {
    ...ep('subtract', 'GET', '/subtract/result', '판정 결과 조회'),
    live: true,
  },
  'NOW-SUB-003': {
    ...ep('subtract', 'POST', '/subtract/{itemId}/revert', '판정 되돌리기'),
    live: true,
  },
  /* ✅ 2026-08-20 신설 — 기록 탭 H03 이 쓴다.
     백엔드는 「아직 배포 전」이라고 했는데 실측해 보니 이미 돌고 있다.
     ⚠️ API ID 는 우리가 붙인 임시값이다. 명세서에 이 건이 아직 없다. */
  'NOW-SUB-004': {
    ...ep('subtract', 'GET', '/subtract/history', '판정 기록 조회'),
    live: true,
  },

  // ── 요구사항 No.1 · 오늘·안내문·홈 11건 (김민정) ──
  /* ✅ 2026-08-20 배포 — 오늘의 행동 5건이 켜졌다.
     ⚠️ durationSec 을 화면 상수로 두지 않는다. 항목마다 다르다(헬스장 3600 · 물 마시기 420).
     ⚠️ 판정 전에 부르면 409 NO_EVALUATION, 후보가 없으면 200 에 data: null 이다. */
  'NOW-TODAY-001': { ...ep('today', 'GET', '/today', '오늘의 행동 조회'), live: true },
  'NOW-TODAY-002': {
    ...ep('today', 'POST', '/today/reroll', '다른 행동 요청'),
    live: true,
  },
  'NOW-TODAY-003': { ...ep('today', 'POST', '/today/start', '타이머 시작'), live: true },
  'NOW-TODAY-004': { ...ep('today', 'POST', '/today/complete', '완료 처리'), live: true },
  'NOW-TODAY-005': {
    ...ep('today', 'POST', '/today/reject', '거절 사유 기록'),
    live: true,
  },
  /* ✅ 2026-08-20 실측 — 관리 맥락 2건 · 예정 3건이 살아 있다.
     「목으로 두실 것」 목록에 있었지만 실제로는 돕니다(마스터 때와 같은 상황).
     PUT 에 noteLines · cautions[].keywords 를 실어 보내는 것이 이번 변경의 핵심이다. */
  'NOW-NOTE-001': { ...ep('today', 'GET', '/me/care', '관리 맥락 조회'), live: true },
  'NOW-NOTE-002': { ...ep('today', 'PUT', '/me/care', '관리 맥락 저장'), live: true },
  'NOW-NOTE-004': { ...ep('today', 'GET', '/me/plans', '예정 목록 조회'), live: true },
  'NOW-NOTE-005': { ...ep('today', 'POST', '/me/plans', '예정 추가'), live: true },
  'NOW-NOTE-006': {
    ...ep('today', 'DELETE', '/me/plans/{planId}', '예정 삭제'),
    live: true,
  },
  /* ⚠️ 아직 404 NOT_FOUND 다 — 경로 자체가 없다 (2026-08-20 실측). */
  'NOW-HOME-001': ep('today', 'GET', '/home', '홈 집계 조회'),

  /* ── 요구사항 No.27 · 첫 발자국·기록 3건 (김민정) ──
     ✅ 첫 발자국은 살아 있고 응답 형태가 목과 그대로 맞는다(2026-08-20 실측).
     ⚠️ 기록 2건은 아직 404 NOT_FOUND 다 — 경로가 없다. */
  'NOW-STEP-001': { ...ep('log', 'GET', '/footsteps', '첫 발자국 조회'), live: true },
  /* ⚠️ 명세는 2026-08-20 에 확정됐지만 **아직 404 다**(실측). 확정과 배포는 다른 일이라
     응답 형태만 목에 맞춰 두고 스위치는 그대로 둔다. 배포되면 이 두 줄만 켜면 된다. */
  'NOW-LOG-001': ep('log', 'GET', '/logs', '기록 조회'),
  'NOW-LOG-002': ep('log', 'GET', '/logs/summary', '기록 요약 조회'),

  /* ── 요구사항 No.28 · 안내문 원문 1건 (송원석) ──
     ✅ 살아 있다. PUT /me/care 의 noteLines 가 여기 lines 로 그대로 나온다. */
  'NOW-NOTE-003': {
    ...ep('note', 'GET', '/me/care/note', '안내문 원문 조회'),
    live: true,
  },

  /* ── 요구사항 No.29 · 케어 코치·안전 2건 (송원석) ──
     ✅ 코치는 살아 있다. 안내문 keywords 로 근거를 찾아 답한다.
     ✅ 안전 검사도 살아 있다(2026-08-20 실측). 부르는 화면은 없지만 켜 둔다 —
     단독으로 부를 일이 생겼을 때 목이 섞여 들어가지 않게. 자유 입력 5개 엔드포인트는
     어차피 서버 내부에서 이 검사를 먼저 거친다. */
  'NOW-SAFE-001': {
    ...ep('safety', 'POST', '/safety/check', '위기 신호 검사'),
    live: true,
  },
  'NOW-COACH-001': {
    ...ep('safety', 'POST', '/coach/ask', '케어 코치 질의'),
    live: true,
  },

  // NOW-STEP-002 (GET /footsteps/{id}) 는 명세서에서 제외됐다.
  // 사례가 8건뿐이라 NOW-STEP-001이 상세까지 한 번에 내려준다.
}

/** 이 API를 실제 서버로 부를지 */
export const isLive = (apiId) => ENDPOINTS[apiId]?.live === true

/** 묶음째 켜기 — 백엔드가 「인증 13건 됐습니다」 하면 setBundleLive('auth') */
export function setBundleLive(bundle, on = true) {
  for (const e of Object.values(ENDPOINTS)) {
    if (e.bundle === bundle) e.live = on
  }
}

/** 지금 몇 개가 실연동인지 — 콘솔에서 확인용 */
export function liveCount() {
  const all = Object.values(ENDPOINTS)
  return { live: all.filter((e) => e.live).length, total: all.length }
}
