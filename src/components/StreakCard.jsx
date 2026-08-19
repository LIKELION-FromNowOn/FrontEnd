import Character from './ui/Character'
import Button from './ui/Button'
import './StreakCard.css'

/**
 * 「이어가는 첫 발자국」 카드.
 * 홈(F01 루틴 따라하기 상태)과 첫 발자국 관리(F_FirstStepManage)가 같은 카드를 쓴다.
 *
 *   title   : 따라가는 중인 루틴 문장
 *   day     : 오늘이 몇 번째 날인지 (1부터)
 *   total   : 전체 일수 — 시안은 7일
 *   variant : 'mocha'(홈·관리 화면) | 'cream'(기록 홈 H01)
 *
 * day·total은 서버(NOW-STEP 계열)에서 내려올 값이라 기본값을 두지 않는다.
 */
export default function StreakCard({
  title,
  day,
  total = 7,
  variant = 'mocha',
  onContinue,
}) {
  return (
    <section className={`streak streak--${variant}`}>
      <div className="streak__head">
        <div className="streak__char">
          <Character variant="leaf" />
        </div>

        <div className="streak__text">
          <h3 className="streak__title">{title}</h3>
          <p className="streak__sub">오늘이 {day}번째 날이에요</p>
        </div>
      </div>

      <ol className="streak__dots">
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            className={`streak__dot${i < day ? ' is-done' : ''}`}
            aria-current={i === day - 1 ? 'step' : undefined}
          >
            {i + 1}
          </li>
        ))}
      </ol>

      {/* 모카 카드 위에서는 크림 버튼, 크림 카드 위에서는 진한 갈색 버튼 */}
      <Button variant={variant === 'cream' ? 'cocoa' : 'cream'} onClick={onContinue}>
        오늘도 이어가기
      </Button>
    </section>
  )
}
