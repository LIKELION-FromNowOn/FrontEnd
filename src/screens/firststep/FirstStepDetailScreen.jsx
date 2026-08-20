import { useLocation, useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import Button from '../../components/ui/Button'
import { getFootsteps } from '../../api/records'
import { useApi } from '../../api/useApi'
import { useComingSoon } from '../../components/useComingSoon'
import './FirstStepDetailScreen.css'

/**
 * F03_FirstStep/Detail — 첫 발자국 상세 (바텀시트 형태).
 *
 * 시안에서는 인용구 아래 블록 3개가 빈칸으로 왔는데, 명세서(NOW-STEP-001)가
 * 「그때 상황 · 첫 발자국 · 그다음에 한 일」 셋을 내려주기로 되어 있어
 * 블록 수가 정확히 맞는다. 그 순서대로 채웠다.
 *
 * ⚠️ 예전에는 시안 상수의 **첫 카드**를 고정으로 그렸다. 어느 카드를 눌러도 같은 내용이
 *    떴다는 뜻이다(2026-08-21). 이제 넘어올 때 받은 id 로 GET /footsteps 에서 찾는다.
 */
export default function FirstStepDetailScreen() {
  const navigate = useNavigate()
  const wanted = useLocation().state?.id ?? null

  const footsteps = useApi(getFootsteps)
  const cards = footsteps.data?.footsteps ?? []
  const card = cards.find((c) => c.id === wanted) ?? cards[0] ?? null

  /* 「루틴 따라하기」를 저장하는 API 가 없다. 홈의 「이어가는 첫 발자국」을 채울
     streak 도 서버가 주지 않는다. 그래서 눌러도 갈 곳이 없다 —
     예전에는 오늘의 케어 타이머(/care/start)로 보냈는데, 첫 발자국과 오늘의 케어는
     다른 것이라 엉뚱한 화면이 떴다. 준비 중으로 알린다. */
  const [comingSoon, notify] = useComingSoon()

  if (!card) {
    return (
      <HeroPanel>
        <div className="fsdetail">
          <span className="fsdetail__handle" aria-hidden />
          <p className="fsdetail__text">
            {footsteps.loading ? '불러오는 중…' : '사례를 불러오지 못했어요'}
          </p>
          <Button variant="soft" onClick={() => navigate(-1)}>
            돌아가기
          </Button>
        </div>
      </HeroPanel>
    )
  }

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
            {(card.nextSteps ?? []).map((s, i) => (
              <li key={s} className="fsdetail__step">
                <span className="fsdetail__step-no">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <Button variant="soft" onClick={() => notify('루틴 따라하기')}>
          루틴 따라하기
        </Button>

        {comingSoon}
      </div>
    </HeroPanel>
  )
}
