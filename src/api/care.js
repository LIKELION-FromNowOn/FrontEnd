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

/**
 * NOW-NOTE-001 · GET /me/care — 최근 관리 종류·경과일 + 오늘 살아 있는 주의사항만.
 *
 * `cautions[].keywords` 는 명세에 없는데 서버가 **일부러 더 얹어서** 준다.
 * 조회한 값을 그대로 다시 저장할 수 있게 하려는 것이다 — 아래 toCareSaveShape 참고.
 * `saved` 는 저장 직후에만 개수가 들어오고 조회에서는 null 이다.
 */
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
            daysLeft: 1, // 서버가 계산해서 내려준다. 화면에서 만들지 않는다
            keywords: ['각질', '필링', '스크럽', '고기능성', '레티놀'],
          },
        ],
        hasNote: true,
        saved: null,
      }),
  })
}

/**
 * 조회 응답(GET /me/care)을 저장 요청 본문으로 바꾼다.
 *
 * ⚠️ **이 함수를 거치지 않고 직접 body 를 만들지 말 것.**
 *    조회 → 수정 → 저장을 돌 때 `keywords` 를 흘리면 아래 두 기능이 **오류 없이** 멈춘다.
 *      케어 코치  「오늘 클라이밍 가도 되나요」 → 「안내문에 없습니다」
 *      예정       conflict 가 항상 false — 충돌 표시가 안 뜬다
 *    서버는 문장에서 낱말을 뽑지 않는다(지어내는 쪽이라서). 화면이 준 값을 그대로 쓴다.
 *
 * `daysLeft` 는 서버가 계산하는 값이라 되돌려 보내지 않는다.
 */
export function toCareSaveShape(care, noteLines) {
  return {
    lastType: care?.lastType ?? null,
    ago: care?.ago ?? null,
    noteLines: noteLines ?? care?.noteLines ?? [],
    cautions: (care?.cautions ?? []).map((c) => ({
      itemId: c.itemId ?? null,
      text: c.text,
      sent: c.sent ?? null,
      dp: c.dp ?? null,
      keywords: c.keywords ?? [],
    })),
  }
}

/**
 * NOW-NOTE-002 · PUT /me/care — 관리 맥락 저장.
 * 의료 기록을 받지 않고 생활 안내 수준만 받는다.
 *
 * 2026-08-20 로 요청 필드가 둘 늘었다.
 *   noteLines           안내문 원문 문장 배열. **배열 순서가 곧 문장 번호이고 1부터 센다.**
 *                       cautions[].sent 가 이 배열을 가리키므로 원문이 먼저 들어가야
 *                       주의사항 자체를 넣을 수 없다.
 *   cautions[].keywords 매칭용 **낱말**(문장이 아니다). 없어도 저장은 되지만
 *                       코치·예정이 조용히 멈춘다.
 *
 * ago 는 0~90 이고 벗어나면 400 VALIDATION_FAILED 다.
 * dp 가 없으면 기간을 모르는 것으로 보고 자동 만료시키지 않는다.
 * text 는 자유 입력이라 저장 전에 서버가 위기 신호 검사를 거친다(NOW-SAFE-001).
 */
export function saveCare({ lastType, ago, noteLines = [], cautions = [] }) {
  const body = toCareSaveShape({ lastType, ago, cautions }, noteLines)

  if (import.meta.env.DEV) warnLostKeywords(body)

  return call('NOW-NOTE-002', {
    body,
    mock: () =>
      ok({
        lastType: body.lastType,
        ago: body.ago,
        cautions: body.cautions.map((c) => ({ ...c, daysLeft: c.dp ?? null })),
        hasNote: body.noteLines.length > 0,
        saved: body.cautions.length,
      }),
  })
}

/**
 * 개발 중에만 도는 검사.
 *
 * keywords 가 빠지거나 sent 가 없는 문장을 가리켜도 서버는 200 을 준다.
 * 그래서 화면에서는 잘 저장된 것처럼 보이고, 코치·예정이 며칠 뒤에야 「왜 안 걸리지」로 발견된다.
 * 조용히 틀리는 자리라 콘솔에 대신 말하게 해 둔다.
 */
function warnLostKeywords({ noteLines, cautions }) {
  for (const c of cautions) {
    if (!c.keywords?.length) {
      console.warn(
        `[care] 주의사항에 keywords 가 없습니다 — "${c.text}". ` +
          '저장은 되지만 케어 코치와 예정 충돌이 이 항목을 못 찾습니다.',
      )
    }
    if (c.sent != null && (c.sent < 1 || c.sent > noteLines.length)) {
      console.warn(
        `[care] sent=${c.sent} 가 noteLines(${noteLines.length}문장) 밖을 가리킵니다 — "${c.text}". ` +
          '문장 번호는 1부터입니다.',
      )
    }
  }
}

/**
 * NOW-NOTE-003 · GET /me/care/note — 안내문 원문.
 * lines 배열 순서가 곧 문장 번호이고 **1부터** 센다. PUT 으로 보낸 noteLines 가 그대로 여기 온다.
 * sample 이 true 면 화면에 가상 샘플임을 반드시 표시한다.
 *
 * ⚠️ `rules[].kw` 는 저장할 때 보낸 `cautions[].keywords` 와 **같은 값**이다.
 *    이름만 다르다(실측 확인). 서버가 문장에서 새로 뽑아내는 것이 아니다.
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

/**
 * NOW-NOTE-004 · GET /me/plans — 등록한 예정과 안내문 규칙과의 충돌 여부.
 *
 * ⚠️ `conflict` 는 예정 제목과 `cautions[].keywords` 를 **낱말로** 맞춰 본다.
 *    keywords 를 저장하지 않았으면 여기 값이 늘 false 다 — 오류가 아니라 조용히 안 걸린다.
 */
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

/**
 * NOW-NOTE-005 · POST /me/plans — 예정 추가. 캘린더 연동이 아니다.
 * 등록하는 그 자리에서 충돌 여부를 알려준다(실측: 「클라이밍 약속」 → conflict true).
 * 응답에는 `sent` 가 없고 목록 조회에만 있다.
 */
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
 *
 * ⚠️ 안내문에서 근거를 찾는 것도 `cautions[].keywords` 로 한다.
 *    keywords 가 없으면 「안내문에 없습니다」로 답한다 — 서버가 틀린 게 아니라 줄 값이 없는 것이다.
 *
 * 실측 응답: { answer, basis:{type,label,sent,daysLeft,sourceText}, level,
 *              generatedBy, chips, citedSents, crisis }
 */
export function askCoach(question) {
  return call('NOW-COACH-001', {
    body: { question },
    mock: () => ok({ ...COACH_MOCK_ANSWER, chips: [], citedSents: [], crisis: false }),
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
    /* blocked 는 명세에 없는데 서버가 더 준다(2026-08-20 실측).
       true 면 그 입력이 통째로 거절된 것이다 — flagged 만 보고 통과시키면 안 된다. */
    mock: () =>
      ok({
        flagged: false,
        action: 'none',
        message: null,
        stored: false,
        blocked: false,
      }),
  })
}
