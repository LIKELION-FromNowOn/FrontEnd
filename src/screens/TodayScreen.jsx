import { Link } from 'react-router-dom'
import './TodayScreen.css'

/**
 * 오늘(홈) 화면 — 골격만.
 * 문구·색은 전부 플레이스홀더. 디자인/카피 확정되면 교체.
 * 하단 탭바는 TabLayout이 제공하므로 여기서는 콘텐츠만.
 */
const ROWS = [
  { label: '오늘 상태 점검', to: '/checkin' },
  { label: '왜 지금 이것인가', to: '/why' },
  { label: '덜어내기', to: '/subtract' },
  { label: '케어 코치', to: '/coach' },
]

export default function TodayScreen() {
  return (
    <div className="today">
      <header className="today__top">
        <h1 className="today__heading">오늘</h1>
      </header>

      {/* 첫 발자국 카드 — 온보딩과 홈이 함께 쓸 컴포넌트 자리 */}
      <section className="today__card">
        <p className="today__card-label">첫 발자국</p>
        <div className="today__card-body">카드 내용</div>
        <Link to="/timer" className="today__card-action">
          시작하기
        </Link>
      </section>

      <section className="today__list">
        {ROWS.map((r) => (
          <Link key={r.to} to={r.to} className="today__row">
            <span>{r.label}</span>
            <span className="today__chev" aria-hidden>
              ›
            </span>
          </Link>
        ))}
      </section>
    </div>
  )
}
