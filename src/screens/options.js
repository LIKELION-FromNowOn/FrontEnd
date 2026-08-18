/**
 * 화면에 나오는 선택지 목록. 피그마 시안에서 그대로 옮긴 값.
 * 나중에 서버(마스터 API)에서 받아오게 되면 이 파일이 그 자리로 교체된다.
 */

/**
 * C01 관리 항목 선택.
 *
 * 항목은 마스터 API(NOW-MASTER-002)에서 받아올 자리다. 지금은 시안 값으로 대신한다.
 * freqEditable: false 인 항목은 빈도를 받지 않는다 (마스터의 frequencyEditable).
 * 값이 없으면 true로 본다.
 */
const item = (name, freqEditable = true) => ({ name, freqEditable })

export const CARE_ITEM_GROUPS = [
  {
    title: '세안 · 클렌징',
    items: ['폼 클렌저', '약산성 클렌저', '오일/밤 클렌저', '각질 케어', '클렌징 워터/미셀라', '스크럽/필링'].map((n) => item(n)),
  },
  {
    title: '보습 · 진정',
    items: ['토너·에센스', '수분팩', '세럼·앰플', '진정팩', '크림·로션', '미스트', '오일·페이셜 오일'].map((n) => item(n)),
  },
  {
    title: '자외선 차단',
    items: ['선크림 (야외)', '선크림 (실내·창가)', '톤업 선크림'].map((n) => item(n)),
  },
  {
    title: '집중 케어',
    items: ['트러블 케어', '나이트 케어', '립 케어', '수면팩', '아이 케어'].map((n) => item(n)),
  },
  {
    // 빈도를 받지 않는 항목들. 앱이 판정하지 않는 영역이라 강도를 조절하지 않는다.
    title: '의료 · 클리닉',
    items: [item('클리닉 안내', false), item('처방약', false), item('정기 검진', false)],
  },
]

/**
 * C01 빈도 (NOW-ITEM-002) — 명세서 FQL 테이블 5단계.
 * weight는 서버 load 계산에 쓰이는 값이라 프론트가 계산에 쓰진 않지만,
 * 값이 어긋나면 바로 드러나도록 함께 적어 둔다.
 *
 * 기본값을 두지 않는다 — 「매일」이면 전부 줄이라고 나오고,
 * 「주 1회」면 아무것도 안 줄어든다. 사용자가 반드시 고르게 한다.
 */
export const FREQUENCIES = [
  { key: 'weekly_1', label: '주 1회', weight: 0.5 },
  { key: 'weekly_2', label: '주 2회', weight: 1.1 },
  { key: 'weekly_3', label: '주 3회', weight: 1.9 },
  { key: 'weekly_4plus', label: '주 4회 이상', weight: 2.9 },
  { key: 'daily', label: '매일', weight: 3.6 },
]

/**
 * D01 지금 컨디션 (NOW-STATE-001).
 * 문구는 시안, 코드값·구성은 명세서를 따른다.
 * 「잘 모르겠어요」는 정도가 아니라 답을 하지 않는 선택지라 빠지면 안 된다.
 */
export const CONDITIONS = [
  { key: 'energetic', emoji: '😄', label: '아주 좋아요 😄' },
  { key: 'normal', emoji: '🙂', label: '괜찮아요 🙂' },
  { key: 'low', emoji: '😅', label: '좀 처져요 😅' },
  { key: 'drained', emoji: '😵', label: '많이 지쳤어요 😵' },
  // 「그냥 그래요」를 뺀 자리를 대신 차지하지 않도록 「모르겠다」 쪽으로 문구를 민다
  { key: 'unknown', emoji: '🤔', label: '오늘은 잘 모르겠어요 🤔' },
]

/**
 * 등급이 있는 컨디션만 (그래프 세로축용).
 * 「잘 모르겠어요」는 좋고 나쁨의 정도가 아니라 답을 미룬 것이라 축에 세우면 안 된다.
 * 아래(1)에서 위(4)로 갈수록 좋은 쪽이다.
 */
export const CONDITION_LEVELS = CONDITIONS.filter((c) => c.key !== 'unknown')

/** D01 오늘 느껴지는 신호 */
export const SIGNAL_GROUPS = [
  {
    label: '피부',
    items: ['건조함', '민감함', '트러블', '붓기', '유분', '칙칙함', '특별히 없어요'],
  },
  {
    label: '수면',
    items: ['잠이 부족해요', '너무 많이 잤어요', '푹 잤어요', '잠을 설쳤어요', '자주 깼어요'],
  },
  {
    label: '마음',
    items: ['불안해요', '무기력해요', '기분이 가라앉아요', '답답해요', '예민해요', '기분이 좋아요', '마음이 편안해요'],
  },
  {
    label: '관계·생활',
    items: [
      '스트레스를 많이 받았어요',
      '많이 바빠요',
      '사람을 많이 만났어요',
      '해야 할 일이 많아요',
      '사람들과 이야기하고 싶어요',
      '혼자 있고 싶어요',
      '평소보다 여유로워요',
      '일정이 거의 없어요',
    ],
  },
]

/**
 * 판정 값 — API 명세서 기준 코드명.
 * 한글 라벨은 기능 명세서 NOW-SUB-008의 5종을 따른다.
 * (코드명은 2026-08-14 확정 예정 건이라 바뀌면 여기만 수정)
 */
export const VERDICT_LABEL = {
  keep: '그대로',
  simplify: '방식만',
  reduce: '줄이기',
  skip: '오늘은 쉬기',
  excluded: '판정 안 함', // 문구 재검토 대상 (8/16 김지현·송원석 확정 예정)
}

/**
 * 되돌리기 버튼 노출 규칙 (NOW-SUB-007).
 *   keep     — 이미 「그대로」라 되돌릴 것이 없음
 *   excluded — 앱이 판단하지 않은 것이라 되돌릴 판정이 없음.
 *              클리닉 안내가 앱 제안보다 우선한다는 안전 원칙이라 사용자가 뒤집을 수 없다.
 * 되돌리면 keep으로 고정되고 다음 판정에서도 기억한다.
 */
export const canRevert = (verdict) =>
  verdict === 'simplify' || verdict === 'reduce' || verdict === 'skip'

/** G02 덜어내기 결과 — 판정 필터 */
export const REDUCE_FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'keep', label: '그대로' },
  { key: 'simplify', label: '방식만' },
  { key: 'reduce', label: '줄이기' },
  { key: 'skip', label: '오늘은 쉬기' },
  { key: 'excluded', label: '판정 안 함' },
]

/**
 * G02 오늘 루틴 전체 — 서버 판정 응답을 대신하는 목 데이터.
 *
 * reason은 서버가 내려주는 문장을 그대로 쓴다. 프론트에서 만들지 않는다.
 * 클리닉·항목마다 문장이 다르고, 브랜드명·의학적 단정 검사가 서버에만 있기 때문.
 */
export const ROUTINE_ITEMS = [
  { itemId: 'mv_001', name: '클렌징', verdict: 'keep' },
  {
    itemId: 'mv_002',
    name: '토너',
    verdict: 'excluded',
    excludedBy: 'clinicNote',
    reason: '클리닉에서 받으신 안내가 우선입니다. 앱이 바꾸지 않습니다.',
  },
  { itemId: 'mv_003', name: '레티놀', verdict: 'reduce' },
  { itemId: 'mv_004', name: '보습', verdict: 'keep' },
  { itemId: 'mv_005', name: '자외선 차단제', verdict: 'keep' },
  {
    itemId: 'mv_006',
    name: '마스크팩',
    verdict: 'excluded',
    excludedBy: 'floor',
    reason: '이 항목은 앱이 판단하지 않습니다.',
  },
]

/** 덜어내기 기록 — 피부 느낌 5단계 */
export const SKIN_FEELINGS = [
  { key: 'good', emoji: '😄', label: '좋음' },
  { key: 'fine', emoji: '😊', label: '괜찮음' },
  { key: 'normal', emoji: '🙂', label: '보통' },
  { key: 'sensitive', emoji: '😕', label: '조금 예민' },
  { key: 'bad', emoji: '🙄', label: '예민함' },
]

/** 덜어내기 기록 — 실행 정도 */
export const DID_OPTIONS = ['추천대로 했어요', '조금 바꿨어요', '거의 못 했어요']

/**
 * 이어가는 첫 발자국 — 따라가는 중인 루틴 (F01 «루틴 따라하기» 상태 · F_FirstStepManage).
 *
 * 아직 아무 루틴도 시작하지 않았으면 null이다. 그때는 홈에서 이 카드를 통째로 빼고
 * 히어로 바로가기 문구도 「오늘의 컨디션 및 관리 항목」으로 바뀐다 (F01 기본 상태).
 * 서버 연동 시 홈 응답(NOW-HOME-001)에서 받아 채운다.
 */
export const ACTIVE_STREAK = {
  title: '아침에 눈 뜨면 물 마시기',
  day: 1,
  total: 7,
}

/** 완료한 첫 발자국 (F_FirstStepManage) — 시안이 빈 상태라 목도 비워 둔다 */
export const DONE_STREAKS = []

/**
 * 이번 주 컨디션 막대그래프 (F_WeeklyCondition).
 *
 * level은 CONDITION_LEVELS를 아래에서부터 센 값(1=많이 지쳤어요 … 4=아주 좋아요)이다.
 * 「잘 모르겠어요」로 답했거나 답하지 않은 날은 높이를 만들 수 없으므로
 * level을 null로 두고 막대를 비운다.
 * 서버 연동 시 기록 요약(NOW-LOG-002)에서 받아 채운다.
 */
export const WEEK_CONDITION = [
  { date: '8.11', level: 3 },
  { date: '8.12', level: 2 },
  { date: '8.13', level: 3 },
  { date: '8.14', level: 4 },
  { date: '8.15', level: 1 },
  { date: '8.16', level: 2 },
  { date: '8.17', level: 3 },
]

/**
 * 오늘의 행동 (NOW-TODAY-001 GET /today).
 *
 * durationSec은 서버가 매번 다르게 내려주는 값이다. 4차 회의에서 15분 고정을 없앴으므로
 * 화면에서 상수로 쓰면 안 된다 — 이 목에서도 반드시 이 값을 통해서만 읽는다.
 */
export const TODAY_ACTION = {
  actionId: 'ac_992',
  categoryName: '피부·홈케어',
  title: '세안하고 크림 한번만 바르기',
  durationSec: 240,
}

/**
 * 오늘의 행동을 미룰 때 고르는 사유 (NOW-TODAY-008 POST /today/reject).
 * 「다른 행동 요청」과 달리 이유가 남고, 실패로 기록하지 않는다.
 */
export const REJECT_REASONS = [
  { key: 'tired', label: '오늘은 너무 지쳤어요' },
  { key: 'no_time', label: '시간이 없어요' },
  { key: 'not_now', label: '지금 할 상황이 아니에요' },
  { key: 'not_fit', label: '나에게 맞지 않아요' },
  { key: 'already', label: '이미 했어요' },
]

/**
 * 기록 (NOW-LOG-001 GET /logs · NOW-LOG-002 GET /logs/summary).
 *
 * 완료한 것만 남긴다. 달성률·연속일은 만들지 않는다 —
 * 비율을 만들면 못 한 날이 드러나고, 끊기는 순간이 부담이 되기 때문(명세서 「하지 않는 것」).
 */
export const LOG_DAYS = [
  {
    date: '8월 18일',
    logs: [
      { logId: 'lg_770', title: '세안하고 크림 한번만 바르기', categoryName: '피부·홈케어' },
    ],
  },
  {
    date: '8월 17일',
    logs: [
      { logId: 'lg_769', title: '자기 전 알람 하나만 남기기', categoryName: '수면' },
      { logId: 'lg_768', title: '물 한 잔 마시기', categoryName: '식사·영양' },
    ],
  },
  {
    date: '8월 15일',
    logs: [{ logId: 'lg_764', title: '창문 열고 3분 서 있기', categoryName: '마음' }],
  },
]

/** 기록 요약 — 분모를 만들지 않으므로 건수와 분포만 있다 */
export const LOG_SUMMARY = {
  total: 4,
  byCategory: [
    { categoryName: '피부·홈케어', count: 2 },
    { categoryName: '수면', count: 1 },
    { categoryName: '마음', count: 1 },
  ],
}

/**
 * 기록 탭 잠금 (홈 응답 NOW-HOME-001의 unlock 블록).
 * 기록한 날이 쌓여야 주간·월간 발견이 열린다.
 */
export const LOG_UNLOCK = {
  recordedDays: 7,
  weeklyOpen: true,
  monthlyOpen: false,
  monthlyNeed: 30,
}

/**
 * 케어 코치 (NOW-COACH-001 POST /coach/ask).
 *
 * 판정은 규칙이 하고 AI는 문장만 만든다. 그래서 화면은 답변과 함께 근거(basis)를
 * 반드시 같이 띄운다 (NOW-COACH-003). 서버가 붙는 자리라 여기서는 목으로 흉내만 낸다.
 *
 *   level  no   오늘은 하지 않는 편이 낫다
 *          soft 조건을 낮춰서라면 괜찮다
 *          ok   해도 된다
 */
export const COACH_SUGGESTIONS = [
  '오늘 각질 관리 해도 되나요',
  '오늘 팩 해도 될까요',
  '선크림은 발라야 하나요',
]

export const COACH_MOCK_ANSWER = {
  answer: '클리닉에서 3일간 피하라고 안내받으셨습니다. 오늘은 쉬시는 것이 맞습니다.',
  basis: { type: 'clinicNote', label: '클리닉 안내', sent: 2 },
  level: 'no',
  generatedBy: 'rule+llm',
}

/** 케어 코치 답변 수위 배지 */
export const COACH_LEVEL = {
  no: { label: '오늘은 쉬어요', tone: 'stop' },
  soft: { label: '가볍게라면', tone: 'soft' },
  ok: { label: '해도 괜찮아요', tone: 'ok' },
}

/** 캐릭터 소개(F_CharacterIntro)의 말풍선. 위치는 CSS에서 시안 좌표로 잡는다. */
export const CHARACTER_TRAITS = [
  { key: 'step', label: '작은 한 걸음' },
  { key: 'steady', label: '꾸준히', desc: '작은 걸음을 이어가요' },
  { key: 'slow', label: '천천히', desc: '서두르지 않아요' },
  { key: 'light', label: '가볍게', desc: '필요한 만큼만 해요' },
  { key: 'easy', label: '편안하게', desc: '힘든 날에는 쉬어가요' },
  { key: 'rest', label: '쉬어가기' },
]

/**
 * E01 첫 발자국 카드 (시안에 있는 예시 문구)
 *
 * situation · firstStep · nextSteps 세 가지는 상세(F03)의 블록 3개에 그대로 들어간다.
 * 시안에서는 이 세 칸이 비어 있었는데, 명세서(NOW-STEP-001)가 「그때 상황 · 첫 발자국 ·
 * 그다음에 한 일」 셋을 내려주기로 되어 있어 그 순서대로 채웠다.
 * 서버가 붙으면 GET /footsteps 응답의 같은 이름 필드로 바뀐다.
 */
export const FIRST_STEP_CARDS = [
  {
    id: 'water',
    quote: '아침에 눈을 뜨면 물 한 잔부터 마셨어요',
    who: '26세·직장인·익명',
    body: '하루에 물을 많이 마셔야 한다는 건 알고 있었지만, 2L 마시기 같은 목표를 세우면 오후가 되어서야 물을 거의 안 마셨다는 걸 깨닫곤 했어요. 그래서 하루 전체 양을 신경 쓰는 대신 아침에 일어난 직후 물 한 잔을 마시는 것만 첫 목표로 만들었어요.',
    point: '큰 숫자를 채우려고 애쓰기보다, 이미 매일 하는 행동에 아주 작은 습관 하나를 붙여보세요.',
    situation:
      '하루에 2L를 마셔야 한다고 정해두니 오후쯤 절반도 못 마신 게 보였고, 그걸 확인할 때마다 오늘도 실패했다는 기분이 들었어요.',
    firstStep: '일어나자마자 머리맡에 둔 물 한 잔을 마셨어요',
    nextSteps: [
      '자기 전에 물컵을 머리맡에 미리 채워두기',
      '하루 총량은 세지 않고 아침 한 잔만 확인하기',
      '점심 먹고 자리에 앉을 때 한 잔 더 마시기',
    ],
  },
  {
    id: 'curtain',
    quote: '아침에 일어나면 커튼부터 열어봤어요',
    who: '31세·프리랜서·익명',
    body: '아침을 좀 더 개운하게 시작하고 싶어서 일찍 일어나기, 산책하기 같은 계획을 세워봤지만 며칠을 넘기기 어려웠어요. 그래서 일어나는 시간을 바꾸는 대신, 눈을 뜨면 커튼을 열고 잠깐 햇빛을 보는 것만 첫 목표로 정했어요.',
    point: '완벽한 아침 루틴을 만들려고 하기보다, 감각이 깨어나는 신호가 될 행동 하나만 정해보세요.',
    situation:
      '일찍 일어나기와 산책을 한꺼번에 시작했다가 사흘 만에 다 놓쳤어요. 기상 시간을 바꾸는 일 자체가 제일 어려웠거든요.',
    firstStep: '눈을 뜨면 침대에서 손을 뻗어 커튼을 열었어요',
    nextSteps: [
      '커튼을 연 자리에서 1분만 서 있기',
      '창가에서 물 한 잔 마시기',
      '주말에도 커튼 여는 것만 똑같이 하기',
    ],
  },
  {
    id: 'wash',
    quote: '아무리 피곤해도 자기 전에는 얼굴부터 씻었어요',
    who: '28세·대학원생·익명',
    body: '늦게 들어온 날에는 화장을 지우는 것조차 귀찮아서 그대로 잠들 때가 있었어요. 여러 단계로 클렌징을 완벽하게 하려고 하기보다 잠들기 전 얼굴을 깨끗하게 씻는 것만큼은 꼭 지키기로 했어요.',
    point: '피곤한 날에도 할 수 있을 만큼 가장 기본적인 한 단계만 남겨보세요.',
    situation:
      '클렌징을 제대로 하려면 세 단계는 해야 한다고 생각했는데, 늦게 들어온 날에는 그게 부담이라 아예 안 하고 잠들었어요.',
    firstStep: '지우는 단계를 하나로 줄이고 세수만 하고 잤어요',
    nextSteps: [
      '세면대 앞에 클렌저 하나만 꺼내 두기',
      '피곤한 날에는 세수까지만 하고 끝내기',
      '여유 있는 날에만 한 단계씩 더 붙이기',
    ],
  },
  {
    id: 'mask',
    quote: '일요일 밤에는 마스크팩 하나만 챙겼어요',
    who: '34세·직장인·익명',
    body: '매일 피부 관리를 꼼꼼하게 해야 한다는 생각 때문에 오히려 아무것도 하지 않는 날이 많았어요. 그래서 매일 특별한 관리를 하려는 대신 일주일에 한 번, 마스크팩 한 장을 사용하는 시간만 정해뒀어요.',
    point: '매일 해야 한다는 부담을 내려놓고, 일주일에 한 번부터 시작해도 충분해요.',
    situation:
      '매일 관리해야 한다고 생각하니 오늘도 못 했다는 마음이 쌓였고, 그러다 보니 아예 손을 안 대는 날이 늘었어요.',
    firstStep: '일요일 밤으로 날을 하나만 정하고 팩 한 장을 붙였어요',
    nextSteps: [
      '일요일에 쓸 팩을 미리 한 장 빼 두기',
      '못 한 주는 넘기고 다음 일요일에 다시 하기',
      '익숙해지면 수요일 밤 한 번만 더 붙이기',
    ],
  },
]
