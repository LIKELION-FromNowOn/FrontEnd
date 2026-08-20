import { useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import FirstStepCard from '../../components/FirstStepCard'
import { getFootsteps } from '../../api/records'
import { useApi } from '../../api/useApi'
import { FIRST_STEP_CARDS } from '../options'
import './FirstStepListScreen.css'

/** F02_FirstStep/List — 첫 발자국 카드 목록 */
export default function FirstStepListScreen() {
  const navigate = useNavigate()

  /* 사례는 상세까지 한 번에 온다(NOW-STEP-001). 별도 상세 API 는 명세서에서 제외됐다.
     시드가 비어 있으면 빈 배열이 오므로 그때는 시안 값으로 그린다. */
  const list = useApi(getFootsteps)
  const cards = list.data?.footsteps?.length ? list.data.footsteps : FIRST_STEP_CARDS

  return (
    <HeroPanel
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
        {cards.map((card) => (
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
