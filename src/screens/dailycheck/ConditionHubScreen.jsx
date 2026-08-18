import { Link } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import Chip from '../../components/ui/Chip'
import { CONDITIONS, CONDITION_LEVELS, WEEK_CONDITION } from '../options'
import './ConditionHubScreen.css'

/**
 * F_WeeklyCondition — 오늘의 컨디션 (허브).
 * 홈 히어로의 «오늘의 컨디션» 바로가기가 여기로 온다.
 *
 * 읽기 전용 요약 화면이다. 고치는 일은 각 «수정하기»가 원래 화면으로 넘긴다.
 *   현재 관리 중인 항목 → C01 관리 항목 선택
 *   오늘의 컨디션      → D01 오늘 컨디션
 */

/* 오늘 답한 컨디션 · 관리 중인 항목 — 서버 연동 시 GET /me, GET /me/items 로 채운다 */
const TODAY = 'normal'
const MY_ITEMS = ['폼 클렌저', '토너·에센스', '크림·로션', '선크림 (야외)']

/** 막대 높이는 등급 수(4단계)를 비율로 편다. 답을 안 한 날(level: null)은 막대를 비운다. */
const LEVELS = CONDITION_LEVELS.length
const barHeight = (level) => (level == null ? 0 : `${(level / LEVELS) * 100}%`)
/** level 1이 맨 아래(가장 나쁨)라 배열 순서와 뒤집혀 있다 */
const levelLabel = (level) =>
  level == null ? '답하지 않음' : CONDITION_LEVELS[LEVELS - level].label

export default function ConditionHubScreen() {
  const days = WEEK_CONDITION
  const range = days.length ? `${days[0].date}~${days[days.length - 1].date}` : ''

  return (
    <SubPage title="오늘의 컨디션">
      {/* ── 현재 관리 중인 항목 ── */}
      <div className="chub__head">
        <h2 className="chub__section">현재 관리 중인 항목</h2>
        <Link to="/onboarding/care-items" className="chub__edit">
          수정하기
        </Link>
      </div>

      {MY_ITEMS.length > 0 ? (
        <ul className="chub__items">
          {MY_ITEMS.map((name) => (
            <li key={name} className="chub__item">
              {name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="chub__empty">아직 선택한 관리 항목이 없어요</p>
      )}

      {/* ── 오늘의 컨디션 ── */}
      <div className="chub__head chub__head--gap">
        <h2 className="chub__section">오늘의 컨디션</h2>
        <Link to="/check" className="chub__edit">
          수정하기
        </Link>
      </div>

      <div className="chip-group">
        {CONDITIONS.map((c) => (
          /* 고르는 자리가 아니라 오늘 답한 값을 보여주는 자리라 클릭을 막는다 */
          <Chip key={c.key} selected={c.key === TODAY} disabled>
            {c.label}
          </Chip>
        ))}
      </div>

      {/* ── 이번 주 컨디션 ── */}
      <h2 className="chub__section chub__section--gap">이번 주 컨디션</h2>

      <section className="chub__chart">
        <p className="chub__chart-title">컨디션 {range}</p>

        <div className="chub__plot">
          {/* 세로축 — CONDITION_LEVELS가 좋은 것부터라 그대로 쓰면 위가 좋은 쪽이 된다 */}
          <ul className="chub__scale" aria-hidden>
            {CONDITION_LEVELS.map((c) => (
              <li key={c.key} className="chub__scale-tick">
                {c.emoji}
              </li>
            ))}
          </ul>

          <ol className="chub__bars">
            {days.map((d) => (
              <li key={d.date} className="chub__bar-slot">
                <div className="chub__bar" style={{ height: barHeight(d.level) }}>
                  <span className="chub__bar-date">{d.date}</span>
                </div>
                <span className="sr-only">
                  {d.date} {levelLabel(d.level)}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SubPage>
  )
}
