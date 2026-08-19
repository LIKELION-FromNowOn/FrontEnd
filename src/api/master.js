import { call } from './client'
import { CARE_ITEM_GROUPS, SIGNAL_GROUPS } from '../screens/options'

/**
 * 마스터 데이터 API — NOW-MASTER-001 ~ 003.
 *
 * 요구사항 No.19(김민정) 묶음이고 `/auth/guest` 다음으로 붙을 자리다.
 * 화면(C01 관리 항목 선택 · D01 오늘 컨디션)이 이 값으로 그려지므로,
 * 붙는 순간 시안 문구 대신 서버 값이 뜬다.
 *
 * ⚠️ 지금 목은 **시안 문구**이고 명세서 수량과 다르다. 검수(요구사항 No.16)가 끝나면
 *    서버 값이 정답이 된다.
 *      카테고리   명세 7분류  ↔ 시안 4분류(전부 피부·홈케어 안쪽)
 *      관리 항목  명세 32건   ↔ 시안 21건
 *      이상 징후  명세 14건   ↔ 시안 약 27건
 *    특히 징후 수는 신호 강도 가중치 합산(임계값 5)에 직접 영향이 간다.
 */

/** NOW-MASTER-001 · GET /categories — 관리 항목 카테고리 7건 */
export function getCategories() {
  return call('NOW-MASTER-001', {
    mock: () => ({
      categories: CARE_ITEM_GROUPS.map((g, i) => ({
        categoryId: `mock_${i}`,
        name: g.title,
      })),
    }),
  })
}

/**
 * NOW-MASTER-002 · GET /care-items — 관리 항목 32건 + 하한선·근거 등급.
 * floor 등급은 생리적 필수 / 권장 / 선택 / 판정 제외 네 가지다.
 */
export function getCareItems() {
  return call('NOW-MASTER-002', {
    mock: () => ({
      careItems: CARE_ITEM_GROUPS.flatMap((g, gi) =>
        g.items.map((it, i) => ({
          itemId: `mock_${gi}_${i}`,
          categoryId: `mock_${gi}`,
          categoryName: g.title,
          name: it.name,
          // 명세서의 frequencyEditable. 클리닉·처방약처럼 앱이 판정하지 않는 항목은 false
          frequencyEditable: it.freqEditable,
        })),
      ),
    }),
  })
}

/** NOW-MASTER-003 · GET /signals — 이상 징후 14건 + 가중치·전환 임계값 */
export function getSignals() {
  return call('NOW-MASTER-003', {
    mock: () => ({
      signals: SIGNAL_GROUPS.flatMap((g) =>
        g.items.map((name) => ({ signalId: name, group: g.label, name })),
      ),
      // 임계값은 서버가 정한다. 프론트가 계산에 쓰지 않고 표시에만 쓴다.
      transitionThreshold: 5,
    }),
  })
}
