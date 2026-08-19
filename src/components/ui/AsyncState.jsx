import './AsyncState.css'

/**
 * 불러오는 중 · 실패했을 때 자리를 채우는 조각.
 *
 * 화면마다 로딩 스피너를 새로 그리면 서로 달라지므로 한 군데로 모은다.
 * 실패 문구는 **서버가 준 문장을 그대로** 띄운다 — 프론트가 지어내면
 * 브랜드명·의학적 단정 검사를 안 거친 문장이 화면에 나갈 수 있다.
 */

export function Loading({ label = '불러오는 중이에요' }) {
  return (
    <p className="async async--loading" role="status">
      {label}
    </p>
  )
}

export function Failed({ message, onRetry }) {
  return (
    <div className="async async--failed" role="alert">
      <p className="async__message">{message}</p>
      {onRetry && (
        <button type="button" className="async__retry" onClick={onRetry}>
          다시 시도
        </button>
      )}
    </div>
  )
}

/**
 * useApi 결과를 그대로 넘기면 로딩·실패·성공을 알아서 가른다.
 *
 *   <Async state={home}>{(data) => <Home data={data} />}</Async>
 *
 * 목이 있는 화면에서는 fallback 을 주면 실패해도 목으로 계속 그린다.
 * 발표 중에 서버가 흔들려도 화면이 비지 않게 하기 위한 것이다.
 */
export function Async({ state, children, fallback }) {
  if (state.loading) return <Loading />
  if (state.error) {
    if (fallback !== undefined) return children(fallback)
    return <Failed message={state.errorText} onRetry={state.reload} />
  }
  return children(state.data)
}
