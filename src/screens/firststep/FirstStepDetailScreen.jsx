import HeroPanel from '../../components/HeroPanel'
import Button from '../../components/ui/Button'
import { FIRST_STEP_CARDS } from '../options'
import './FirstStepDetailScreen.css'

/**
 * F03_FirstStep/Detail — 첫 발자국 상세 (바텀시트 형태).
 * 시안에서 인용구 아래 블록 3개는 아직 내용이 비어 있어 자리만 잡아둔다.
 */
export default function FirstStepDetailScreen() {
  const card = FIRST_STEP_CARDS[0]

  return (
    <HeroPanel nickname="예니">
      <div className="fsdetail">
        <span className="fsdetail__handle" aria-hidden />

        <section className="fsdetail__quote-box">
          <h1 className="fsdetail__quote">“{card.quote}”</h1>
          <p className="fsdetail__who">{card.who}</p>
        </section>

        {/* 내용 미정 블록 — 시안에 텍스트가 아직 없음 */}
        <div className="fsdetail__block fsdetail__block--sm" />
        <div className="fsdetail__block fsdetail__block--sm" />
        <div className="fsdetail__block fsdetail__block--lg" />

        <Button variant="soft">루틴 따라하기</Button>
      </div>
    </HeroPanel>
  )
}
