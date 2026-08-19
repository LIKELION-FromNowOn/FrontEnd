import { call, ok } from './client'
import {
  FIRST_STEP_CARDS,
  LOG_DAYS,
  LOG_SUMMARY,
  ROUTINE_ITEMS,
  VERDICT_LABEL,
} from '../screens/options'

/**
 * 덜어내기 판정 · 기록 · 첫 발자국 — NOW-SUB-001~003 · NOW-LOG-001~002 · NOW-STEP-001.
 * live.js 의 bundle 은 'subtract'(판정) · 'log'(기록·첫 발자국).
 */

const summaryOf = (items) =>
  items.reduce((acc, it) => ({ ...acc, [it.verdict]: (acc[it.verdict] ?? 0) + 1 }), {
    keep: 0,
    simplify: 0,
    reduce: 0,
    skip: 0,
    excluded: 0,
  })

/**
 * NOW-SUB-001 · POST /subtract/evaluate — 덜어내기 판정.
 *
 * 클리닉 안내가 생활 제안보다 앞선다. reason 은 서버가 만든 문장이라
 * **프론트에서 절대 지어내지 않는다** (브랜드명·의학적 단정 검사가 서버에만 있다).
 * 상태 체크가 없으면 서버가 NO_CHECKIN 으로 막는다.
 */
export function evaluateSubtract() {
  return call('NOW-SUB-001', {
    mock: () =>
      ok({
        evaluationId: 'ev_01H8X',
        items: ROUTINE_ITEMS,
        summary: summaryOf(ROUTINE_ITEMS),
        evaluatedAt: new Date().toISOString(),
      }),
  })
}

/** NOW-SUB-002 · GET /subtract/result — verdict 쿼리로 거를 수 있다 */
export function getSubtractResult(verdict) {
  const items =
    verdict && verdict !== 'all'
      ? ROUTINE_ITEMS.filter((i) => i.verdict === verdict)
      : ROUTINE_ITEMS
  return call('NOW-SUB-002', {
    query: verdict && verdict !== 'all' ? { verdict } : undefined,
    mock: () =>
      ok({ evaluationId: 'ev_01H8X', items, summary: summaryOf(ROUTINE_ITEMS) }),
  })
}

/**
 * NOW-SUB-003 · POST /subtract/{itemId}/revert — 판정 되돌리기.
 *
 * 서버는 **해당 항목과 갱신된 summary 만** 돌려준다. 점수식이 항목별로 독립이라
 * 다른 항목에 영향이 없으므로 목록 전체를 다시 그리지 않는다.
 * persisted: true 는 다음 판정에서도 그 항목을 keep 으로 기억한다는 뜻이다.
 * 판정 제외 항목은 서버가 CANNOT_REVERT_EXCLUDED(409) 로 막는다.
 */
export function revertSubtract(itemId) {
  return call('NOW-SUB-003', {
    path: `/subtract/${itemId}/revert`,
    mock: () => {
      const next = ROUTINE_ITEMS.map((i) =>
        i.itemId === itemId ? { ...i, verdict: 'keep' } : i,
      )
      return ok({ itemId, verdict: 'keep', persisted: true, summary: summaryOf(next) })
    },
  })
}

/** NOW-LOG-001 · GET /logs — 완료한 행동만 기간별로. 달성률·연속일 필드가 없다. */
export function getLogs({ from, to } = {}) {
  return call('NOW-LOG-001', {
    query: from && to ? { from, to } : undefined,
    mock: () => ok({ days: LOG_DAYS }),
  })
}

/** NOW-LOG-002 · GET /logs/summary — 건수와 분포만. 분모를 계산하지 않는다. */
export function getLogSummary(period = 'week') {
  return call('NOW-LOG-002', {
    query: { period },
    mock: () => ok({ period, ...LOG_SUMMARY }),
  })
}

/**
 * NOW-STEP-001 · GET /footsteps — 사례 8건을 상세까지 한 번에.
 * 별도 상세 API(NOW-STEP-002)는 명세서에서 제외됐다.
 * 익명화 사례만 오고 이름·성과·좋아요 수는 오지 않는다.
 */
export function getFootsteps({ context, categoryId } = {}) {
  return call('NOW-STEP-001', {
    query:
      context || categoryId
        ? { ...(context && { context }), ...(categoryId && { categoryId }) }
        : undefined,
    mock: () =>
      ok({
        footsteps: FIRST_STEP_CARDS.map((c) => ({
          id: c.id,
          categoryId: 'care',
          categoryName: '피부·홈케어',
          title: c.quote,
          who: c.who,
          situation: c.situation,
          firstStep: c.firstStep,
          nextSteps: c.nextSteps,
          quote: c.quote,
        })),
        onboardingIds: FIRST_STEP_CARDS.slice(0, 4).map((c) => c.id),
        total: FIRST_STEP_CARDS.length,
      }),
  })
}

/** 판정 라벨은 화면 여러 곳에서 쓰므로 여기서도 내보낸다 */
export { VERDICT_LABEL }
