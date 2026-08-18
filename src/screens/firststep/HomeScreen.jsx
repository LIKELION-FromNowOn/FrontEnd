import { Link, useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import FirstStepCard from '../../components/FirstStepCard'
import { FIRST_STEP_CARDS } from '../options'
import './HomeScreen.css'

/** F01_Home — 히어로 + 오늘의 케어 + 이어가는 첫 발자국 + 오늘의 첫 발자국 */
const STREAK_TOTAL = 7
const STREAK_DONE = 1

export default function HomeScreen() {
  const navigate = useNavigate()
  const card = FIRST_STEP_CARDS[0]

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
            <Link to="/first-step" className="hero__shortcut hero__shortcut--solid">
              <span className="hero__shortcut-title">
                내 첫 발자국
                <br />
                관리하기
              </span>
              <span className="hero__shortcut-arrow" aria-hidden>
                ›
              </span>
            </Link>
            <Link to="/check" className="hero__shortcut hero__shortcut--tint">
              <span className="hero__shortcut-title">오늘의 컨디션</span>
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
        <h3 className="home__care-title">세안하고 크림 한번만 바르기</h3>
        <p className="home__care-desc">피부 부담을 줄이고 회복을 돕는 구성이에요</p>

        <Button variant="soft" onClick={() => navigate('/care/start')}>
          시작하기
        </Button>

        <div className="home__care-links">
          <button type="button" className="home__link">
            다른 방식
          </button>
          <button type="button" className="home__link">
            오늘은 쉬어갈게요
          </button>
        </div>
      </section>

      {/* 이어가는 첫 발자국 */}
      <h2 className="home__section">이어가는 첫 발자국</h2>
      <section className="home__streak">
        <h3 className="home__streak-title">아침에 눈 뜨면 물 마시기</h3>
        <p className="home__streak-sub">오늘이 첫 번째 날이에요</p>

        <ol className="home__dots">
          {Array.from({ length: STREAK_TOTAL }, (_, i) => (
            <li
              key={i}
              className={`home__dot${i < STREAK_DONE ? ' is-done' : ''}`}
              aria-current={i === STREAK_DONE - 1 ? 'step' : undefined}
            >
              {i + 1}
            </li>
          ))}
        </ol>

        <Button variant="cream">오늘도 이어가기</Button>
      </section>

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
    </HeroPanel>
  )
}
