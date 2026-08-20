import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import RejectSheet from '../../components/RejectSheet'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import FirstStepCard from '../../components/FirstStepCard'
import StreakCard from '../../components/StreakCard'
import { getHome, getToday, rejectToday, rerollToday } from '../../api/today'
import { ERROR } from '../../api/errors'
import { useApi, useAction } from '../../api/useApi'
import { ACTIVE_STREAK, FIRST_STEP_CARDS } from '../options'
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
  const noCandidate = !todayApi.loading && !todayApi.error && action == null
  /* 오늘 이미 끝낸 경우. 다시 시작·다른 방식을 띄우면 기록이 두 번 남는다. */
  const done = action?.status === 'done'

  const streak = home.data ? home.data.streak : ACTIVE_STREAK
  /* 홈 응답의 footstepCard 는 요약만 온다. 카드 본문은 사례 목록에서 같은 id 를 찾아 쓴다. */
  const card =
    FIRST_STEP_CARDS.find((c) => c.id === home.data?.footstepCard?.id) ??
    FIRST_STEP_CARDS[0]

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
      nickname="예니"
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
              {/* 루틴 카드가 없는 날은 홈이 허전해서 시안이 문구를 두 줄로 늘린다 */}
              <span className="hero__shortcut-title">
                오늘의 컨디션
                {!streak && (
                  <>
                    {' '}
                    및
                    <br />
                    관리 항목
                  </>
                )}
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
        ) : done ? (
          <>
            <h3 className="home__care-title">{action.title}</h3>
            <p className="home__care-desc">오늘은 이미 하셨어요. 여기까지로 충분해요</p>
            <Button variant="soft" onClick={() => navigate('/records')}>
              기록 보러 가기
            </Button>
          </>
        ) : noCandidate || rested ? (
          <>
            <h3 className="home__care-title">
              {rested ? '오늘은 여기까지 해도 괜찮아요' : '오늘 드릴 케어가 없어요'}
            </h3>
            <p className="home__care-desc">
              대신 아래 첫 발자국 카드를 한번 읽어보셔도 좋아요
            </p>
          </>
        ) : (
          <>
            <h3 className="home__care-title">
              {todayApi.loading ? '오늘의 케어를 고르는 중…' : action.title}
            </h3>
            <p className="home__care-desc">피부 부담을 줄이고 회복을 돕는 구성이에요</p>

            <Button
              variant="soft"
              disabled={todayApi.loading}
              onClick={() => navigate('/care/start')}
            >
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
                disabled={todayApi.loading || rerolling.pending || action?.rerollLeft === 0}
                onClick={onReroll}
              >
                {rerolling.pending ? '고르는 중…' : '다른 방식'}
              </button>
              <button
                type="button"
                className="home__link"
                disabled={todayApi.loading}
                onClick={() => setRejecting(true)}
              >
                오늘은 쉬어갈게요
              </button>
            </div>
          </>
        )}
      </section>

      {/* 이어가는 첫 발자국 — 따라가는 루틴이 있을 때만 */}
      {streak && (
        <>
          <h2 className="home__section">이어가는 첫 발자국</h2>
          <StreakCard
            title={streak.title}
            day={streak.day}
            total={streak.total}
            onContinue={() => navigate('/care/start')}
          />
        </>
      )}

      {/* 오늘의 첫 발자국 */}
      <h2 className="home__section">오늘의 첫 발자국</h2>
      <FirstStepCard card={card} onMore={() => navigate('/first-step/detail')}>
        <div className="home__card-actions">
          <Button variant="soft" onClick={() => navigate('/first-step/detail')}>
            루틴 따라하기
          </Button>
          <button type="button" className="home__link home__link--center">
            다른 첫발자국 카드 추천받기
          </button>
        </div>
      </FirstStepCard>

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
