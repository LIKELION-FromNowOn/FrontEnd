/**
 * 서버 에러 코드 — FE-HANDOFF-0819.md 4장 (백엔드 `ErrorCode` 열거형에서 추출).
 *
 * **여기 없는 문자열은 서버에서 나오지 않습니다.**
 * 화면에서 코드로 분기할 때 오타를 내면 조용히 안 걸리므로 반드시 이 상수를 쓴다.
 */
export const ERROR = {
  VALIDATION_FAILED: 'VALIDATION_FAILED', // 400
  UNAUTHORIZED: 'UNAUTHORIZED', // 401
  FORBIDDEN: 'FORBIDDEN', // 403
  NOT_FOUND: 'NOT_FOUND', // 404
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED', // 405
  RATE_LIMITED: 'RATE_LIMITED', // 429
  INTERNAL_ERROR: 'INTERNAL_ERROR', // 500
  MIN_ITEMS_REQUIRED: 'MIN_ITEMS_REQUIRED', // 400 관리 항목 최소 개수 미달
  ITEM_NOT_FOUND: 'ITEM_NOT_FOUND', // 404
  FREQUENCY_REQUIRED: 'FREQUENCY_REQUIRED', // 400 빈도 누락
  EVALUATION_NOT_FOUND: 'EVALUATION_NOT_FOUND', // 404
  ALREADY_REVERTED: 'ALREADY_REVERTED', // 409
  CANNOT_REVERT_EXCLUDED: 'CANNOT_REVERT_EXCLUDED', // 409 판정 제외는 되돌릴 수 없음
  RECOMMENDATION_PAUSED: 'RECOMMENDATION_PAUSED', // 409
  LLM_UNAVAILABLE: 'LLM_UNAVAILABLE', // 503 폴백 결과가 같이 온다
  /* 400 — 자유 입력에서 위기 문구가 감지되면 **AI 를 부르기 전에** 서버가 막는다.
     예전처럼 「응답을 다시 만든다」가 아니라 그 입력이 통째로 거절된 것이다. */
  TEXT_REJECTED: 'TEXT_REJECTED', // 400 위기 문구 감지 — 입력 거절

  NO_CHECKIN: 'NO_CHECKIN', // 409 상태 체크를 먼저

  /**
   * 인증 · 프로필 · 상태 전환 — 2026-08-20 백엔드 전달분.
   *
   * 앞의 셋(가입·로그인)은 **화면이 아직 목이고 실측도 안 했다.**
   * 확인하려면 실제 계정을 만들어야 해서 전달받은 값을 그대로 적었다.
   * 뒤의 넷은 실서버로 확인했다 — 응답 코드까지 아래 주석과 같다.
   */
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS', // 409 이미 가입된 이메일
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS', // 401 이메일·비밀번호 불일치
  USER_NOT_FOUND: 'USER_NOT_FOUND', // 404 없는 사용자
  NO_FIELDS: 'NO_FIELDS', // 400 PATCH /me 에 고칠 값이 없음 (실측)
  GUEST_FORBIDDEN: 'GUEST_FORBIDDEN', // 403 게스트가 못 하는 일 (실측)
  CHECKIN_NOT_FOUND: 'CHECKIN_NOT_FOUND', // 404 없는 checkinId (실측)
  NO_PROPOSAL: 'NO_PROPOSAL', // 409 제안된 전환이 없음 — 이미 답했을 때도 이것 (실측)

  /**
   * 오늘의 행동 4종 — 2026-08-20 배포분에서 확정된 것(백엔드 「지금 배포본이 확정본」).
   *
   * ⚠️ NO_EVALUATION 은 한 번 뺐다가 되살렸다.
   *    GET /subtract/result 처럼 판정 「결과 조회」가 없을 때는 EVALUATION_NOT_FOUND(404)이고,
   *    GET /today 처럼 판정을 「아직 안 한」 상태는 NO_EVALUATION(409)이다.
   *    둘은 다른 상황이라 둘 다 들고 있어야 한다.
   *
   * ⚠️ NO_EVALUATION(409) 과 `data: null`(200) 도 다르다.
   *    409 는 덜어내기를 아직 안 한 것 → 덜어내기로 보낸다.
   *    200 + data:null 은 판정은 했는데 남은 후보가 없는 것 → 첫 발자국 카드로 보낸다.
   */
  NO_EVALUATION: 'NO_EVALUATION', // 409 GET /today — 덜어내기를 먼저
  ALREADY_COMPLETED: 'ALREADY_COMPLETED', // 409 이미 완료한 행동
  REROLL_LIMIT: 'REROLL_LIMIT', // 429 오늘 다시 받기 한도(하루 3회)
  ACTION_NOT_FOUND: 'ACTION_NOT_FOUND', // 404 행동을 찾을 수 없음

  /* TIMER_ALREADY_RUNNING 은 뺐다 — 서버가 보내지 않는다(2026-08-20 백엔드 확인).
     명세서에만 있던 값이라 방어해 둘 이유가 없다. */
}

/**
 * 화면에 띄울 기본 문구.
 *
 * 서버도 message 를 같이 주므로 원칙은 **서버 문장을 그대로 쓰는 것**이다.
 * 이 표는 서버 문장이 비어 있을 때만 쓰는 대비책이다.
 */
export const ERROR_TEXT = {
  [ERROR.VALIDATION_FAILED]: '입력한 내용을 다시 확인해 주세요',
  [ERROR.UNAUTHORIZED]: '다시 로그인해 주세요',
  [ERROR.FORBIDDEN]: '접근할 수 없는 항목이에요',
  [ERROR.NOT_FOUND]: '찾을 수 없어요',
  [ERROR.RATE_LIMITED]: '잠시 후에 다시 시도해 주세요',
  [ERROR.INTERNAL_ERROR]: '잠시 후에 다시 시도해 주세요',
  [ERROR.MIN_ITEMS_REQUIRED]: '관리 항목을 조금 더 골라주세요',
  [ERROR.ITEM_NOT_FOUND]: '항목을 찾을 수 없어요',
  [ERROR.FREQUENCY_REQUIRED]: '선택한 항목의 빈도를 골라주세요',
  [ERROR.EVALUATION_NOT_FOUND]: '먼저 덜어내기를 해주세요',
  [ERROR.METHOD_NOT_ALLOWED]: '잠시 후에 다시 시도해 주세요',
  [ERROR.NO_CHECKIN]: '오늘 컨디션을 먼저 알려주세요',
  [ERROR.ALREADY_REVERTED]: '이미 되돌린 항목이에요',
  [ERROR.CANNOT_REVERT_EXCLUDED]: '앱이 판단하지 않는 항목이라 되돌릴 수 없어요',
  [ERROR.RECOMMENDATION_PAUSED]: '지금은 추천을 쉬고 있어요',
  [ERROR.EMAIL_ALREADY_EXISTS]: '이미 가입된 이메일이에요',
  [ERROR.INVALID_CREDENTIALS]: '이메일이나 비밀번호를 다시 확인해 주세요',
  [ERROR.USER_NOT_FOUND]: '계정을 찾을 수 없어요',
  [ERROR.NO_FIELDS]: '바꿀 내용을 입력해 주세요',
  [ERROR.GUEST_FORBIDDEN]: '가입하시면 쓸 수 있어요',
  [ERROR.CHECKIN_NOT_FOUND]: '오늘 상태 체크를 찾을 수 없어요',
  /* 이미 답한 제안에 또 답해도 이것이 온다. 「없다」보다 「끝났다」에 가까운 문장으로 둔다. */
  [ERROR.NO_PROPOSAL]: '지금은 답할 제안이 없어요',
  [ERROR.LLM_UNAVAILABLE]: '준비된 내용으로 대신 보여드릴게요',
  [ERROR.NO_EVALUATION]: '먼저 덜어내기를 해주세요',
  [ERROR.ALREADY_COMPLETED]: '이미 완료한 행동이에요',
  [ERROR.REROLL_LIMIT]: '오늘은 더 바꿀 수 없어요',
  [ERROR.ACTION_NOT_FOUND]: '행동을 찾을 수 없어요',
  /* 위기 문구는 화면에서 사유를 자세히 적지 않는다. 서버 문장이 오면 그쪽을 그대로 쓴다. */
  [ERROR.TEXT_REJECTED]: '이 내용은 담아드리기 어려워요',
}

/** 화면에 띄울 문장 하나 — 서버 문장 우선, 없으면 기본 문구 */
export const errorText = (err) =>
  err?.message || ERROR_TEXT[err?.code] || '잠시 후에 다시 시도해 주세요'
