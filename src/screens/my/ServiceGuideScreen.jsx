import SubPage from '../../components/SubPage'
import { ComingSoonBanner } from '../../components/ComingSoon'
import { useComingSoon } from '../../components/useComingSoon'

/**
 * I04_ServiceGuide — 서비스 안내 목록.
 *
 * ⚠️ **이번 범위 밖이다.** 답변 본문을 주는 API 가 없다(명세 36건에 없음).
 *    질문 줄은 시안대로 남기고, 누르면 준비 중임을 알린다(2026-08-21 결정).
 */
const QUESTIONS = [
  '지금부터는 어떤 서비스인가요?',
  '첫 발자국이란 무엇인가요?',
  '덜어내기란 무엇인가요?',
  '기록은 어떻게 활용되나요?',
  '개인정보와 문의 안내',
]

export default function ServiceGuideScreen() {
  const [comingSoon, notify] = useComingSoon()

  return (
    <SubPage
      title="서비스 안내"
      lead={
        <>
          지금부터는 오늘 상태를 판정하여 피부 관리를
          <br />
          조정해 주는 서비스입니다.
        </>
      }
    >
      <ComingSoonBanner>답변은 다음 단계에서 준비 중이에요</ComingSoonBanner>

      <div className="subpage__card">
        {QUESTIONS.map((q) => (
          <button key={q} type="button" className="subpage__row" onClick={() => notify()}>
            <span className="subpage__row-label">{q}</span>
            <span className="subpage__chevron" aria-hidden>
              ›
            </span>
          </button>
        ))}
      </div>

      {comingSoon}
    </SubPage>
  )
}
