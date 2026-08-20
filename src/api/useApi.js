import { useCallback, useEffect, useState } from 'react'
import { errorText } from './errors'

/**
 * API 한 건을 불러오는 훅.
 *
 *   const home = useApi(getHome)
 *   <Async state={home}>{(data) => …}</Async>
 *
 * 목이든 실서버든 같은 흐름을 탄다. `call()` 이 실패하면 ApiError 가 오고,
 * 화면에는 서버가 준 문장을 그대로 띄운다(errorText).
 *
 * fn 은 모듈에 선언된 함수(getHome 등)를 그대로 넘기면 된다.
 * 화면 안에서 만든 함수를 넘길 때만 useCallback 으로 감싸고 deps 에 적는다.
 * 화면이 사라진 뒤 도착한 응답은 버린다 — 안 버리면 없어진 화면의 상태를 건드리게 된다.
 */
export function useApi(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let alive = true

    fn().then(
      (data) => {
        if (alive) setState({ data, loading: false, error: null })
      },
      (error) => {
        if (alive) setState({ data: null, loading: false, error })
      },
    )

    return () => {
      alive = false
    }
    // fn 은 렌더마다 새 함수일 수 있어 넣으면 무한 루프가 된다. 호출부가 준 deps 만 본다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  /** 다시 부르기. 이벤트 핸들러라 여기서 로딩 상태를 켜도 된다. */
  const reload = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }))
    setTick((t) => t + 1)
  }, [])

  return { ...state, reload, errorText: errorText(state.error) }
}

/**
 * 버튼처럼 사용자가 눌렀을 때만 부르는 API.
 *
 *   const done = useAction(completeToday)
 *   <Button disabled={done.pending} onClick={() => done.run({ actionId })}>했어요</Button>
 */
export function useAction(fn) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)

  const run = useCallback(
    async (...args) => {
      setPending(true)
      setError(null)
      try {
        return await fn(...args)
      } catch (e) {
        setError(e)
        // 호출부가 성공 여부를 알아야 하므로 삼키지 않는다
        throw e
      } finally {
        setPending(false)
      }
    },
    [fn],
  )

  return { run, pending, error, errorText: errorText(error) }
}
