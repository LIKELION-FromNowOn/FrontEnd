import { Link, useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import Slot from '../../components/ui/Slot'
import Button from '../../components/ui/Button'
import './ReduceIntroScreen.css'

/** G01_ReduceIntro — 덜어내기 시작 화면 */
const STEPS = [
  { no: 1, to: '/reduce/result' },
  { no: 2, to: '/reduce/result' },
  { no: 3, to: '/reduce/result' },
]

export default function ReduceIntroScreen() {
  const navigate = useNavigate()

  return (
    <HeroPanel
      nickname="예니"
      hero={
        <div>
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
          <div className="reduce__banner">
            <Slot label="배너" height={96} />
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
              <span className="reduce__step-arrow" aria-hidden>
                ›
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <h2 className="reduce__section">
        오늘 덜어낼 것
        <span className="reduce__badge reduce__badge--rec">추천</span>
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
