import { Link, useNavigate } from 'react-router-dom'
import Slot from '../../components/ui/Slot'
import Button from '../../components/ui/Button'
import FirstStepCard from '../../components/FirstStepCard'
import { FIRST_STEP_CARDS } from '../options'
import './HomeScreen.css'

/** 홈 — 상단 헤더 + 카테고리 3개 + 배너 + 오늘의 첫 발자국 카드 */
const CATEGORIES = [
  { key: 'condition', label: '나의 컨디션', to: '/check' },
  { key: 'firststep', label: '첫 발자국', to: '/first-step' },
  { key: 'subtract', label: '덜어내기', to: '/subtract' },
]

export default function HomeScreen() {
  const navigate = useNavigate()
  const card = FIRST_STEP_CARDS[0]

  return (
    <div className="home">
      <header className="home__header">
        <div className="home__user">
          <Slot label="캐릭터" shape="circle" width={28} sm />
          <span className="home__nickname">닉네임</span>
        </div>
        <div className="home__actions">
          <button type="button" className="home__icon" aria-label="캘린더">
            ▤
          </button>
          <button type="button" className="home__icon" aria-label="알림">
            ○
          </button>
        </div>
      </header>

      <div className="home__body">
        <nav className="home__categories">
          {CATEGORIES.map((c) => (
            <Link key={c.key} to={c.to} className="home__category">
              <Slot label="아이콘" shape="circle" width={64} sm />
              <span className="home__category-label">{c.label}</span>
            </Link>
          ))}
        </nav>

        <section className="home__banner">
          <p className="home__banner-text">
            벌은 작은 행동을 꾸준히 쌓아가는
            <br />
            서비스의 방향성을 상징합니다
          </p>
          <Slot label="캐릭터" width={72} height={72} />
        </section>

        <FirstStepCard card={card} onMore={() => navigate('/first-step')}>
          <div className="home__card-actions">
            <Button onClick={() => navigate('/first-step')}>루틴 따라하기</Button>
            <button type="button" className="home__more-link">
              다른 첫발자국 카드 추천받기
            </button>
          </div>
        </FirstStepCard>
      </div>
    </div>
  )
}
