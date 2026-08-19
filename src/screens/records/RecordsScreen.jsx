import { Link, useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import StreakCard from '../../components/StreakCard'
import {
  ACTIVE_STREAK,
  REDUCTION_LOGS,
  WEEK_CONDITION_SUMMARY,
  WEEK_REDUCED,
  WEEK_SUMMARY,
  DID_OPTIONS,
} from '../options'
import './RecordsScreen.css'

/**
 * H01_RecordHome — 기록 탭 첫 화면 (NOW-LOG-001 · 002).
 *
 * 세 숫자·막대·목록 어디에도 분모를 두지 않는다. 명세서의 「하지 않는 것」이다.
 *   달성률   비율을 만들면 못 한 날이 드러난다
 *   연속일   끊기는 순간이 부담이 된다
 *   미완료   하지 못한 것은 아예 저장하지 않는다
 */
export default function RecordsScreen() {
  const navigate = useNavigate()
  const streak = ACTIVE_STREAK
  const recent = REDUCTION_LOGS[0]
  const cond = WEEK_CONDITION_SUMMARY
  const maxCount = Math.max(...WEEK_REDUCED.map((r) => r.count), 1)

  return (
    <HeroPanel
      nickname="예니"
      hero={
        <div className="rec__hero">
          <div className="rec__hero-head">
            <div>
              <h1 className="hero__title">이번주 요약</h1>
              <p className="hero__lead">기록이 쌓일수록 더 나에게 맞게 !</p>
            </div>
            <Link to="/records/condition" className="rec__hero-more">
              주간 리뷰 보기 ›
            </Link>
          </div>

          <ul className="rec__stats">
            {WEEK_SUMMARY.map((s) => (
              <li key={s.key} className="rec__stat">
                <span className="rec__stat-label">{s.label}</span>
                <strong className="rec__stat-days">{s.days}일</strong>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      {/* ── 이번 주 컨디션 ── */}
      <div className="rec__head">
        <h2 className="rec__section">이번 주 컨디션</h2>
        <Link to="/records/condition" className="rec__more">
          자세히보기 ›
        </Link>
      </div>

      <section className="rec__card rec__cond">
        <div className="rec__cond-text">
          <p className="rec__cond-title">
            {cond.label}
            <span className="rec__cond-days">
              {cond.totalDays}일 중 {cond.daysOfWeek}일
            </span>
          </p>
          <ul className="rec__tags">
            {cond.signals.map((s) => (
              <li key={s} className="rec__tag">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <span className="rec__cond-emoji" aria-hidden>
          {cond.emoji}
        </span>
      </section>

      {/* ── 이번 주 덜어낸 것 ── */}
      <h2 className="rec__section rec__section--gap">이번 주 덜어낸 것</h2>

      <section className="rec__card">
        <p className="rec__card-label">이번 주에 자주 덜어냈어요</p>

        <ul className="rec__bars">
          {WEEK_REDUCED.map((r) => (
            <li key={r.name} className="rec__bar-row">
              <span className="rec__bar-name">{r.name}</span>
              <span className="rec__bar-track">
                <span
                  className="rec__bar-fill"
                  style={{ width: `${(r.count / maxCount) * 100}%` }}
                />
              </span>
              <span className="rec__bar-count">{r.count}회</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 최근 덜어내기 기록 ── */}
      <div className="rec__head rec__head--gap">
        <h2 className="rec__section">최근 덜어내기 기록</h2>
        <Link to="/records/reductions" className="rec__more">
          자세히보기 ›
        </Link>
      </div>

      {recent ? (
        <section className="rec__card rec__card--cream">
          <p className="rec__log-date">
            {recent.date}
            <span className="rec__log-sub">
              {cond.totalDays}일 중 {WEEK_SUMMARY[1].days}일을 덜어냈어요
            </span>
          </p>
          <p className="rec__log-title">{recent.title}</p>

          <ul className="rec__dids">
            {DID_OPTIONS.map((d) => (
              <li
                key={d}
                className={`rec__did${recent.did === d ? ' is-selected' : ''}`}
              >
                {d}
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="rec__empty">아직 덜어내기 기록이 없어요</p>
      )}

      {/* ── 첫 발자국 ── */}
      {streak && (
        <>
          <h2 className="rec__section rec__section--gap">첫 발자국도 함께 쌓이고 있어요</h2>
          <StreakCard
            variant="cream"
            title={streak.title}
            day={streak.day}
            total={streak.total}
            onContinue={() => navigate('/care/start')}
          />
        </>
      )}
    </HeroPanel>
  )
}
