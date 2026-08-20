import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import RejectSheet from '../../components/RejectSheet'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import FirstStepCard from '../../components/FirstStepCard'
import { getHome, getToday, rejectToday, rerollToday } from '../../api/today'
import { getFootsteps } from '../../api/records'
import { ERROR } from '../../api/errors'
import { useApi, useAction } from '../../api/useApi'
import './HomeScreen.css'

/**
 * F01_Home — 히어로 + 오늘의 케어 + (이어가는 첫 발자국) + 오늘의 첫 발자국
 *
 * 시안이 두 상태로 나왔다.
 *   루틴 없음  — 「이어가는 첫 발자국」 없음, 바로가기는 «오늘의 컨디션 및 관리 항목»
 *   루틴 있음  — 카드가 들어가고 바로가기가 «오늘의 컨디션» 한 줄로 줄어든다
 */
export default function HomeScreen() {
  const navigate = useNavigate()
  const [rejecting, setRejecting] = useState(false)

  /* 홈은 한 번에 집계해서 받는다(NOW-HOME-001). 여러 번 부르면 첫 화면이 느려진다.
     실패하면 목으로 계속 그린다 — 첫 화면이 비면 앱이 죽은 것처럼 보인다. */
  const home = useApi(getHome)
  /* 홈은 오늘 보여줄 사례의 **id 와 요약만** 준다. 본문은 사례 목록에서 같은 id 를 찾는다.
     ⚠️ 시안 상수로 찾으면 안 된다 — 서버 id 는 fs_101 꼴이고 상수 id 는 'water' 꼴이라
     늘 못 찾고 첫 카드로 떨어진다. 서버가 고른 것과 다른 카드가 뜬다(2026-08-20 실측). */
  const footsteps = useApi(getFootsteps)

  /* 오늘의 케어 카드만 GET /today 로 따로 받는다(NOW-TODAY-001).
     홈 집계가 아직 목이라 거기서 온 actionId 로 다른 방식·쉬어가기를 부르면
     서버에 없는 id 라 404 ACTION_NOT_FOUND 가 난다. GET /home 이 켜지면 이 줄을 지우고
     home.data.today 로 되돌린다. */
  const todayApi = useApi(getToday)
  const rerolling = useAction(rerollToday)
  const rejectingAction = useAction(rejectToday)

  /* 다른 방식으로 바꾸면 서버가 새 행동을 준다. 그때부터는 그 값을 그린다. */
  const [swapped, setSwapped] = useState(null)
  const [rested, setRested] = useState(false)
  const action = swapped ?? todayApi.data

  /* 오늘의 행동이 없는 이유가 둘이고 가야 할 곳이 다르다.
       409 NO_EVALUATION → 덜어내기를 아직 안 했다
       200 + data: null  → 판정은 했는데 남은 항목이 없다 (첫 발자국으로) */
  const needsSubtract = todayApi.error?.code === ERROR.NO_EVALUATION
  /* ⚠️ 「행동이 없다」를 error 없음 + null 로만 보면 안 된다.
     NO_EVALUATION 이 아닌 다른 오류(관리 항목 부족 등)일 때 아래 가지로 떨어져
     action.title 을 읽다가 홈이 통째로 죽었다(2026-08-21).
     아래 렌더는 !action 하나로 본다 — 없으면 없는 것이다. */
  /* 오늘 이미 끝낸 경우. 다시 시작·다른 방식을 띄우면 기록이 두 번 남는다. */
  const done = action?.status === 'done'

  /**
   * 오늘의 첫 발자국.
   *
   * 홈 응답의 footstepCard 는 **서버가 오늘의 케어와 같은 카테고리로 골라 둔 것**이다.
   * 「다른 카드」는 전용 API 가 없다(2026-08-21 백엔드 확인) — GET /footsteps 가
   * 8건을 통째로 주므로 그 안에서 다음 것으로 넘긴다. 서버를 다시 부르지 않는다.
   * 새로고침하면 skip 이 0 으로 돌아가 서버가 고른 카드로 되돌아온다.
   *
   * ⚠️ 추천을 쉬는 날(rest)에는 footstepCard 가 null 로 온다. 그날은 카드를 안 띄운다 —
   *    아무거나 대신 보여주면 서버가 쉬라고 한 날에 앱이 계속 권하는 꼴이 된다.
   */
  const [skip, setSkip] = useState(0)

  const cards = footsteps.data?.footsteps ?? []
  const picked = home.data?.footstepCard ?? null
  const resting = Boolean(home.data) && picked == null

  const startAt = Math.max(
    0,
    cards.findIndex((c) => c.id === picked?.id),
  )
  const card = resting || !cards.length ? null : cards[(startAt + skip) % cards.length]

  /** 8건을 돌아가며 보여준다. 끝까지 가면 처음으로 돌아온다. */
  const nextCard = () => setSkip((n) => n + 1)

  /** 어느 카드를 눌렀는지 들고 간다. 안 넘기면 상세가 늘 첫 카드를 그린다. */
  const openDetail = (id) => navigate('/first-step/detail', { state: { id } })

  /** 다른 방식 (NOW-TODAY-002). 한도를 넘기면 서버가 429 REROLL_LIMIT 로 막는다. */
  const onReroll = async () => {
    if (!action) return
    try {
      setSwapped(await rerolling.run(action.actionId))
    } catch {
      /* 한도 초과 같은 거절이면 화면의 행동을 바꾸지 않는다.
         서버가 안 바꿔줬는데 화면만 바뀌면 시작하기가 엉뚱한 행동을 부른다. */
    }
  }

  /** 오늘은 쉬어가기 (NOW-TODAY-005). reason 은 time·fit·none 중 하나다. */
  const onReject = async (reason) => {
    if (!action) return
    try {
      await rejectingAction.run({ actionId: action.actionId, reason })
    } catch {
      // 실패 사유는 시트 안에 뜬다. 시트를 닫지 않아 다시 누를 수 있게 둔다.
      return
    }
    setRejecting(false)
    setRested(true)
  }

  return (
    <HeroPanel
      hero={
        <div className="home__hero">
          <h1 className="hero__title">
            지금부터,
            <br />
            오늘도 한 걸음
          </h1>
          <p className="hero__lead">
            오늘 나에게 필요한
            <br />
            작은 루틴을 시작해보세요
          </p>

          {/* 제목 오른쪽에 겹쳐 놓이는 바로가기 2개 */}
          <div className="hero__shortcuts">
            <Link
              to="/first-step/manage"
              className="hero__shortcut hero__shortcut--solid"
            >
              <span className="hero__shortcut-title">
                내 첫 발자국
                <br />
                관리하기
              </span>
              <span className="hero__shortcut-arrow" aria-hidden>
                ›
              </span>
            </Link>
            <Link to="/condition" className="hero__shortcut hero__shortcut--tint">
              {/* 「이어가는 첫 발자국」 카드가 없어져서 홈이 허전하다.
                  시안의 두 줄 문구를 그대로 쓴다. */}
              <span className="hero__shortcut-title">
                오늘의 컨디션 및
                <br />
                관리 항목
              </span>
              <span className="hero__shortcut-arrow" aria-hidden>
                ›
              </span>
            </Link>
          </div>

          {/* 아래 흰 패널과 맞닿게 히어로 왼쪽 아래에 붙인다 */}
          <div className="home__character">
            <Character variant="fullPlain" />
          </div>
        </div>
      }
    >
      {/* 오늘의 케어 */}
      <h2 className="home__section">오늘의 케어 하나만 !</h2>
      <section className="home__care">
        {needsSubtract ? (
          <>
            <h3 className="home__care-title">먼저 덜어내기를 해주세요</h3>
            <p className="home__care-desc">
              오늘 뭘 덜어낼지 정하고 나면 케어 하나를 골라드려요
            </p>
            <Button variant="soft" onClick={() => navigate('/reduce')}>
              덜어내기 하러 가기
            </Button>
          </>
        ) : todayApi.loading ? (
          <h3 className="home__care-title">오늘의 케어를 고르는 중…</h3>
        ) : !action || rested ? (
          <>
            <h3 className="home__care-title">
              {rested ? '오늘은 여기까지 해도 괜찮아요' : '오늘 드릴 케어가 없어요'}
            </h3>
            <p className="home__care-desc">
              {/* 덜어내기 말고 다른 이유로 못 받았으면 서버가 준 문장을 그대로 띄운다 */}
              {todayApi.error
                ? todayApi.errorText
                : '대신 아래 첫 발자국 카드를 한번 읽어보셔도 좋아요'}
            </p>
          </>
        ) : done ? (
          <>
            <h3 className="home__care-title">{action.title}</h3>
            <p className="home__care-desc">오늘은 이미 하셨어요. 여기까지로 충분해요</p>
            <Button variant="soft" onClick={() => navigate('/records')}>
              기록 보러 가기
            </Button>
          </>
        ) : (
          <>
            <h3 className="home__care-title">{action.title}</h3>
            <p className="home__care-desc">피부 부담을 줄이고 회복을 돕는 구성이에요</p>

            <Button variant="soft" onClick={() => navigate('/care/start')}>
              시작하기
            </Button>

            {rerolling.error && (
              <p className="home__care-error" role="alert">
                {rerolling.errorText}
              </p>
            )}

            <div className="home__care-links">
              {/* 하루 3회까지. 남은 횟수는 서버가 rerollLeft 로 알려준다(NOW-TODAY-002). */}
              <button
                type="button"
                className="home__link"
                disabled={rerolling.pending || action.rerollLeft === 0}
                onClick={onReroll}
              >
                {rerolling.pending ? '고르는 중…' : '다른 방식'}
              </button>
              <button
                type="button"
                className="home__link"
                onClick={() => setRejecting(true)}
              >
                오늘은 쉬어갈게요
              </button>
            </div>
          </>
        )}
      </section>

      {/* 오늘의 첫 발자국 — 사례를 못 받았으면 카드를 통째로 뺀다 */}
      {card && (
        <>
          <h2 className="home__section">오늘의 첫 발자국</h2>
          <FirstStepCard card={card} onMore={() => openDetail(card.id)}>
            <div className="home__card-actions">
              {/* 상세에 「그다음에 한 일」이 있다. 오늘의 케어 타이머와는 다른 화면이다. */}
              <Button variant="soft" onClick={() => openDetail(card.id)}>
                루틴 따라하기
              </Button>
              <button
                type="button"
                className="home__link home__link--center"
                disabled={cards.length < 2}
                onClick={nextCard}
              >
                다른 첫발자국 카드 추천받기
              </button>
            </div>
          </FirstStepCard>
        </>
      )}

      {rejecting && (
        /* 사유는 다음 추천에 반영될 뿐 실패로 저장되지 않는다 (NOW-TODAY-005) */
        <RejectSheet
          onClose={() => setRejecting(false)}
          onSubmit={onReject}
          pending={rejectingAction.pending}
          errorText={rejectingAction.error ? rejectingAction.errorText : null}
        />
      )}
    </HeroPanel>
  )
}
