import { call, ok } from './client'
import {
  FIRST_STEP_CARDS,
  REROLL_LIMIT,
  TODAY_ACTION,
  WEEK_SUMMARY,
} from '../screens/options'

/**
 * 오늘의 행동 · 홈 집계 — NOW-TODAY-001~005 · NOW-HOME-001.
 * 요구사항 No.1(김민정) 묶음. live.js 의 bundle 은 'today'.
 *
 * 목은 전부 실서버와 같은 봉투({ok,data,error})로 돌려준다.
 * 스위치를 켜면 파싱 경로가 그대로라 화면이 안 깨진다.
 *
 * ⚠️ durationSec 을 화면에서 상수로 쓰지 않는다. 서버가 매번 다르게 내려준다(4차 확정).
 */

/** 자정 만료 — 서버의 expiresAt 과 같은 뜻 */
const endOfToday = () => {
  const d = new Date()
  d.setHours(23, 59, 59, 0)
  return d.toISOString()
}

/**
 * NOW-TODAY-001 · GET /today — 오늘의 행동 조회. 없으면 이 시점에 만들어 준다.
 *
 * 결과가 없는 경우가 **두 가지**고 화면이 가야 할 곳이 서로 다르다.
 *   409 NO_EVALUATION  덜어내기를 아직 안 했다      → 덜어내기로 보낸다
 *   200 + data: null   판정은 했는데 남은 항목이 없다 → 첫 발자국 카드로 보낸다
 * 둘을 같이 묶으면 「덜어내기를 하라」는 말을 이미 한 사람에게 또 하게 된다.
 */
export function getToday() {
  return call('NOW-TODAY-001', {
    mock: () =>
      ok({
        actionId: TODAY_ACTION.actionId,
        categoryId: 'care',
        categoryName: TODAY_ACTION.categoryName,
        title: TODAY_ACTION.title,
        durationSec: TODAY_ACTION.durationSec,
        sourceItemId: 'mv_001',
        status: 'pending',
        rerollLeft: REROLL_LIMIT,
        generatedBy: 'llm',
        expiresAt: endOfToday(),
      }),
  })
}

/**
 * NOW-TODAY-002 · POST /today/reroll — 다른 행동 요청. 직전 추천은 제외된다.
 * 하루 3회까지고 넘기면 429 REROLL_LIMIT 이다. 남은 횟수는 응답의 rerollLeft 를 그대로 쓴다.
 */
export function rerollToday(actionId) {
  return call('NOW-TODAY-002', {
    body: { actionId },
    mock: () =>
      ok({
        actionId: 'ac_993',
        categoryId: 'move',
        categoryName: '몸 움직이기',
        title: '헬스장에 다녀오기',
        /* 일부러 오늘의 행동(240초)과 크게 다른 값을 둔다.
           화면이 시간을 상수로 들고 있으면 여기서 바로 드러난다(서버 예시: 헬스장 3600). */
        durationSec: 3600,
        sourceItemId: 'mv_003',
        status: 'pending',
        rerollLeft: REROLL_LIMIT - 1,
        generatedBy: 'llm',
        expiresAt: endOfToday(),
      }),
  })
}

/**
 * NOW-TODAY-003 · POST /today/start — 타이머 시작. durationSec 은 서버가 정한다.
 * 없는 행동이면 404 ACTION_NOT_FOUND, 이미 완료했으면 409 ALREADY_COMPLETED 다.
 */
export function startTimer(actionId) {
  return call('NOW-TODAY-003', {
    body: { actionId },
    mock: () => {
      const now = new Date()
      const ends = new Date(now.getTime() + TODAY_ACTION.durationSec * 1000)
      return ok({
        timerId: 'tm_551',
        actionId,
        durationSec: TODAY_ACTION.durationSec,
        startedAt: now.toISOString(),
        endsAt: ends.toISOString(),
        blockScreen: true,
      })
    },
  })
}

/**
 * NOW-TODAY-004 · POST /today/complete — 완료 처리.
 * 만료 전에도 완료할 수 있다(4차 확정). timerId 는 타이머 없이 완료하면 null.
 * 두 번 누르면 409 ALREADY_COMPLETED 다 — 화면에서 조용히 삼키지 말고 문장을 띄운다.
 */
export function completeToday({ actionId, timerId = null }) {
  return call('NOW-TODAY-004', {
    body: { actionId, timerId },
    mock: () =>
      ok({
        logId: 'lg_770',
        actionId,
        completedAt: new Date().toISOString(),
        categoryId: 'care',
        usedTimer: timerId != null,
        message: '오늘 하나 했습니다.',
      }),
  })
}

/**
 * NOW-TODAY-005 · POST /today/reject — 거절 사유 기록.
 * 다음 추천에 반영될 뿐 **실패로 저장하지 않는다.**
 *
 * ⚠️ reason 은 `time` · `fit` · `none` 세 가지뿐이다 (2026-08-20 확정).
 *    화면 문구는 여러 개여도 보내는 값은 이 셋으로 접어서 보낸다 — options.js 의 REJECT_REASONS.
 */
export function rejectToday({ actionId, reason }) {
  return call('NOW-TODAY-005', {
    body: { actionId, reason },
    mock: () => ok({ accepted: true, reason }),
  })
}

/**
 * NOW-HOME-001 · GET /home — 홈 집계.
 * 홈은 읽기 전용이다. 오늘의 행동을 여기서 새로 만들지 않는다.
 * nextStep 하나로 다음 화면을 정한다 (onboarding·checkin·subtract·action·done·rest).
 */
export function getHome() {
  return call('NOW-HOME-001', {
    mock: () =>
      ok({
        nextStep: 'action',
        state: 'normal',
        recommendationPaused: false,
        care: {
          lastType: '피부 관리',
          ago: 2,
          cautions: [
            {
              itemId: 'cr4',
              text: '3일간 각질·고기능성 관리는 피해 주세요',
              sent: 2,
              daysLeft: 1,
              /* 코치·예정이 낱말로 맞춰 보는 값이다. PUT /me/care 로 저장할 때 같이 넣어야 한다. */
              keywords: ['각질', '필링', '스크럽', '고기능성', '레티놀'],
            },
          ],
          hasNote: true,
        },
        subtract: {
          evaluationId: 'ev_01H8X',
          summary: { keep: 3, simplify: 2, reduce: 1, skip: 1, excluded: 2 },
          removedCount: 2,
        },
        today: {
          actionId: TODAY_ACTION.actionId,
          title: TODAY_ACTION.title,
          durationSec: TODAY_ACTION.durationSec,
          status: 'pending',
          rank: 1,
          totalCandidates: 5,
        },
        footstepCard: {
          id: FIRST_STEP_CARDS[0].id,
          categoryId: 'care',
          situation: FIRST_STEP_CARDS[0].situation,
          firstStep: FIRST_STEP_CARDS[0].firstStep,
        },
        /* 실서버 응답에는 streak 이 없다. 목에 두면 있는 줄 알게 된다. */
        unlock: {
          recordedDays: WEEK_SUMMARY[0].days,
          weeklyOpen: true,
          monthlyOpen: false,
          monthlyNeed: 30,
        },
      }),
  })
}
