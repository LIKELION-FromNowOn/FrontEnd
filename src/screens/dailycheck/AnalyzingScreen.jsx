import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AnalyzingScreen.css'

/**
 * D02_DailyCheck/CareAnalyzing — 케어 판정 대기 화면.
 * 일러스트는 쓰지 않기로 해서 문구와 점 애니메이션만 둔다.
 *
 * 지금은 서버가 없어 일정 시간 뒤 홈으로 넘어간다. API 연동 시 실제 응답으로 교체.
 */
const DELAY_MS = 1800

export default function AnalyzingScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate('/home', { replace: true }), DELAY_MS)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="analyzing">
      <p className="analyzing__text" role="status">
        오늘의 케어를 고르고 있어요
      </p>
      <p className="analyzing__dots" aria-hidden>
        <span />
        <span />
        <span />
      </p>
    </div>
  )
}
