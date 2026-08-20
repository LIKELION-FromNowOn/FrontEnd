import { useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import Button from '../../components/ui/Button'
import { FIRST_STEP_CARDS } from '../options'
import './FirstStepDetailScreen.css'

/**
 * F03_FirstStep/Detail — 첫 발자국 상세 (바텀시트 형태).
 *
 * 시안에서는 인용구 아래 블록 3개가 빈칸으로 왔는데, 명세서(NOW-STEP-001)가
 * 「그때 상황 · 첫 발자국 · 그다음에 한 일」 셋을 내려주기로 되어 있어
 * 블록 수가 정확히 맞는다. 그 순서대로 채웠다.
 */
export default function FirstStepDetailScreen() {
  const navigate = useNavigate()
  const card = FIRST_STEP_CARDS[0]

  return (
    <HeroPanel>
      <div className="fsdetail">
        <span className="fsdetail__handle" aria-hidden />

        <section className="fsdetail__quote-box">
          <h1 className="fsdetail__quote">“{card.quote}”</h1>
          <p className="fsdetail__who">{card.who}</p>
        </section>

        <section className="fsdetail__block">
          <h2 className="fsdetail__label">그때의 상황</h2>
          <p className="fsdetail__text">{card.situation}</p>
        </section>

        <section className="fsdetail__block">
          <h2 className="fsdetail__label">맨 처음 한 일</h2>
          <p className="fsdetail__text fsdetail__text--lead">{card.firstStep}</p>
        </section>

        <section className="fsdetail__block fsdetail__block--grow">
          <h2 className="fsdetail__label">그다음에 한 일</h2>
          <ol className="fsdetail__steps">
            {card.nextSteps.map((s, i) => (
              <li key={s} className="fsdetail__step">
                <span className="fsdetail__step-no">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <Button variant="soft" onClick={() => navigate('/care/start')}>
          루틴 따라하기
        </Button>
      </div>
    </HeroPanel>
  )
}
