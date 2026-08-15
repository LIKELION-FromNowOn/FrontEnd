import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import Button from '../../components/ui/Button'
import { REDUCE_FILTERS, ROUTINE_ITEMS, VERDICT_LABEL, canRevert } from '../options'
import './ReduceResultScreen.css'

/** G02_ReduceResult — 덜어내기 결과 (판정 배지 + 필터) */
export default function ReduceResultScreen() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')

  const items =
    filter === 'all' ? ROUTINE_ITEMS : ROUTINE_ITEMS.filter((i) => i.verdict === filter)

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

        {/* 오늘 상태 요약 */}
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

        {/* 판정 필터 */}
        <div className="rresult__filters">
          {REDUCE_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`chip chip--filter${filter === f.key ? ' is-selected' : ''}`}
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        <h2 className="rresult__section">오늘 루틴 전체 보기</h2>

        {items.length === 0 && (
          <p className="rresult__empty">이 판정에 해당하는 항목이 없어요</p>
        )}

        <ol className="rresult__list">
          {items.map((item, i) => (
            <li key={item.name} className="rresult__row">
              <span className="rresult__no">{i + 1}</span>
              <span className="rresult__name">{item.name}</span>
              <span className={`rresult__badge rresult__badge--${item.verdict}`}>
                {VERDICT_LABEL[item.verdict]}
              </span>

              {/* keep·excluded는 되돌릴 판정이 없어 버튼을 띄우지 않는다 */}
              {canRevert(item.verdict) && (
                <button type="button" className="rresult__revert">
                  되돌리기
                </button>
              )}

              <span className="rresult__arrow" aria-hidden>
                ›
              </span>
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
