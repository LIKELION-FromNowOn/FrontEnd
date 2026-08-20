import { Link } from 'react-router-dom'
import Character from '../../components/ui/Character'
import DecorLines from './DecorLines'
import FlipCard from './FlipCard'
import './LandingScreen.css'

/**
 * 서비스 소개 웹 페이지 (랜딩).
 * 앱 화면과 달리 폰 프레임 없이 전체 폭을 쓰므로 DeviceShell 밖에 둔다.
 *
 * 시안에서 내용이 비어 있던 카드/푸터는 자리와 형태만 잡아 두었다.
 * 문구가 정해지면 아래 배열만 채우면 된다.
 */
const NAV = [
  { href: '#top', label: '홈' },
  { href: '#features', label: '기능 소개' },
]

// 기능 소개 카드 3장 — 앞면/뒷면 문구 미정
const FEATURES = [
  {
    id: 1,
    front: '나의 컨디션 알기',
    back: '오늘 내 피부가 어떤 상태인지 먼저 확인해요.',
  },
  {
    id: 2,
    front: '덜어내기',
    back: '지금 하지 않아도 되는 관리와 피해야 할 행동을 덜어내요.',
  },
  {
    id: 3,
    front: '첫발자국',
    back: '지금의 나에게 필요한 관리부터 하나씩 시작해요.',
  },
]

// 사용자 고민 말풍선
const PAINS = [
  { id: 'info', text: '“정보가\n너무 많아요”' },
  { id: 'fit', text: '“나에게 맞는지\n모르겠어요”' },
  { id: 'steps', text: '“단계가\n너무 많아요”' },
  { id: 'keep', text: '“꾸준히 하기\n너무 어려워요”' },
]

// 해결 카드 3장 — 문구 미정

export default function LandingScreen() {

  return (
    <div className="lp" id="top">
      {/* ── 상단 네비 ─────────────────────────── */}
      <header className="lp__nav">
        <nav className="lp__menu">
          {NAV.map((n) => (
            <a key={n.label} className="lp__menu-link" href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>
      </header>

      {/* ── 히어로 ────────────────────────────── */}
      <section className="lp__hero">
        <p className="lp__hero-lead">
          오늘 상태를 판정하여 피부 관리를 조정해 주는 서비스
        </p>
        <h1 className="lp__hero-title">지금부터</h1>

        <Link to="/login" className="lp__cta">
          무료로 시작하기 <span aria-hidden>→</span>
        </Link>

        <div className="lp__hero-arch" aria-hidden />

        {/* 달팽이가 화면 하단을 오른쪽에서 왼쪽으로 아주 천천히 지나간다 */}
        <div className="lp__crawl" id="character">
          <div className="lp__crawl-inner">
            <Character variant="fullPlain" width={230} alt="지금부터 캐릭터" />
          </div>
        </div>
      </section>

      {/* ── 소개 ──────────────────────────────── */}
      <section className="lp__intro">
        <div className="lp__intro-decor">
          <DecorLines side="left" />
        </div>

        <div className="lp__intro-copy">
          <p className="lp__intro-line">나에게 맞는 뷰티 루틴을,</p>
          <p className="lp__intro-line lp__intro-line--accent">
            <span>지금</span>
            <i className="lp__rule" aria-hidden />
            <span>부터</span>
          </p>
          <p className="lp__intro-line">시작하게 해주는 서비스</p>
        </div>
      </section>

      {/* ── 기능 카드 ─────────────────────────── */}
      <section className="lp__features" id="features">
        <div className="lp__cards">
          {FEATURES.map((f) => (
            <FlipCard
              key={f.id}
              front={<span className="lp__card-front">{f.front}</span>}
              back={<span className="lp__card-back">{f.back}</span>}
            />
          ))}
        </div>
      </section>

      {/* ── 문제 제기 ─────────────────────────── */}
      <section className="lp__problem">
        <div className="lp__problem-copy">
          <p className="lp__problem-line">뷰티 루틴,</p>
          <p className="lp__problem-line">
            왜 항상 늘<i className="lp__rule lp__rule--dark" aria-hidden />
          </p>
          <p className="lp__problem-line lp__problem-line--accent">작심삼일까?</p>
        </div>

        <div className="lp__problem-decor">
          <DecorLines side="right" />
        </div>
      </section>

      {/* ── 고민 말풍선 ───────────────────────── */}
      <section className="lp__pains">
        <div className="lp__pains-arch" aria-hidden />
        <ul className="lp__bubbles">
          {PAINS.map((p) => (
            <li key={p.id} className={`lp__bubble lp__bubble--${p.id}`}>
              {p.text}
            </li>
          ))}
        </ul>
      </section>

      {/* ── 해결 ──────────────────────────────── */}
      <section className="lp__solution">
        <h2 className="lp__solution-title">
          천천히 <em>지금부터</em>가 해결합니다
        </h2>
      </section>

      {/* ── 앱 미리보기 ───────────────────────── */}
      <section className="lp__preview">
        <div className="lp__phone">
          <div className="lp__phone-top">
            <p className="lp__phone-title">지금부터</p>
            <p className="lp__phone-sub">
              오늘 상태를 판정하여 피부 관리를
              <br />
              조정해 주는 서비스
            </p>
            <Character variant="fullCircle" width={130} />
          </div>

          <div className="lp__phone-sheet">
            <p className="lp__phone-guest">게스트</p>
            <span className="lp__phone-btn">구글로 계속하기</span>
            <span className="lp__phone-btn">이메일로 계속하기</span>
            <p className="lp__phone-terms">
              계속 진행하면 지금부터의 서비스 약관 및 개인 정보 정책에 동의하는 것으로
              간주됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 푸터 ──────────────────────────────── */}
      <footer className="lp__footer" id="contact">
        <div className="lp__footer-inner">
          <div className="lp__logo lp__logo--footer">
            <Character variant="face" width={24} />
            <span>할래말래</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
