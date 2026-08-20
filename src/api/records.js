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
 * 판정 결과 한 건 — 2026-08-20 실서버 실측 형태 (FE-HANDOFF-2-0820.md 4장).
 * 명세에 없지만 서버가 더 주는 것 둘: `revertable` · 응답의 `checkinId`.
 */
const resultOf = (it) => ({
  itemId: it.itemId,
  name: it.name,
  frequency: it.frequency ?? null, // 빈도를 받는 항목만 온다
  verdict: it.verdict,
  reason: it.reason ?? null,
  evidenceLevel: it.evidenceLevel ?? 'medium', // high · medium · low · none
  floor: it.floor ?? 'optional', // essential · recommended · optional · excluded
  floorApplied: false,
  reverted: false,
  /* 되돌리기 버튼을 띄울지 서버가 정해서 내려준다.
     excluded 와 이미 되돌린 것은 false 다. */
  revertable: it.verdict !== 'excluded',
  excludedBy: it.excludedBy ?? null, // excluded 일 때만
  noteSent: null, // clinicNote 일 때만
  daysLeft: null, // clinicNote 일 때만
})

/** 판정 응답 본문 — 실측 형태 그대로 */
const evaluation = (items, filter = []) => ({
  evaluationId: 'ev_01M0E7W23P66VHRWFRZE74WFYV',
  checkinId: 'ck_01M0E7W1BR11J63TKXZNFVRG0C',
  createdAt: new Date().toISOString(),
  state: 'low',
  judgeStrength: 'high',
  filter,
  /* AI 를 아직 안 붙여서 서버는 지금 항상 fallback 을 준다 */
  generatedBy: 'fallback',
  /* ⚠️ summary 는 필터를 걸어도 **전체 기준**이다.
     필터 화면에서도 오늘 전체 그림이 보여야 하기 때문. */
  summary: summaryOf(ROUTINE_ITEMS),
  results: items.map(resultOf),
})

/**
 * NOW-SUB-001 · POST /subtract/evaluate — 덜어내기 판정.
 *
 * 클리닉 안내가 생활 제안보다 앞선다. reason 은 서버가 만든 문장이라
 * **프론트에서 절대 지어내지 않는다** (브랜드명·의학적 단정 검사가 서버에만 있다).
 *
 * 앞 단계가 없으면 서버가 막는다 — 상태 체크 없으면 409 NO_CHECKIN,
 * 관리 항목 3개 미만이면 400 MIN_ITEMS_REQUIRED.
 * 어떤 경우에도 **빈 결과를 200 으로 돌려주지 않는다.**
 */
export function evaluateSubtract(checkinId) {
  return call('NOW-SUB-001', {
    body: { checkinId },
    mock: () => ok(evaluation(ROUTINE_ITEMS)),
  })
}

/**
 * NOW-SUB-002 · GET /subtract/result — 같은 판정 다시 보기.
 * verdict 를 쉼표로 이어 거를 수 있다(`?verdict=reduce,skip`).
 * 모르는 값을 주면 서버가 400 을 낸다 — 조용히 무시하면 오타를 못 잡는다.
 */
export function getSubtractResult(verdict) {
  const on = verdict && verdict !== 'all'
  const list = on ? ROUTINE_ITEMS.filter((i) => i.verdict === verdict) : ROUTINE_ITEMS
  return call('NOW-SUB-002', {
    query: on ? { verdict } : undefined,
    mock: () => ok(evaluation(list, on ? [verdict] : [])),
  })
}

/**
 * NOW-SUB-003 · POST /subtract/{itemId}/revert — 판정 되돌리기.
 *
 * **evaluationId 를 반드시 같이 보낸다.** 안 보내면 400 이고, 하루에 두 번 판정했을 때
 * 화면이 보고 있는 판정과 서버가 고르는 판정이 어긋난다.
 *
 * 응답은 **해당 항목과 갱신된 summary 만** 온다. 점수식이 항목별로 독립이라
 * 다른 항목에 영향이 없으므로 목록 전체를 다시 그리지 않는다.
 * `persisted: true` 는 다음 판정에서도 그 항목을 keep 으로 기억한다는 뜻이다.
 * 판정 제외 항목은 서버가 CANNOT_REVERT_EXCLUDED(409) 로 막는다.
 */
export function revertSubtract(itemId, evaluationId) {
  return call('NOW-SUB-003', {
    path: `/subtract/${itemId}/revert`,
    body: { evaluationId },
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
