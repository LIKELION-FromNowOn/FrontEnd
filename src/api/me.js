import { call, ok } from './client'
import { MIN_CARE_ITEMS } from '../screens/options'

/**
 * 내 관리 항목 · 오늘 상태 — NOW-ITEM-001~004 · NOW-STATE-001~003.
 * 요구사항 No.14(송원석) 묶음. live.js 의 bundle 은 'auth'.
 *
 * 목은 전부 실서버와 같은 봉투로 돌려준다.
 */

/**
 * 목에서 「내가 고른 항목」 자리를 대신하는 값.
 *
 * 2026-08-20 배포분 형태에 맞춘다 — 응답은 **배열 그대로** 오고 필드는 여섯이다.
 *   itemId · name · category · frequency · floor · custom
 * `custom: true` 는 직접 입력으로 만든 항목이고 itemId 가 `cu_` 로 시작한다.
 * 예전 목에 있던 `frequencyEditable` 은 이 응답에 없다 — 그건 마스터(GET /care-items) 쪽 필드다.
 */
const MY_ITEMS = [
  {
    itemId: 'mi_1',
    name: '폼 클렌저',
    category: '세안 · 클렌징',
    frequency: 'daily',
    floor: 'essential',
    custom: false,
  },
  {
    itemId: 'mi_2',
    name: '토너·에센스',
    category: '보습 · 진정',
    frequency: 'daily',
    floor: 'recommended',
    custom: false,
  },
  {
    itemId: 'mi_3',
    name: '크림·로션',
    category: '보습 · 진정',
    frequency: 'daily',
    floor: 'recommended',
    custom: false,
  },
  {
    itemId: 'mi_4',
    name: '선크림 (야외)',
    category: '자외선 차단',
    frequency: 'weekly_4plus',
    floor: 'essential',
    custom: false,
  },
  {
    itemId: 'cu_1',
    name: '자기 전 스트레칭',
    category: '집중 케어',
    frequency: 'weekly_3',
    floor: 'optional',
    custom: true,
  },
]

/**
 * 응답을 항상 배열로 만든다.
 *
 * 지금 서버는 배열을 그대로 준다. 예전 형태(`{ items: [...] }`)로 돌아가더라도
 * 화면이 조용히 빈 목록이 되지 않도록 둘 다 받는다.
 */
export const toItemList = (data) => (Array.isArray(data) ? data : (data?.items ?? []))

/** 직접 입력으로 만든 항목인지 — 서버의 custom 을 우선하고, 없으면 id 접두사로 본다 */
export const isCustomItem = (it) =>
  it?.custom === true || String(it?.itemId ?? '').startsWith('cu_')

/**
 * NOW-ITEM-001 · GET /me/items — 선택한 항목과 빈도.
 * 직접 입력 항목도 같은 목록에 섞여서 온다(custom: true).
 */
export function getMyItems() {
  return call('NOW-ITEM-001', { mock: () => ok(MY_ITEMS) }).then(toItemList)
}

/**
 * NOW-ITEM-002 · PUT /me/items — 항목·빈도 일괄 저장.
 *
 * 최소 개수를 못 채우면 서버가 MIN_ITEMS_REQUIRED(400) 로 막는다.
 * 빈도가 비면 FREQUENCY_REQUIRED(400) 다.
 * needsRejudge 가 true 면 덜어내기를 다시 돌려야 한다.
 *
 * ⚠️ **직접 입력 항목을 여기에 실으면 400 이다** (2026-08-20 백엔드 확정).
 *    만들 때 POST /me/items/custom, 지울 때 DELETE /me/items/{itemId} 를 쓴다.
 *    PUT 을 다시 불러도 직접 입력 항목은 지워지지 않으므로 여기서 미리 걸러 보낸다.
 */
export function saveMyItems(items) {
  const sendable = (items ?? []).filter((it) => !isCustomItem(it))

  return call('NOW-ITEM-002', {
    body: { items: sendable },
    mock: () =>
      ok({ saved: sendable.length, needsRejudge: true, minItems: MIN_CARE_ITEMS }),
  })
}

/**
 * NOW-ITEM-003 · POST /me/items/custom — 자유 텍스트에서 항목 만들기 (201).
 *
 * 서버가 위기 문구를 **AI 를 부르기 전에** 먼저 거른다. 걸리면 400 TEXT_REJECTED 다.
 * floor 는 직접 입력이라 항상 'optional' 이고, 어떻게 해석했는지는
 * evidenceLevel · interpretedBy 로 같이 온다(문구를 화면에서 지어내지 않는다).
 * frequency 는 null 로 오므로 사용자가 따로 골라야 한다.
 */
export function addCustomItem(text) {
  return call('NOW-ITEM-003', {
    body: { text },
    mock: () =>
      ok({
        itemId: 'cu_2',
        name: text,
        category: '집중 케어',
        frequency: null,
        floor: 'optional',
        evidenceLevel: 'low',
        interpretedBy: 'llm',
      }),
  })
}

/**
 * NOW-ITEM-004 · DELETE /me/items/{itemId}.
 *
 * 지우고 나서 3개 미만이 되면 서버가 400 MIN_ITEMS_REQUIRED 로 막는다 — 화면에서 미리 막지 않고
 * 서버 답을 그대로 띄운다(최소 개수는 서버가 정하는 값이라 양쪽에 적어두면 어긋난다).
 * needsRejudge 가 true 면 덜어내기를 다시 돌려야 한다.
 */
export function deleteMyItem(itemId) {
  return call('NOW-ITEM-004', {
    path: `/me/items/${itemId}`,
    mock: () =>
      ok({
        itemId,
        deleted: true,
        remainingCount: MY_ITEMS.length - 1,
        needsRejudge: true,
      }),
  })
}

/**
 * NOW-STATE-001 · POST /checkins — 상태 체크 제출.
 * 규칙 기반이고 AI 가 아니다. 상태값 unknown 을 허용한다.
 *
 * 요청은 고른 징후의 **id 목록**(signalIds)과 직접 입력(customSignals)으로 나뉜다.
 * signalScore 가 threshold 를 넘으면 transitionProposed 가 true 로 오고,
 * reasons 에 그렇게 본 근거가 담긴다 — 근거 없는 전환 제안은 띄우지 않는다.
 */
export function submitCheckin({ condition, signalIds = [], customSignals = [] }) {
  return call('NOW-STATE-001', {
    body: { state: condition, signalIds, customSignals },
    mock: () =>
      ok({
        checkinId: 'ck_01M0EHT5PWE74PQBN3HCP0Z6YR',
        state: condition,
        signalScore: 8,
        threshold: 5,
        maxScore: 25,
        transitionProposed: true,
        proposedState: 'drained',
        reasons: [
          '하고 싶은 게 없다',
          '잠들기까지 오래 걸린다',
          '쉬어도 회복되지 않는다',
        ],
        recommendationPaused: false,
        judgeStrength: 'high',
      }),
  })
}

/**
 * NOW-STATE-002 · GET /checkins/latest — 판정 전 반드시 있어야 한다.
 *
 * ⚠️ **고른 징후 목록(signalIds)은 오지 않는다.** 명세서에 그 필드가 없고 서버도 안 준다.
 * 화면에 징후를 되살려야 하면 명세서를 먼저 고쳐야 한다(2026-08-20 PM 확인 요청 중).
 */
export function getLatestCheckin() {
  return call('NOW-STATE-002', {
    mock: () =>
      ok({
        checkinId: 'ck_01M0EHT5PWE74PQBN3HCP0Z6YR',
        state: 'normal',
        signalScore: 8,
        threshold: 5,
        transitionProposed: true,
        recommendationPaused: false,
        judgeStrength: 'high',
        createdAt: new Date().toISOString(),
      }),
  })
}

/**
 * NOW-STATE-003 · POST /state/transition — 전환 제안 수락·거절.
 *
 * ⚠️ **checkinId 가 필수다.** `{ accept }` 만 보내면 400 VALIDATION_FAILED 다
 *    (2026-08-20 실측). 어느 제안에 답하는 것인지 서버가 알아야 한다.
 *    값은 POST /checkins 응답이나 GET /checkins/latest 의 checkinId 를 쓴다.
 *
 * 응답이 수락·거절에 따라 다르다(실측).
 *   수락 { state, accepted:true,  recommendationPaused:true, needsRejudge:true }
 *   거절 { state, accepted:false, recommendationPaused:false, nextProposalBlockedUntil }
 *
 * ⚠️ 유예는 **일수가 아니라 시각**으로 온다(`nextProposalBlockedUntil`, 실측 3일 뒤).
 *    예전 목에 있던 `cooldownDays` 는 서버에 없다 — 남은 날짜를 화면에서 세지 않는다.
 * 이미 답한 제안에 또 답하면 409 NO_PROPOSAL 이다.
 */
export function respondTransition({ checkinId, accept }) {
  return call('NOW-STATE-003', {
    body: { checkinId, accept },
    mock: () => {
      const blocked = new Date()
      blocked.setDate(blocked.getDate() + 3)
      return ok(
        accept
          ? {
              state: 'drained',
              accepted: true,
              recommendationPaused: true,
              // 상태가 바뀌었으니 덜어내기를 다시 돌려야 한다
              needsRejudge: true,
            }
          : {
              state: 'low',
              accepted: false,
              recommendationPaused: false,
              nextProposalBlockedUntil: blocked.toISOString(),
            },
      )
    },
  })
}

/**
 * 마스터 항목(GET /care-items)을 화면이 쓰는 그룹 형태로 바꾼다.
 *
 * ⚠️ **시안 값으로 대신 그리지 않는다.** PUT /me/items 는 마스터의 itemId 를 받는데
 *    시안 항목에는 id 가 없다. 대신 그려두면 사용자가 다 고르고 「다음」을 누른 뒤에야
 *    400 VALIDATION_FAILED 를 만난다. 비었으면 비었다고 화면에 말하는 편이 낫다.
 *
 * 서버 항목 한 건: { id, category, categoryName, name, floor, evidenceLevel,
 *                   frequencyEditable, defaultFrequency }
 */
export const toGroups = (careItems) => {
  const by = new Map()
  for (const it of careItems ?? []) {
    const title = it.categoryName ?? it.category ?? '기타'
    if (!by.has(title)) by.set(title, [])
    by.get(title).push({
      itemId: it.id,
      name: it.name,
      freqEditable: it.frequencyEditable !== false,
      defaultFrequency: it.defaultFrequency ?? null,
    })
  }
  return [...by].map(([title, items]) => ({ title, items }))
}

/**
 * 카테고리 코드(care·move…)를 사람이 읽는 이름으로.
 *
 * GET /me/items 와 POST /me/items/custom 의 `category` 는 **코드**다.
 * 화면에 그대로 띄우면 「move」 같은 글자가 나온다.
 */
export const categoryName = (categories, code) =>
  categories?.find((c) => c.id === code)?.name ?? null
