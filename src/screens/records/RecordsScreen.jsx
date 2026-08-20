import { Link, useNavigate } from 'react-router-dom'
import HeroPanel from '../../components/HeroPanel'
import StreakCard from '../../components/StreakCard'
import { getLogSummary, getSubtractHistory, toWeekSummary } from '../../api/records'
import { useApi } from '../../api/useApi'
import { ACTIVE_STREAK, VERDICT_LABEL } from '../options'
import { formatDay } from '../../utils/date'
import './RecordsScreen.css'

/**
 * H01_RecordHome — 기록 탭 첫 화면 (NOW-LOG-002 · NOW-SUB-004).
 *
 * 숫자·막대·목록 어디에도 분모를 두지 않는다. 명세서의 「하지 않는 것」이다.
 *   달성률   비율을 만들면 못 한 날이 드러난다
 *   연속일   끊기는 순간이 부담이 된다
 *   미완료   하지 못한 것은 아예 저장하지 않는다
 *
 * 2026-08-20 로 이 화면이 만들 것이 정해졌다.
 *   만든다    기록한 날 · 덜어낸 날 · 최빈 컨디션 · 자주 덜어낸 항목 · 덜어내기 기록
 *   안 만든다 **이어간 날(연속 달성일)** · 달성률 — 추후 개선사항으로 넘겼다
 *
 * ⚠️ GET /logs/summary 는 아직 404 라 목으로 돈다. 판정 기록(NOW-SUB-004)은 실연동이다.
 */
export default function RecordsScreen() {
  const navigate = useNavigate()
  const streak = ACTIVE_STREAK

  /* period 를 적어서 부른다 — 서버 기본값은 month 이고 이 화면은 주 단위다.
     기본값에 기대면 어느 쪽 기본값인지 읽는 사람이 매번 확인해야 한다. */
  const summary = useApi(weekSummary)
  /* 최근 한 건만 있으면 되는 자리라 목록을 통째로 받지 않는다 */
  const history = useApi(recentOne)

  const week = toWeekSummary(summary.data)
  const recent = history.data?.history?.[0] ?? null
  const maxCount = Math.max(...(week?.reduced ?? []).map((r) => r.count), 1)

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

          {/* 두 칸이다. 「첫 발자국 이어간 날」은 연속 달성일이라 2026-08-20 에 뺐다. */}
          <ul className="rec__stats">
            {(week?.stats ?? []).map((s) => (
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

      {week?.state ? (
        <section className="rec__card rec__cond">
          <div className="rec__cond-text">
            <p className="rec__cond-title">
              {week.state.label}
              {/* 「7일 중 4일」은 달성률이 아니라 최빈값의 근거다. 값이 올 때만 띄운다. */}
              {week.state.days != null && week.state.totalDays != null && (
                <span className="rec__cond-days">
                  {week.state.totalDays}일 중 {week.state.days}일
                </span>
              )}
            </p>
            {week.signals.length > 0 && (
              <ul className="rec__tags">
                {week.signals.map((s) => (
                  <li key={s} className="rec__tag">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="rec__cond-emoji" aria-hidden>
            {week.state.emoji}
          </span>
        </section>
      ) : (
        <p className="rec__empty">이번 주에 답한 컨디션이 아직 없어요</p>
      )}

      {/* ── 이번 주 덜어낸 것 ── */}
      <h2 className="rec__section rec__section--gap">이번 주 덜어낸 것</h2>

      <section className="rec__card">
        <p className="rec__card-label">이번 주에 자주 덜어냈어요</p>

        <ul className="rec__bars">
          {(week?.reduced ?? []).map((r) => (
            <li key={r.key} className="rec__bar-row">
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
        <Link
          to={`/reduce/result?evaluationId=${recent.evaluationId}`}
          className="rec__card rec__card--cream rec__log-link"
        >
          <p className="rec__log-date">{formatDay(recent.date)}</p>
          <p className="rec__log-title">{verdictLine(recent.summary)}</p>
        </Link>
      ) : (
        <p className="rec__empty">아직 덜어내기 기록이 없어요</p>
      )}

      {/* ── 첫 발자국 ── */}
      {streak && (
        <>
          <h2 className="rec__section rec__section--gap">
            첫 발자국도 함께 쌓이고 있어요
          </h2>
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

/** H01 은 이번 주 요약이다. 서버 기본값(month)에 기대지 않고 적어 보낸다. */
const weekSummary = () => getLogSummary('week')

/** 목록에 한 건만 쓰는 자리라 limit 을 1 로 줄여 부른다 */
const recentOne = () => getSubtractHistory({ limit: 1 })

/**
 * 판정 개수를 한 줄로 — 「그대로 2 · 방식만 1 · 줄이기 1」.
 * 0 인 것은 빼고 판정 라벨은 VERDICT_LABEL 을 그대로 쓴다(화면에서 다시 짓지 않는다).
 */
function verdictLine(summary) {
  const parts = Object.entries(VERDICT_LABEL)
    .filter(([key]) => (summary?.[key] ?? 0) > 0)
    .map(([key, label]) => `${label} ${summary[key]}`)
  return parts.length ? parts.join(' · ') : '덜어낸 항목이 없어요'
}
