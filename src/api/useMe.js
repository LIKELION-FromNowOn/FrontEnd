import { useEffect, useState } from 'react'
import { getMe } from './auth'

/**
 * 내 정보(GET /me)를 **앱 전체가 한 번만** 부르게 한다.
 *
 * 닉네임은 상단바에 늘 떠 있어서 거의 모든 화면이 필요로 한다.
 * 화면마다 useApi(getMe) 를 두면 화면 한 장을 그릴 때 같은 요청이 여러 번 나간다.
 * 그래서 약속(promise)을 모듈에 한 번 만들어 두고 모두 그걸 나눠 쓴다.
 *
 * ⚠️ 세션이 바뀌면(게스트→회원, 로그아웃) 반드시 forgetMe() 를 불러야 한다.
 *    안 그러면 로그아웃한 사람의 이름이 화면에 남는다. api/auth.js 에서 부른다.
 */
let pending = null

export function loadMe() {
  if (!pending) {
    pending = getMe().catch((err) => {
      // 실패는 캐시하지 않는다. 다음 화면에서 다시 시도할 수 있어야 한다.
      pending = null
      throw err
    })
  }
  return pending
}

/** 세션이 바뀌었을 때 — 다음 호출부터 다시 받아온다 */
export function forgetMe() {
  pending = null
  listeners.forEach((fn) => fn())
}

const listeners = new Set()

/** 내 정보. 아직 못 받았으면 null 이다 — 화면이 멈추지 않게 기다리지 않는다. */
export function useMe() {
  const [me, setMe] = useState(null)

  useEffect(() => {
    let alive = true
    const read = () => {
      loadMe().then(
        (data) => alive && setMe(data),
        () => alive && setMe(null),
      )
    }
    read()
    listeners.add(read)
    return () => {
      alive = false
      listeners.delete(read)
    }
  }, [])

  return me
}

/**
 * 상단바에 띄울 이름.
 *
 * 게스트는 서버가 name 을 null 로 준다. 그때는 「게스트」로 적는다 —
 * 예전처럼 특정 이름을 박아 두면 모든 사용자가 남의 이름을 보게 된다.
 */
export function useNickname() {
  const me = useMe()
  return me?.name || '게스트'
}
