import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import RejectSheet from '../../components/RejectSheet'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import FirstStepCard from '../../components/FirstStepCard'
import StreakCard from '../../components/StreakCard'
import { getHome } from '../../api/today'
import { useApi } from '../../api/useApi'
import { ACTIVE_STREAK, FIRST_STEP_CARDS, TODAY_ACTION } from '../options'
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

  const today = home.data?.today ?? TODAY_ACTION
  const streak = home.data ? home.data.streak : ACTIVE_STREAK
  /* 홈 응답의 footstepCard 는 요약만 온다. 카드 본문은 사례 목록에서 같은 id 를 찾아 쓴다. */
  const card =
    FIRST_STEP_CARDS.find((c) => c.id === home.data?.footstepCard?.id) ??
    FIRST_STEP_CARDS[0]

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
        <h3 className="home__care-title">{today.title}</h3>
        <p className="home__care-desc">피부 부담을 줄이고 회복을 돕는 구성이에요</p>

        <Button variant="soft" onClick={() => navigate('/care/start')}>
          시작하기
        </Button>

        <div className="home__care-links">
          <button type="button" className="home__link">
            다른 방식
          </button>
          <button type="button" className="home__link" onClick={() => setRejecting(true)}>
            오늘은 쉬어갈게요
          </button>
        </div>
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
          onSubmit={() => setRejecting(false)}
        />
      )}
    </HeroPanel>
  )
}
