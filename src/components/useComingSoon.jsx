import { useCallback, useRef, useState } from 'react'
import './ComingSoon.css'

/**
 * 「은」과 「는」을 가른다 — 받침이 있으면 은, 없으면 는.
 *
 * 「회원탈퇴은(는)」처럼 두 개를 다 적으면 읽을 때 걸린다.
 * 한글 음절은 0xAC00 부터 28개씩 묶여 있고 그 안에서 종성이 0이면 받침이 없다.
 * 한글이 아닌 글자로 끝나면 안전하게 「는」을 쓴다.
 */
const eunNeun = (word) => {
  const last = String(word).trim().slice(-1).charCodeAt(0)
  if (Number.isNaN(last) || last < 0xac00 || last > 0xd7a3) return '는'
  return (last - 0xac00) % 28 === 0 ? '는' : '은'
}

/**
 * 줄 하나가 준비 중일 때 — 누르면 잠깐 떴다 사라지는 알림.
 *
 *   const [toast, notify] = useComingSoon()
 *   <button onClick={() => notify('비밀번호 변경')}>…</button>
 *   {toast}
 */
export function useComingSoon() {
  const [message, setMessage] = useState(null)
  const timer = useRef(null)

  const notify = useCallback((what) => {
    setMessage(
      what
        ? `${what}${eunNeun(what)} 다음 단계에서 준비 중이에요`
        : '다음 단계에서 준비 중이에요',
    )
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(null), 2200)
  }, [])

  const toast = message ? (
    <p className="coming__toast" role="status">
      {message}
    </p>
  ) : null

  return [toast, notify]
}
