import { useState } from 'react'
import { Link } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import { DID_OPTIONS, REDUCTION_FILTERS, REDUCTION_LOGS } from '../options'
import './ReductionHistoryScreen.css'

/**
 * H03_RecordReductionHistory — 최근 덜어내기 기록 (NOW-LOG-001 GET /logs).
 *
 * 「기록 수정하기」는 덜어내기 기록 화면(H03-1)으로 넘긴다. 그 화면은 이미 있다.
 * 이번 달 필터는 이번 주를 포함한다 — 주가 달에 들어 있으니 빼면 목록이 어긋난다.
 */
export default function ReductionHistoryScreen() {
  const [period, setPeriod] = useState('all')

  const logs = REDUCTION_LOGS.filter(
    (l) =>
      period === 'all' ||
      (period === 'week' && l.period === 'week') ||
      period === 'month',
  )

  return (
    <SubPage title="최근 덜어내기 기록">
      <div className="rhist__filters">
        {REDUCTION_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`rhist__filter${period === f.key ? ' is-selected' : ''}`}
            aria-pressed={period === f.key}
            onClick={() => setPeriod(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {logs.length > 0 ? (
        <ul className="rhist__list">
          {logs.map((log) => (
            <li key={log.logId} className="rhist__card">
              <div className="rhist__card-head">
                <p className="rhist__date">{log.date}</p>
                <Link to="/reduce/record" className="rhist__edit">
                  기록 수정하기 ›
                </Link>
              </div>

              <p className="rhist__title">{log.title}</p>

              {/* 고른 값을 보여주기만 하는 자리라 버튼이 아니라 목록으로 둔다 */}
              <ul className="rhist__dids">
                {DID_OPTIONS.map((d) => (
                  <li
                    key={d}
                    className={`rhist__did${log.did === d ? ' is-selected' : ''}`}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rhist__empty">이 기간에는 덜어내기 기록이 없어요</p>
      )}
    </SubPage>
  )
}
