import { call, ok } from './client'
import { CARE_ITEM_GROUPS, MIN_CARE_ITEMS } from '../screens/options'

/**
 * 내 관리 항목 · 오늘 상태 — NOW-ITEM-001~004 · NOW-STATE-001~003.
 * 요구사항 No.14(송원석) 묶음. live.js 의 bundle 은 'auth'.
 *
 * 목은 전부 실서버와 같은 봉투로 돌려준다.
 */

/* 목에서 「내가 고른 항목」 자리를 대신하는 값 */
const MY_ITEMS = [
  { itemId: 'mi_1', name: '폼 클렌저', frequency: 'daily', frequencyEditable: true },
  { itemId: 'mi_2', name: '토너·에센스', frequency: 'daily', frequencyEditable: true },
  { itemId: 'mi_3', name: '크림·로션', frequency: 'daily', frequencyEditable: true },
  {
    itemId: 'mi_4',
    name: '선크림 (야외)',
    frequency: 'weekly_4plus',
    frequencyEditable: true,
  },
]

/** NOW-ITEM-001 · GET /me/items — 선택한 항목과 빈도 */
export function getMyItems() {
  return call('NOW-ITEM-001', { mock: () => ok({ items: MY_ITEMS }) })
}

/**
 * NOW-ITEM-002 · PUT /me/items — 항목·빈도 일괄 저장.
 * 최소 개수를 못 채우면 서버가 MIN_ITEMS_REQUIRED(400) 로 막는다.
 * needsRejudge 가 true 면 덜어내기를 다시 돌려야 한다.
 */
export function saveMyItems(items) {
  return call('NOW-ITEM-002', {
    body: { items },
    mock: () => ok({ saved: items.length, needsRejudge: true, minItems: MIN_CARE_ITEMS }),
  })
}

/**
 * NOW-ITEM-003 · POST /me/items/custom — 자유 텍스트에서 항목 만들기.
 * 자유 입력이라 서버가 위기 신호 검사를 먼저 거친다(NOW-SAFE-001).
 * floor 는 항상 optional 이다.
 */
export function addCustomItem(text) {
  return call('NOW-ITEM-003', {
    body: { text },
    mock: () =>
      ok({
        itemId: 'mi_custom_1',
        name: text,
        categoryId: 'care',
        categoryName: '피부·홈케어',
        frequency: null,
        frequencyEditable: true,
      }),
  })
}

/** NOW-ITEM-004 · DELETE /me/items/{itemId} */
export function deleteMyItem(itemId) {
  return call('NOW-ITEM-004', {
    path: `/me/items/${itemId}`,
    mock: () => ok(null),
  })
}

/**
 * NOW-STATE-001 · POST /checkins — 상태 체크 제출.
 * 규칙 기반이고 AI 가 아니다. 상태값 unknown 을 허용한다.
 * signalStrength 가 임계값을 넘으면 transitionSuggested 가 true 로 온다.
 */
export function submitCheckin({ condition, signals, note }) {
  return call('NOW-STATE-001', {
    body: { state: condition, signals, note },
    mock: () =>
      ok({
        checkinId: 'ck_101',
        state: condition,
        signalStrength: 3,
        transitionSuggested: false,
        checkedAt: new Date().toISOString(),
      }),
  })
}

/** NOW-STATE-002 · GET /checkins/latest — 판정 전 반드시 있어야 한다 */
export function getLatestCheckin() {
  return call('NOW-STATE-002', {
    mock: () =>
      ok({
        checkinId: 'ck_101',
        state: 'normal',
        signals: ['건조함', '잠이 부족해요'],
        signalStrength: 3,
        checkedAt: new Date().toISOString(),
      }),
  })
}

/**
 * NOW-STATE-003 · POST /state/transition — 전환 제안 수락·거절.
 * 거절하면 재제안이 유예된다. ⚠️ 유예 기간은 아직 미확정(명세서 예시는 3일).
 */
export function respondTransition({ accept }) {
  return call('NOW-STATE-003', {
    body: { accept },
    mock: () =>
      ok({
        state: accept ? 'low' : 'normal',
        // 서버가 정하는 값이라 화면에서 계산하지 않는다
        cooldownDays: accept ? 0 : 3,
      }),
  })
}

/** 마스터 항목을 화면이 쓰는 그룹 형태로 — 서버가 비어 있으면 시안 값으로 버틴다 */
export const toGroups = (careItems) => {
  if (!careItems?.length) return CARE_ITEM_GROUPS
  const by = new Map()
  for (const it of careItems) {
    if (!by.has(it.categoryName)) by.set(it.categoryName, [])
    by.get(it.categoryName).push({ name: it.name, freqEditable: it.frequencyEditable })
  }
  return [...by].map(([title, items]) => ({ title, items }))
}
