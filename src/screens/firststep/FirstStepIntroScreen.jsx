import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Illust from '../../components/ui/Illust'
import FirstStepCard from '../../components/FirstStepCard'
import { FIRST_STEP_CARDS } from '../options'
import './FirstStepIntroScreen.css'

/**
 * E01_FirstStep/Example — 온보딩 직후 첫 발자국 소개 (NOW-STEP-004).
 *
 * 명세서상 처음 들어온 사용자에게 딱 한 번만 보여주는 화면이라,
 * API 연동 시 노출 여부는 서버 플래그로 판단하게 된다.
 */
export default function FirstStepIntroScreen() {
  const navigate = useNavigate()
  const [index, setIndex] = useState(0)
  const card = FIRST_STEP_CARDS[index]

  const next = () => setIndex((i) => (i + 1) % FIRST_STEP_CARDS.length)

  return (
    <div className="fsintro">
      <div className="fsintro__body">
        <h1 className="fsintro__title">
          처음부터 잘하려고 하지
          <br />
          않아도 괜찮아요
        </h1>
        <p className="fsintro__lead">
          비슷한 고민을 가진 사람들이 가장 먼저 시작했던
          <br />
          작은 습관을 모아봤어요
        </p>

        <div className="fsintro__illust">
          <Illust name="firstStep" />
        </div>

        <FirstStepCard card={card} onMore={() => navigate('/first-step/detail')} />
      </div>

      <div className="fsintro__actions">
        <button type="button" className="fsintro__btn fsintro__btn--tint" onClick={next}>
          다른 첫 발자국 보기
        </button>
        <button
          type="button"
          className="fsintro__btn fsintro__btn--solid"
          onClick={() => navigate('/home')}
        >
          나중에 볼게요
        </button>
      </div>
    </div>
  )
}
