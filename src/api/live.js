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
  'NOW-AUTH-001': { ...ep('auth', 'POST', '/auth/guest', '게스트 세션 발급'), live: false },
  'NOW-AUTH-002': ep('auth', 'POST', '/auth/signup', '회원 등록'),
  'NOW-AUTH-003': ep('auth', 'POST', '/auth/login', '로그인'),
  'NOW-AUTH-004': ep('auth', 'POST', '/auth/logout', '로그아웃'),
  'NOW-AUTH-005': ep('auth', 'GET', '/me', '내 정보 조회'),
  'NOW-MY-001': ep('auth', 'PATCH', '/me', '프로필 수정'),
  'NOW-ITEM-001': ep('auth', 'GET', '/me/items', '내 항목 조회'),
  'NOW-ITEM-002': ep('auth', 'PUT', '/me/items', '내 항목 저장'),
  'NOW-ITEM-003': ep('auth', 'POST', '/me/items/custom', '직접 입력 항목 추가'),
  'NOW-ITEM-004': ep('auth', 'DELETE', '/me/items/{itemId}', '항목 삭제'),
  'NOW-STATE-001': ep('auth', 'POST', '/checkins', '상태 체크 제출'),
  'NOW-STATE-002': ep('auth', 'GET', '/checkins/latest', '최근 상태 조회'),
  'NOW-STATE-003': ep('auth', 'POST', '/state/transition', '상태 전환 응답'),

  // ── 요구사항 No.19 · 마스터 3건 (김민정) ──
  'NOW-MASTER-001': ep('master', 'GET', '/categories', '카테고리 조회'),
  'NOW-MASTER-002': ep('master', 'GET', '/care-items', '관리 항목 마스터 조회'),
  'NOW-MASTER-003': ep('master', 'GET', '/signals', '이상 징후 조회'),

  // ── 요구사항 No.26 · 덜어내기 판정 3건 (송원석) ──
  'NOW-SUB-001': ep('subtract', 'POST', '/subtract/evaluate', '덜어내기 판정'),
  'NOW-SUB-002': ep('subtract', 'GET', '/subtract/result', '판정 결과 조회'),
  'NOW-SUB-003': ep('subtract', 'POST', '/subtract/{itemId}/revert', '판정 되돌리기'),

  // ── 요구사항 No.1 · 오늘·안내문·홈 11건 (김민정) ──
  'NOW-TODAY-001': ep('today', 'GET', '/today', '오늘의 행동 조회'),
  'NOW-TODAY-002': ep('today', 'POST', '/today/reroll', '다른 행동 요청'),
  'NOW-TODAY-003': ep('today', 'POST', '/today/start', '타이머 시작'),
  'NOW-TODAY-004': ep('today', 'POST', '/today/complete', '완료 처리'),
  'NOW-TODAY-005': ep('today', 'POST', '/today/reject', '거절 사유 기록'),
  'NOW-NOTE-001': ep('today', 'GET', '/me/care', '관리 맥락 조회'),
  'NOW-NOTE-002': ep('today', 'PUT', '/me/care', '관리 맥락 저장'),
  'NOW-NOTE-004': ep('today', 'GET', '/me/plans', '예정 목록 조회'),
  'NOW-NOTE-005': ep('today', 'POST', '/me/plans', '예정 추가'),
  'NOW-NOTE-006': ep('today', 'DELETE', '/me/plans/{planId}', '예정 삭제'),
  'NOW-HOME-001': ep('today', 'GET', '/home', '홈 집계 조회'),

  // ── 요구사항 No.27 · 첫 발자국·기록 3건 (김민정) ──
  'NOW-STEP-001': ep('log', 'GET', '/footsteps', '첫 발자국 조회'),
  'NOW-LOG-001': ep('log', 'GET', '/logs', '기록 조회'),
  'NOW-LOG-002': ep('log', 'GET', '/logs/summary', '기록 요약 조회'),

  // ── 요구사항 No.28 · 안내문 원문 1건 (송원석) ──
  'NOW-NOTE-003': ep('note', 'GET', '/me/care/note', '안내문 원문 조회'),

  // ── 요구사항 No.29 · 케어 코치·안전 2건 (송원석) ──
  'NOW-SAFE-001': ep('safety', 'POST', '/safety/check', '위기 신호 검사'),
  'NOW-COACH-001': ep('safety', 'POST', '/coach/ask', '케어 코치 질의'),

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
