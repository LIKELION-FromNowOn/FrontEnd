import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import Button from '../../components/ui/Button'
import { evaluateSubtract, revertSubtract } from '../../api/records'
import { useApi, useAction } from '../../api/useApi'
import { REDUCE_FILTERS, ROUTINE_ITEMS, VERDICT_LABEL, canRevert } from '../options'
import './ReduceResultScreen.css'

/** G02_ReduceResult — 판정 배지 + 필터 + 되돌리기 */
export default function ReduceResultScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  /* 되돌린 항목 id 만 들고 있는다. 목록 자체를 복사해 두면 서버 응답과 어긋난다. */
  const [reverted, setReverted] = useState(() => new Set())

  /* 서버가 붙으면 판정 결과로 목록이 바뀐다.
     실패하면 목으로 계속 그린다 — 발표 중에 서버가 흔들려도 화면이 비면 안 된다. */
  const result = useApi(evaluateSubtract)
  const reverting = useAction(revertSubtract)

  const source = result.data?.items?.length ? result.data.items : ROUTINE_ITEMS
  const items = source.map((it) =>
    reverted.has(it.itemId)
      ? { ...it, verdict: 'keep', persisted: true, reason: undefined }
      : it,
  )

  /**
   * 되돌리기 (NOW-SUB-007).
   * 서버는 해당 항목과 갱신된 summary만 돌려준다. 점수식이 항목별로 독립이라
   * 다른 항목에 영향이 없으므로 목록 전체를 다시 그리지 않고 그 줄만 바꾼다.
   */
  const revert = async (itemId) => {
    try {
      await reverting.run(itemId)
    } catch {
      /* CANNOT_REVERT_EXCLUDED 같은 거절이면 목록을 바꾸지 않는다.
         서버가 막은 것을 화면에서 되돌린 것처럼 보이면 안 된다. */
      return
    }
    setReverted((prev) => new Set(prev).add(itemId))
  }

  const summary = useMemo(
    () =>
      items.reduce(
        (acc, it) => ({ ...acc, [it.verdict]: (acc[it.verdict] ?? 0) + 1 }),
        {},
      ),
    [items],
  )

  const shown = filter === 'all' ? items : items.filter((i) => i.verdict === filter)

  return (
    <div className="rresult">
      <AppHeader nickname="예니" />

      <div className="rresult__body">
        <button
          type="button"
          className="rresult__back"
          onClick={() => navigate(-1)}
          aria-label="뒤로"
        >
          ←
        </button>

        <h1 className="rresult__title">덜어내기 결과</h1>
        <p className="rresult__sub">오늘 상태를 바탕으로 줄여도 되는 것을 찾았어요</p>

        <section className="rresult__summary">
          <div>
            <p className="rresult__summary-title">오늘 상태 요약</p>
            <ul className="rresult__legend">
              <li className="rresult__legend-item rresult__legend-item--a">피부 예민</li>
              <li className="rresult__legend-item rresult__legend-item--b">수면 부족</li>
              <li className="rresult__legend-item rresult__legend-item--c">관리 빈도</li>
            </ul>
          </div>
          <span className="rresult__tag">피부 예민</span>
        </section>

        <div className="rresult__filters">
          {REDUCE_FILTERS.map((f) => {
            const count = f.key === 'all' ? items.length : (summary[f.key] ?? 0)
            return (
              <button
                key={f.key}
                type="button"
                className={`chip chip--filter${filter === f.key ? ' is-selected' : ''}`}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
              >
                {f.label} {count}
              </button>
            )
          })}
        </div>

        <h2 className="rresult__section">오늘 루틴 전체 보기</h2>

        {reverting.error && (
          <p className="rresult__revert-error" role="alert">
            {reverting.errorText}
          </p>
        )}

        {shown.length === 0 && (
          <p className="rresult__empty">이 판정에 해당하는 항목이 없어요</p>
        )}

        <ol className="rresult__list">
          {shown.map((it, i) => (
            <li key={it.itemId} className="rresult__row">
              <div className="rresult__main">
                <span className="rresult__no">{i + 1}</span>
                <span className="rresult__name">{it.name}</span>

                <span className={`rresult__badge rresult__badge--${it.verdict}`}>
                  {VERDICT_LABEL[it.verdict]}
                </span>

                {/* keep·excluded는 되돌릴 판정이 없어 버튼을 띄우지 않는다 */}
                {canRevert(it.verdict) && (
                  <button
                    type="button"
                    className="rresult__revert"
                    onClick={() => revert(it.itemId)}
                  >
                    되돌리기
                  </button>
                )}

                <span className="rresult__arrow" aria-hidden>
                  ›
                </span>
              </div>

              {/* 사유는 서버가 내려준 문장을 그대로 쓴다 */}
              {it.reason && <p className="rresult__reason">{it.reason}</p>}
            </li>
          ))}
        </ol>

        <div className="rresult__cta">
          <Button onClick={() => navigate('/reduce/record')}>이 루틴으로 할게요</Button>
        </div>
      </div>
    </div>
  )
}
