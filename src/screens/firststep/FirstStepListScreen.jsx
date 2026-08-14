import { useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import FirstStepCard from '../../components/FirstStepCard'
import { FIRST_STEP_CARDS } from '../options'
import './FirstStepListScreen.css'

/** F02_FirstStep/List — 첫 발자국 카드 목록 */
export default function FirstStepListScreen() {
  const navigate = useNavigate()

  return (
    <HeroPanel
      nickname="예니"
      hero={
        <button
          type="button"
          className="fslist__back"
          onClick={() => navigate(-1)}
          aria-label="뒤로"
        >
          ←
        </button>
      }
    >
      <div className="fslist__cards">
        {FIRST_STEP_CARDS.map((card) => (
          <FirstStepCard
            key={card.id}
            card={card}
            compact
            onMore={() => navigate('/first-step/detail')}
          />
        ))}
      </div>
    </HeroPanel>
  )
}
