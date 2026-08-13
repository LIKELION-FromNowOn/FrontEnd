import './HomeScreen.css'

/**
 * 데모용 홈 화면 (플레이스홀더).
 * 디자인 시안이 나오기 전 골격만 잡아둔 것 — 색/카피/컴포넌트는 나중에 교체.
 * 웹이든 앱이든 이 화면이 그대로 폰 영역 안에서 재사용된다.
 */
export default function HomeScreen() {
  return (
    <div className="home">
      <header className="home__top">
        <span className="home__hi">오늘</span>
        <span className="home__date">8월 13일 · 수요일</span>
      </header>

      <section className="home__card home__card--first">
        <p className="home__eyebrow">첫 발자국</p>
        <h2 className="home__title">오늘은 이거 하나만</h2>
        <p className="home__body">
          지금 상태에선 이 관리 하나가 가장 도움이 돼요. 나머지는 잠깐 덜어둘게요.
        </p>
        <button className="home__cta">시작하기</button>
      </section>

      <section className="home__list">
        {['상태 점검', '왜 지금 이것인가', '케어 코치', '기록'].map((label) => (
          <button key={label} className="home__row">
            <span>{label}</span>
            <span className="home__chev">›</span>
          </button>
        ))}
      </section>

      <nav className="home__tabbar">
        {['오늘', '기록', '예정', '마이'].map((t, i) => (
          <button key={t} className={`home__tab${i === 0 ? ' is-active' : ''}`}>
            {t}
          </button>
        ))}
      </nav>
    </div>
  )
}
