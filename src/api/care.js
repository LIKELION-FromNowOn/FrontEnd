import { call, ok } from './client'
import { COACH_MOCK_ANSWER } from '../screens/options'

/**
 * 안내문 · 예정 · 케어 코치 · 안전 — NOW-NOTE-001~006 · NOW-COACH-001 · NOW-SAFE-001.
 * live.js 의 bundle 은 'today'(안내문·예정) · 'note'(원문) · 'safety'(코치·안전).
 *
 * ⚠️ 명세서에서 이 계열 9건은 **맨몸 JSON** 으로 적혀 있는데, 실서버는 봉투를 씁니다
 *    (FE-HANDOFF-0819.md 2장 — 세 키가 항상 다 옵니다).
 *    실측이 명세서보다 우선이므로 목도 봉투로 맞춥니다.
 */

/** NOW-NOTE-001 · GET /me/care — 최근 관리 종류·경과일 + 오늘 살아 있는 주의사항만 */
export function getCare() {
  return call('NOW-NOTE-001', {
    mock: () =>
      ok({
        lastType: '피부 관리',
        ago: 2,
        cautions: [
          {
            itemId: 'cr4',
            text: '3일간 각질·고기능성 관리는 피해 주세요',
            sent: 2,
            dp: 3,
            daysLeft: 1,
          },
        ],
        hasNote: true,
      }),
  })
}

/**
 * NOW-NOTE-002 · PUT /me/care — 관리 맥락 저장.
 * 의료 기록을 받지 않고 생활 안내 수준만 받는다.
 */
export function saveCare({ lastType, ago, noteLines }) {
  return call('NOW-NOTE-002', {
    body: { lastType, ago, noteLines },
    mock: () => ok({ saved: true, lastType, ago }),
  })
}

/**
 * NOW-NOTE-003 · GET /me/care/note — 안내문 원문.
 * lines 배열 순서가 곧 문장 번호이고 **1부터** 센다.
 * sample 이 true 면 화면에 가상 샘플임을 반드시 표시한다.
 */
export function getCareNote() {
  return call('NOW-NOTE-003', {
    mock: () =>
      ok({
        title: '시술 후 사후관리 안내',
        from: '클리닉명',
        sample: true,
        lines: [
          '시술 후 이틀간은 미온수로만 세안하십시오.',
          '시술 후 3일간 각질 제거와 고기능성 제품 사용을 피해 주십시오.',
        ],
        rules: [
          {
            sent: 2,
            dp: 3,
            name: '각질 · 고기능성',
            kw: ['각질', '필링', '스크럽'],
            itemId: 'cr4',
          },
        ],
      }),
  })
}

/** NOW-NOTE-004 · GET /me/plans — 등록한 예정과 안내문 규칙과의 충돌 여부 */
export function getPlans() {
  return call('NOW-NOTE-004', {
    mock: () =>
      ok({
        plans: [
          {
            planId: 'pl_1',
            date: '2026-08-21',
            title: '각질 관리',
            conflict: true,
            // 여러 규칙에 걸리면 가장 늦게 풀리는 것을 돌려준다
            freeFrom: '2026-08-22',
            sent: 2,
          },
        ],
      }),
  })
}

/** NOW-NOTE-005 · POST /me/plans — 예정 추가. 캘린더 연동이 아니다. */
export function addPlan({ date, title }) {
  return call('NOW-NOTE-005', {
    body: { date, title },
    mock: () => ok({ planId: 'pl_2', date, title, conflict: false, freeFrom: null }),
  })
}

/** NOW-NOTE-006 · DELETE /me/plans/{planId} — 없는 id 도 성공으로 본다(멱등) */
export function deletePlan(planId) {
  return call('NOW-NOTE-006', { path: `/me/plans/${planId}`, mock: () => ok(null) })
}

/**
 * NOW-COACH-001 · POST /coach/ask — 케어 코치.
 *
 * 판정은 규칙이 하고 AI 는 문장만 만든다. 그래서 화면은 answer 와 basis 를 항상 함께 띄운다.
 * 응답의 수치를 화면에서 만들지 않는다 — 서버가 준 것을 그대로 옮긴다.
 */
export function askCoach(question) {
  return call('NOW-COACH-001', {
    body: { question },
    mock: () => ok({ ...COACH_MOCK_ANSWER }),
  })
}

/**
 * NOW-SAFE-001 · POST /safety/check — 위기 신호 검사.
 *
 * ⚠️ 보통은 **프론트가 직접 부르지 않는다.** 자유 입력을 받는 5개 서버 엔드포인트
 *    (`/me/items/custom` · `/checkins` · `/coach/ask` · `/me/care` · `/me/plans`)가
 *    내부에서 먼저 이 필터를 거친다. 프론트는 응답에 flagged 가 오면 상담 안내를 띄운다.
 *    단독 호출도 가능해서 함수는 남겨 둔다.
 *
 * source 는 custom_item | custom_signal | coach | care_note | plan 다섯 가지다.
 * (명세서 주석의 `todo` 는 낡은 값이라 쓰지 않는다 — PM 해결방안 안건 2)
 */
export function checkSafety({ text, source }) {
  return call('NOW-SAFE-001', {
    body: { text, source },
    mock: () => ok({ flagged: false, action: 'none', message: null, stored: false }),
  })
}
