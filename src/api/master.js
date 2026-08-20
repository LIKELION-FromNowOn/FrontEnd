import { call, ok } from './client'
import { CARE_ITEM_GROUPS, SIGNAL_GROUPS } from '../screens/options'

/**
 * 마스터 데이터 API — NOW-MASTER-001 ~ 003.
 *
 * ✅ 2026-08-20 실측 — 셋 다 살아 있고 시드도 들어가 있다.
 *    (백엔드 배포 안내의 「8개」 목록에는 없었는데, 확인해 보니 이미 도는 상태였다.)
 *
 * ⚠️ **실측 형태가 예전 목과 다르다.** 세 가지가 어긋나 있었다.
 *      1. /categories · /care-items 는 봉투 안이 **배열 그대로**다 (`{categories:…}` 아님).
 *      2. 식별자 필드 이름이 `id` 다 (`categoryId` · `itemId` · `signalId` 아님).
 *      3. 시안 문구와 내용이 완전히 다르다 — 시안은 피부 항목만 21건이었는데
 *         서버는 7분류 32건(수면·운동·식사·마음·일상·건강 포함)이다.
 *
 * 화면이 매번 형태를 따지지 않도록 여기서 한 번만 정리해서 넘긴다.
 */

/**
 * NOW-MASTER-001 · GET /categories — 관리 항목 카테고리 7건.
 * → [{ id, name, order, itemCount }]  (care · sleep · move · eat · mind · life · med)
 */
export function getCategories() {
  return call('NOW-MASTER-001', {
    mock: () =>
      ok(
        CARE_ITEM_GROUPS.map((g, i) => ({
          id: `mock_${i}`,
          name: g.title,
          order: i + 1,
          itemCount: g.items.length,
        })),
      ),
  })
}

/**
 * NOW-MASTER-002 · GET /care-items — 관리 항목 32건.
 * → [{ id, category, categoryName, name, floor, evidenceLevel,
 *      core, base, minutes, frequencyEditable, defaultFrequency }]
 *
 * `category` 는 코드(care·move…)고 사람이 읽는 이름은 `categoryName` 이다.
 * 화면에 코드를 그대로 띄우지 않는다.
 */
export function getCareItems() {
  return call('NOW-MASTER-002', {
    mock: () =>
      ok(
        CARE_ITEM_GROUPS.flatMap((g, gi) =>
          g.items.map((it, i) => ({
            id: `mock_${gi}_${i}`,
            category: `mock_${gi}`,
            categoryName: g.title,
            name: it.name,
            floor: 'optional',
            evidenceLevel: 'medium',
            // 클리닉·처방약처럼 앱이 판정하지 않는 항목은 false
            frequencyEditable: it.freqEditable,
            defaultFrequency: null,
          })),
        ),
      ),
  })
}

/**
 * NOW-MASTER-003 · GET /signals — 이상 징후 14건 + 가중치·임계값.
 * → { signals: [{ id, group, name, weight }], threshold, maxScore,
 *     customWeight, customMax, groups }
 *
 * ⚠️ 고른 징후는 **id(sig_01…sig_14)** 로 보내야 한다. 이름을 보내면 서버가 오류 대신
 *    signalScore 0 을 돌려줘서 전환 제안이 조용히 안 뜬다 (POST /checkins).
 *    실측 확인: sig_04·sig_01·sig_13 을 보내면 signalScore 7 (임계값 5) 로 온다.
 *
 * 직접 입력한 징후(customSignals)는 개당 customWeight 만큼, customMax 까지만 더해진다.
 */
export function getSignals() {
  return call('NOW-MASTER-003', {
    mock: () =>
      ok({
        signals: SIGNAL_GROUPS.flatMap((g) =>
          g.items.map((name, i) => ({
            id: `mock_${g.label}_${i}`,
            group: g.label,
            name,
            weight: 2,
          })),
        ),
        // 임계값·가중치는 서버가 정한다. 프론트가 계산에 쓰지 않고 표시에만 쓴다.
        threshold: 5,
        maxScore: 25,
        customWeight: 2,
        customMax: 5,
        groups: SIGNAL_GROUPS.map((g) => g.label),
      }),
  })
}
