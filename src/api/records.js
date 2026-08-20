import { call, ok } from './client'
import { getLatestCheckin } from './me'
import {
  CONDITIONS,
  FIRST_STEP_CARDS,
  LOG_ENTRIES,
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
  /* ✅ 2026-08-20 배포로 AI 가 붙었다. 실측 응답의 generatedBy 는 'llm' 이고
     reason 문장도 항목마다 다르게 온다. LLM 이 죽으면 'fallback' 으로 내려온다. */
  generatedBy: 'llm',
  /* ⚠️ summary 는 필터를 걸어도 **전체 기준**이다.
     필터 화면에서도 오늘 전체 그림이 보여야 하기 때문. */
  summary: summaryOf(ROUTINE_ITEMS),
  results: items.map(resultOf),
})

/**
 * 판정 기록 목 — 실측 형태 그대로 (2026-08-20).
 * 한 줄이 그날의 판정 한 건이다. 항목별 내용은 여기 없고 evaluationId 로 따로 가져온다.
 */
const SUBTRACT_HISTORY = [
  {
    evaluationId: 'ev_01M0E7W23P66VHRWFRZE74WFYV',
    date: '2026-08-20',
    state: 'low',
    summary: { keep: 2, simplify: 1, reduce: 1, skip: 0, excluded: 0 },
    generatedBy: 'llm',
  },
  {
    evaluationId: 'ev_01M0E7W23P66VHRWFRZE74WFYW',
    date: '2026-08-18',
    state: 'normal',
    summary: { keep: 3, simplify: 1, reduce: 0, skip: 0, excluded: 1 },
    generatedBy: 'llm',
  },
  {
    evaluationId: 'ev_01M0E7W23P66VHRWFRZE74WFYX',
    date: '2026-08-15',
    state: 'drained',
    summary: { keep: 1, simplify: 1, reduce: 2, skip: 1, excluded: 0 },
    generatedBy: 'fallback',
  },
]

/**
 * NOW-SUB-001 · POST /subtract/evaluate — 덜어내기 판정.
 *
 * 클리닉 안내가 생활 제안보다 앞선다. reason 은 서버가 만든 문장이라
 * **프론트에서 절대 지어내지 않는다** (브랜드명·의학적 단정 검사가 서버에만 있다).
 *
 * 앞 단계가 없으면 서버가 막는다 — 상태 체크 없으면 409 NO_CHECKIN,
 * 관리 항목 3개 미만이면 400 MIN_ITEMS_REQUIRED.
 * 어떤 경우에도 **빈 결과를 200 으로 돌려주지 않는다.**
 *
 * ⚠️ checkinId 는 **필수**다. 빼고 부르면 400 VALIDATION_FAILED
 *    (`checkinId — checkinId 가 필요합니다`) 다. 2026-08-20 실측.
 *    화면에서는 아래 evaluateLatest() 를 쓰면 된다.
 * ⚠️ 응답의 목록 키는 `results` 다. `items` 가 아니다.
 */
export function evaluateSubtract(checkinId) {
  return call('NOW-SUB-001', {
    body: { checkinId },
    mock: () => ok(evaluation(ROUTINE_ITEMS)),
  })
}

/**
 * 오늘 상태 체크를 먼저 찾아서 판정을 돌린다 (NOW-STATE-002 → NOW-SUB-001).
 *
 * 판정이 checkinId 를 요구하는데 덜어내기 화면은 상태 체크 화면과 이어져 있지 않다.
 * 화면끼리 값을 들고 다니면 새로고침 한 번에 끊기므로 서버에서 다시 찾는다.
 * 상태 체크를 아직 안 했으면 여기서 409 NO_CHECKIN 이 그대로 올라간다.
 */
export async function evaluateLatest() {
  const latest = await getLatestCheckin()
  return evaluateSubtract(latest?.checkinId)
}

/**
 * NOW-SUB-002 · GET /subtract/result — 판정 하나를 다시 보기.
 *
 *   verdict       쉼표로 이어 거를 수 있다(`?verdict=reduce,skip`).
 *                 모르는 값을 주면 서버가 400 을 낸다 — 조용히 무시하면 오타를 못 잡는다.
 *   evaluationId  **지난 판정**을 지정해서 본다. 기록 탭에서 한 건을 눌렀을 때 쓴다.
 *                 이걸 쓰면 판정을 새로 돌리지 않는다 — evaluateLatest 를 부르면
 *                 지난 기록을 보려다 오늘 판정이 새로 생긴다.
 */
export function getSubtractResult({ verdict, evaluationId } = {}) {
  const on = verdict && verdict !== 'all'
  const list = on ? ROUTINE_ITEMS.filter((i) => i.verdict === verdict) : ROUTINE_ITEMS
  const query = {
    ...(on && { verdict }),
    ...(evaluationId && { evaluationId }),
  }
  return call('NOW-SUB-002', {
    query: Object.keys(query).length ? query : undefined,
    mock: () => ok(evaluation(list, on ? [verdict] : [])),
  })
}

/**
 * NOW-SUB-004 · GET /subtract/history — 날짜별 판정 기록 (H03).
 *
 * ⚠️ API ID 는 우리가 붙인 임시값이다. 명세서에 이 건이 아직 없다(2026-08-20 신설).
 *
 * 응답 형태를 GET /logs 와 맞춰 놨다 — `total` · `hasMore` 까지 같다.
 * 그래서 기록 탭의 두 목록을 같은 방식으로 다룰 수 있다.
 *
 * 한 건의 자세한 내용은 getSubtractResult({ evaluationId }) 로 가져온다.
 *
 * 인자 (전부 선택):
 *   from · to  YYYY-MM-DD. 형식이 틀리거나 from > to 면 400 VALIDATION_FAILED
 *   limit      1~100, 기본 30. 벗어나면 400
 * 서버가 어디가 틀렸는지 message 에 적어 주므로 그 문장을 그대로 띄운다.
 */
export function getSubtractHistory({ from, to, limit } = {}) {
  const query = {
    ...(from && { from }),
    ...(to && { to }),
    ...(limit != null && { limit }),
  }

  return call('NOW-SUB-004', {
    query: Object.keys(query).length ? query : undefined,
    mock: () => ok({ history: SUBTRACT_HISTORY, total: SUBTRACT_HISTORY.length, hasMore: false }),
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

/**
 * NOW-LOG-001 · GET /logs — 완료한 행동만. 달성률·연속일 필드가 없다.
 *
 * 2026-08-20 확정 — 응답은 **평평한 배열**이다. 날짜로 묶여 오지 않는다.
 *   { logs: [{ logId, date, categoryId, categoryName, title, usedTimer }], total, hasMore }
 * date 는 `YYYY-MM-DD` 이고, 날짜별 묶기와 「8월 18일」 문구는 화면 몫이다
 * (groupLogsByDay · utils/date.js 의 formatDay).
 *
 * 인자 (전부 선택):
 *   from · to    YYYY-MM-DD
 *   categoryId   care · sleep · move · eat · mind · life · med (GET /categories 의 id)
 *   limit        1~100, 기본 30
 *
 * ⚠️ 서버는 아직 404 다(2026-08-20 실측). 명세는 확정됐지만 배포 전이라 목으로 돈다.
 */
export function getLogs({ from, to, categoryId, limit } = {}) {
  const query = {
    ...(from && { from }),
    ...(to && { to }),
    ...(categoryId && { categoryId }),
    ...(limit != null && { limit }),
  }

  return call('NOW-LOG-001', {
    query: Object.keys(query).length ? query : undefined,
    mock: () => ok({ logs: LOG_ENTRIES, total: LOG_ENTRIES.length, hasMore: false }),
  })
}

/**
 * 평평한 기록을 날짜별로 묶는다 — `[{ date, logs: [...] }]`.
 *
 * 서버가 준 **순서를 그대로 따른다.** 여기서 다시 정렬하지 않는다 —
 * 서버가 최신순으로 주는데 화면이 또 정렬하면 정렬 규칙이 두 군데가 되고,
 * 한쪽만 바뀌는 날 조용히 어긋난다.
 */
export function groupLogsByDay(logs) {
  const by = new Map()
  for (const log of logs ?? []) {
    if (!by.has(log.date)) by.set(log.date, [])
    by.get(log.date).push(log)
  }
  return [...by].map(([date, items]) => ({ date, logs: items }))
}

/**
 * NOW-LOG-002 · GET /logs/summary — 건수와 분포만. 분모를 계산하지 않는다.
 *
 * 2026-08-20 H01 용으로 네 가지가 붙는다(김민정) —
 * daysRecorded · daysSubtracted · topState · topSubtracted.
 * ⚠️ 아직 404 라 목으로 돈다. 화면은 toWeekSummary 를 거쳐 읽는다.
 *
 * period 는 week · month 두 가지고 **서버 기본값은 month 다.**
 * 여기 기본값이 week 인 것은 부르는 곳이 H01 「이번주 요약」 하나라서인데,
 * 두 기본값이 다른 채로 두면 헷갈리기 쉬워서 **호출부에서 period 를 반드시 적어 보낸다**
 * (RecordsScreen 의 weekSummary 참고). 그래서 어느 쪽 기본값도 실제로 쓰이지 않는다.
 */
export function getLogSummary(period = 'week') {
  return call('NOW-LOG-002', {
    query: { period },
    mock: () => ok({ period, ...LOG_SUMMARY }),
  })
}

/**
 * 기록 요약을 H01 이 그리는 모양으로 정리한다.
 *
 * 이 함수가 있는 이유는 하나다 — **`topState` · `topSubtracted` 의 생김새를 아직 못 봤다.**
 * 이름만 전달받았고 서버가 404 라 실측을 못 했다. 그래서 올 법한 형태를 다 받아 둔다.
 *   topState       'low'  또는  { state:'low', days:4, totalDays:7 }
 *   topSubtracted  [{ name, count }]  또는  [{ itemId, name, count }]
 * 형태가 확정되면 여기만 고치면 화면은 그대로다.
 *
 * ⚠️ 「이어간 날(연속 달성일)」과 달성률은 만들지 않는다 — 2026-08-20 결정.
 *    여기서 계산해 주지도 않는다. 계산해 두면 언젠가 화면에 붙는다.
 *
 * ⚠️ 시안의 컨디션 꼬리표에 해당하는 값은 **서버에 없다**(2026-08-20 실측으로 확인).
 *    한때 topSignals 로 받아 두었는데 없는 필드라 지웠다.
 */
export function toWeekSummary(summary) {
  if (!summary) return null

  const raw = summary.topState
  const stateKey = typeof raw === 'string' ? raw : (raw?.state ?? null)
  const known = CONDITIONS.find((c) => c.key === stateKey)

  return {
    stats: [
      { key: 'recorded', label: '기록한 날', days: summary.daysRecorded ?? 0 },
      { key: 'reduced', label: '덜어낸 날', days: summary.daysSubtracted ?? 0 },
    ],
    /* 라벨·이모지는 우리 상수에서 찾는다. 서버가 주는 것은 상태값이지 문구가 아니다. */
    state: known
      ? {
          key: known.key,
          label: known.label.replace(/\s*\p{Extended_Pictographic}+\s*$/u, ''),
          emoji: known.emoji,
          days: typeof raw === 'object' ? (raw.days ?? null) : null,
          totalDays: typeof raw === 'object' ? (raw.totalDays ?? null) : null,
        }
      : null,
    reduced: (summary.topSubtracted ?? []).map((r) => ({
      key: r.itemId ?? r.name,
      name: r.name,
      count: r.count ?? 0,
    })),
  }
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
