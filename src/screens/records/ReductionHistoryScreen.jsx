import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import SubPage from '../../components/SubPage'
import { getSubtractHistory } from '../../api/records'
import { useApi } from '../../api/useApi'
import { formatDay, ymd } from '../../utils/date'
import { CONDITIONS, REDUCTION_FILTERS, VERDICT_LABEL } from '../options'
import './ReductionHistoryScreen.css'

/**
 * H03_RecordReductionHistory — 최근 덜어내기 기록 (NOW-SUB-004 · GET /subtract/history).
 *
 * 한 줄이 그날의 판정 한 건이다. 항목별 내용은 여기 오지 않으므로,
 * 자세히 보려면 evaluationId 로 판정 화면을 연다(GET /subtract/result?evaluationId=).
 *
 * ⚠️ 시안에 있던 「실행 정도」(추천대로 했어요 · 조금 바꿨어요 · 거의 못 했어요) 꼬리표는 뺐다.
 *    이 응답에 그 값이 없고, 그걸 저장하는 API 도 아직 없다(G02 덜어내기 기록 화면은
 *    「기록 저장하기」를 눌러도 서버로 보내는 곳이 없다). 확인 요청해 둔 상태다.
 *    화면에서 지어내면 사용자가 고른 적 없는 답이 자기 기록에 남는다.
 *
 * 이번 달 필터는 이번 주를 포함한다 — 주가 달에 들어 있으니 빼면 목록이 어긋난다.
 */

/** 필터를 조회 기간으로. 전체는 기간을 안 보낸다 — 서버 기본값을 그대로 쓴다. */
function rangeOf(period) {
  if (period === 'all') return {}
  const now = new Date()
  if (period === 'week') {
    const from = new Date(now)
    from.setDate(now.getDate() - 6) // 오늘 포함 7일
    return { from: ymd(from), to: ymd(now) }
  }
  return { from: ymd(new Date(now.getFullYear(), now.getMonth(), 1)), to: ymd(now) }
}

/** 「그대로 2 · 방식만 1」 — 0 인 판정은 빼고, 라벨은 VERDICT_LABEL 을 그대로 쓴다 */
const verdictLine = (summary) => {
  const parts = Object.entries(VERDICT_LABEL)
    .filter(([key]) => (summary?.[key] ?? 0) > 0)
    .map(([key, label]) => `${label} ${summary[key]}`)
  return parts.length ? parts.join(' · ') : '덜어낸 항목이 없어요'
}

/** 상태값은 서버가 주고 문구는 우리 상수에서 찾는다 */
const stateLabel = (state) =>
  CONDITIONS.find((c) => c.key === state)?.label ?? null

export default function ReductionHistoryScreen() {
  const [period, setPeriod] = useState('all')

  const load = useCallback(() => getSubtractHistory(rangeOf(period)), [period])
  const list = useApi(load, [period])

  const logs = list.data?.history ?? []

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

      {list.loading ? (
        <p className="rhist__empty" role="status">
          불러오는 중…
        </p>
      ) : list.error ? (
        /* 기간·개수가 틀리면 서버가 어디가 틀렸는지 알려준다. 그 문장을 그대로 띄운다. */
        <p className="rhist__empty" role="alert">
          {list.errorText}
        </p>
      ) : logs.length > 0 ? (
        <>
          <ul className="rhist__list">
            {logs.map((log) => (
              <li key={log.evaluationId} className="rhist__card">
                <div className="rhist__card-head">
                  {/* 서버는 2026-08-18 로 준다. 시안 문구로 바꾸는 건 화면 몫이다. */}
                  <p className="rhist__date">{formatDay(log.date)}</p>
                  <Link
                    to={`/reduce/result?evaluationId=${log.evaluationId}`}
                    className="rhist__edit"
                  >
                    자세히 보기 ›
                  </Link>
                </div>

                <p className="rhist__title">{verdictLine(log.summary)}</p>

                {stateLabel(log.state) && (
                  <span className="rhist__state">{stateLabel(log.state)}</span>
                )}
              </li>
            ))}
          </ul>

          {/* 더 있는데 안 보여주고 있으면 그렇다고 말한다. 조용히 자르지 않는다. */}
          {list.data?.hasMore && (
            <p className="rhist__more">
              전체 {list.data.total}건 중 {logs.length}건을 보고 있어요
            </p>
          )}
        </>
      ) : (
        <p className="rhist__empty">이 기간에는 덜어내기 기록이 없어요</p>
      )}
    </SubPage>
  )
}
