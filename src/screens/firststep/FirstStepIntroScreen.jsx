import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Slot from '../../components/ui/Slot'
import Button from '../../components/ui/Button'
import FirstStepCard from '../../components/FirstStepCard'
import { FIRST_STEP_CARDS } from '../options'
import './FirstStepIntroScreen.css'

/** E01_FirstStep — 온보딩 직후 첫 발자국 소개 (카드 1장 + 다른 카드 보기) */
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

        <Slot label="캐릭터" width={200} height={200} />

        <div className="fsintro__card">
          <FirstStepCard card={card} onMore={() => navigate('/first-step')} />
        </div>
      </div>

      <div className="fsintro__actions">
        <Button onClick={next}>다른 첫 발자국 보기</Button>
        <Button variant="secondary" onClick={() => navigate('/home')}>
          나중에 볼게요
        </Button>
      </div>
    </div>
  )
}
