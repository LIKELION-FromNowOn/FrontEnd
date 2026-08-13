import { Link, useNavigate } from 'react-router-dom'
import './TodayScreen.css'

/**
 * 오늘(홈) 화면 — 데모 플레이스홀더.
 * 하단 탭바는 TabLayout이 제공하므로 여기서는 콘텐츠만.
 * 색/카피/컴포넌트는 디자인 시안 나오면 교체.
 */
const ROWS = [
  { label: '상태 점검', to: '/checkin' },
  { label: '왜 지금 이것인가', to: '/why' },
  { label: '케어 코치', to: '/coach' },
  { label: '기록', to: '/records' },
]

export default function TodayScreen() {
  const navigate = useNavigate()

  return (
    <div className="today">
      <header className="today__top">
        <span className="today__hi">오늘</span>
        <span className="today__date">8월 13일 · 수요일</span>
      </header>

      <section className="today__card">
        <p className="today__eyebrow">첫 발자국</p>
        <h2 className="today__title">오늘은 이거 하나만</h2>
        <p className="today__body">
          지금 상태에선 이 관리 하나가 가장 도움이 돼요. 나머지는 잠깐 덜어둘게요.
        </p>
        <button className="today__cta" onClick={() => navigate('/timer')}>
          시작하기
        </button>
      </section>

      <section className="today__list">
        {ROWS.map((r) => (
          <Link key={r.to} to={r.to} className="today__row">
            <span>{r.label}</span>
            <span className="today__chev">›</span>
          </Link>
        ))}
      </section>
    </div>
  )
}
