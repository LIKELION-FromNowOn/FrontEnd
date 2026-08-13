import Slot from '../../components/ui/Slot'
import FirstStepCard from '../../components/FirstStepCard'
import { FIRST_STEP_CARDS } from '../options'
import './FirstStepListScreen.css'

/** E01_FirstStep/Example — 첫 발자국 카드 목록 */
export default function FirstStepListScreen() {
  return (
    <div className="fslist">
      <header className="fslist__header">
        <div className="fslist__user">
          <Slot label="캐릭터" shape="circle" width={28} sm />
          <span className="fslist__nickname">닉네임</span>
        </div>
        <div className="fslist__actions">
          <button type="button" className="fslist__icon" aria-label="캘린더">
            ▤
          </button>
          <button type="button" className="fslist__icon" aria-label="마이">
            ○
          </button>
        </div>
      </header>

      <div className="fslist__body">
        {FIRST_STEP_CARDS.map((card) => (
          <FirstStepCard key={card.id} card={card} compact onMore={() => {}} />
        ))}
      </div>
    </div>
  )
}
