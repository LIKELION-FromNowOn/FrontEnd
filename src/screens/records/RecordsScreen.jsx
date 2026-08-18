import { useState } from 'react'
import SubPage from '../../components/SubPage'
import { LOG_DAYS, LOG_SUMMARY, LOG_UNLOCK } from '../options'
import './RecordsScreen.css'

/**
 * 기록 (NOW-LOG-001 GET /logs · NOW-LOG-002 GET /logs/summary).
 * 시안이 아직 없어서 기존 색·간격 토큰만으로 짰다.
 *
 * 명세서의 「하지 않는 것」을 화면에서도 지킨다.
 *   달성률   비율을 만들면 못 한 날이 드러난다
 *   연속일   끊기는 순간이 부담이 된다
 *   미완료   하지 못한 것은 아예 저장하지 않는다
 * 그래서 이 화면에는 분모가 없다. 완료한 것만 세어서 보여준다.
 */
const PERIODS = [
  { key: 'week', label: '이번 주' },
  { key: 'month', label: '이번 달' },
]

export default function RecordsScreen() {
  const [period, setPeriod] = useState('week')

  const unlock = LOG_UNLOCK
  // 월간은 기록한 날이 쌓여야 열린다 (홈 응답의 unlock 블록)
  const locked = period === 'month' && !unlock.monthlyOpen
  const summary = LOG_SUMMARY
  const max = Math.max(...summary.byCategory.map((c) => c.count), 1)

  return (
    <SubPage title="기록">
      <div className="records__periods">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            type="button"
            className={`records__period${period === p.key ? ' is-selected' : ''}`}
            aria-pressed={period === p.key}
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {locked ? (
        <section className="records__locked">
          <p className="records__locked-title">
            월간 발견은 {unlock.monthlyNeed}일치 기록이 쌓이면 열려요
          </p>
          <p className="records__locked-sub">
            지금까지 {unlock.recordedDays}일 기록하셨어요
          </p>
        </section>
      ) : (
        <>
          {/* ── 요약 ── */}
          <section className="records__summary">
            <p className="records__count">
              <strong>{summary.total}</strong>번 해내셨어요
            </p>

            <ul className="records__dist">
              {summary.byCategory.map((c) => (
                <li key={c.categoryName} className="records__dist-row">
                  <span className="records__dist-name">{c.categoryName}</span>
                  <span className="records__dist-track">
                    <span
                      className="records__dist-fill"
                      style={{ width: `${(c.count / max) * 100}%` }}
                    />
                  </span>
                  <span className="records__dist-count">{c.count}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── 완료한 행동 ── */}
          <h2 className="records__section">해낸 것들</h2>

          {LOG_DAYS.length > 0 ? (
            LOG_DAYS.map((day) => (
              <div key={day.date} className="records__day">
                <p className="records__date">{day.date}</p>
                <ul className="records__logs">
                  {day.logs.map((log) => (
                    <li key={log.logId} className="records__log">
                      <span className="records__log-title">{log.title}</span>
                      <span className="records__log-cat">{log.categoryName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="records__empty">아직 기록이 없어요</p>
          )}
        </>
      )}
    </SubPage>
  )
}
