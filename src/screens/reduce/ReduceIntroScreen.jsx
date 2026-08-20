import { Link, useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import './ReduceIntroScreen.css'

/** G01_ReduceIntro — 덜어내기 시작 화면 */
/* 문구는 2026-08-21 시안에서 그대로 옮겼다. 화면에서 지어내지 않는다. */
const STEPS = [
  { no: 1, label: '오늘 컨디션을 먼저 봤어요', to: '/reduce/result' },
  { no: 2, label: '꼭 필요한 관리는 남겼어요', to: '/reduce/result' },
  { no: 3, label: '덜어내기 쉬운 항목을 골랐어요', to: '/reduce/result' },
]

export default function ReduceIntroScreen() {
  const navigate = useNavigate()

  return (
    <HeroPanel
      hero={
        <div className="reduce__hero">
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

          {/* 홈과 같은 바로가기 카드다. 모양은 hero__shortcut 을 그대로 쓰고
              자리만 이 화면 것으로 잡는다. */}
          <div className="reduce__shortcuts">
            <Link to="/condition" className="hero__shortcut hero__shortcut--tint">
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

          {/* fullPlain 은 배경 없는 전신이라 모카 히어로 위에 그대로 얹힌다.
              아래 흰 패널과 맞닿게 내려 앉힌다(홈과 같은 방식). */}
          <div className="reduce__character">
            <Character variant="fullPlain" />
          </div>
        </div>
      }
    >
      <p className="reduce__notice">
        이 서비스는 피부를 진단하지 않습니다.
        <br />
        오늘의 신호와 관리 안내를 바탕으로 순서를 정합니다.
      </p>

      <ol className="reduce__steps">
        {STEPS.map((s) => (
          <li key={s.no}>
            <Link to={s.to} className="reduce__step">
              <span className="reduce__step-no">{s.no}</span>
              <span className="reduce__step-label">{s.label}</span>
              <span className="reduce__step-arrow" aria-hidden>
                ›
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <h2 className="reduce__section">
        오늘 덜어낼 것<span className="reduce__badge reduce__badge--rec">추천</span>
      </h2>

      <div className="reduce__item">
        <span className="reduce__item-name">레티놀</span>
        <span className="reduce__badge reduce__badge--reduce">덜어내기</span>
      </div>

      <div className="reduce__cta">
        <Button onClick={() => navigate('/reduce/result')}>덜어내기 결과보기</Button>
      </div>
    </HeroPanel>
  )
}
