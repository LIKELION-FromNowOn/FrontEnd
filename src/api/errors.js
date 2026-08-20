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
  TEXT_REJECTED: 'TEXT_REJECTED', // 400 응답 재생성됨

  NO_CHECKIN: 'NO_CHECKIN', // 409 상태 체크를 먼저

  /**
   * 명세서에는 있는데 해당 API 가 아직 없어서 지금은 안 나오는 것.
   * 붙으면 나오므로 방어는 그대로 둔다.
   *
   * ⚠️ NO_EVALUATION 은 빼야 한다 — 판정 결과가 없을 때 서버가 내는 것은
   *    EVALUATION_NOT_FOUND(404) 다 (2026-08-20 실측).
   */
  TIMER_ALREADY_RUNNING: 'TIMER_ALREADY_RUNNING', // POST /today/start
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
  [ERROR.TIMER_ALREADY_RUNNING]: '이미 진행 중인 타이머가 있어요',
  [ERROR.LLM_UNAVAILABLE]: '준비된 내용으로 대신 보여드릴게요',
  [ERROR.TEXT_REJECTED]: '다시 만들어 볼게요',
}

/** 화면에 띄울 문장 하나 — 서버 문장 우선, 없으면 기본 문구 */
export const errorText = (err) =>
  err?.message || ERROR_TEXT[err?.code] || '잠시 후에 다시 시도해 주세요'
