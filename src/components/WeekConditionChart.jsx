import { CONDITION_LEVELS } from '../screens/options'
import './WeekConditionChart.css'

/**
 * 이번 주 컨디션 막대그래프.
 * 오늘의 컨디션 허브(F_WeeklyCondition)와 기록 탭(H02)이 같은 그래프를 쓴다.
 *
 * 세로축은 등급이 있는 컨디션만 세운다 — 「잘 모르겠어요」는 좋고 나쁨의 정도가 아니라
 * 답을 미룬 것이라, 답하지 않은 날은 level 을 null 로 두고 막대를 비운다.
 *
 * ⚠️ **기본값을 목으로 두지 않는다.** 한때 8.11~8.17 이 박혀 있어서, 8월 21일에 열어도
 *    8월 둘째 주 그래프가 모든 사용자에게 똑같이 떴다(2026-08-21).
 *    주간 컨디션을 주는 API 가 아직 없다 — 생기면 days 로 넘겨 주면 된다.
 */
const LEVELS = CONDITION_LEVELS.length

const barHeight = (level) => (level == null ? 0 : `${(level / LEVELS) * 100}%`)

/** level 1이 맨 아래(가장 나쁨)라 배열 순서와 뒤집혀 있다 */
const levelLabel = (level) =>
  level == null ? '답하지 않음' : CONDITION_LEVELS[LEVELS - level].label

export default function WeekConditionChart({ days = [] }) {
  if (!days.length) {
    return (
      <section className="wchart wchart--empty">
        <p className="wchart__empty">
          컨디션을 며칠 기록하면
          <br />
          이번 주 그래프를 보여드릴게요
        </p>
      </section>
    )
  }

  const range = `${days[0].date}~${days[days.length - 1].date}`

  return (
    <section className="wchart">
      <p className="wchart__title">컨디션 {range}</p>

      <div className="wchart__plot">
        {/* CONDITION_LEVELS가 좋은 것부터라 그대로 쓰면 위가 좋은 쪽이 된다 */}
        <ul className="wchart__scale" aria-hidden>
          {CONDITION_LEVELS.map((c) => (
            <li key={c.key} className="wchart__tick">
              {c.emoji}
            </li>
          ))}
        </ul>

        <ol className="wchart__bars">
          {days.map((d) => (
            <li key={d.date} className="wchart__slot">
              <div className="wchart__bar" style={{ height: barHeight(d.level) }}>
                <span className="wchart__date">{d.date}</span>
              </div>
              <span className="sr-only">
                {d.date} {levelLabel(d.level)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
