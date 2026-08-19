import { Link } from 'react-router-dom'
import AppHeader from '../../components/AppHeader'
import Character from '../../components/ui/Character'
import './MyScreen.css'

/** I01_MyPage — 프로필 요약 + 설정 메뉴 */
const MENUS = [
  {
    to: '/my/profile',
    label: '프로필 설정',
    icon: (
      <>
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M18 6l-1.4 1.4M7.4 16.6 6 18M18 18l-1.4-1.4M7.4 7.4 6 6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    to: '/my/notifications',
    label: '알림 설정',
    icon: (
      <>
        <path
          d="M12 3.5a5.5 5.5 0 0 0-5.5 5.5v3.6L5 15.8h14l-1.5-3.2V9A5.5 5.5 0 0 0 12 3.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M10 18.4a2 2 0 0 0 4 0"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    to: '/my/guide',
    label: '서비스 안내',
    icon: (
      <path
        d="M4 5.5h5.5a2.5 2.5 0 0 1 2.5 2.5v11a2 2 0 0 0-2-2H4v-11ZM20 5.5h-5.5A2.5 2.5 0 0 0 12 8v11a2 2 0 0 1 2-2h6v-11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    to: '/my/contact',
    label: '문의하기',
    icon: (
      <>
        <path
          d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-5 4v-13.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="8.5" cy="10" r="1" fill="currentColor" />
        <circle cx="12" cy="10" r="1" fill="currentColor" />
        <circle cx="15.5" cy="10" r="1" fill="currentColor" />
      </>
    ),
  },
]

export default function MyScreen() {
  return (
    <div className="my">
      <AppHeader nickname="예니" profile />

      <div className="my__body">
        <div className="my__name">
          <span>예니</span>
          <Link to="/my/nickname" className="my__edit" aria-label="닉네임 수정">
            ✎
          </Link>
        </div>

        {/* 캐릭터가 크림 카드 위로 걸쳐 있는 구조 */}
        <div className="my__profile">
          <div className="my__character">
            <Character variant="fullCircle" width={150} />
          </div>

          <div className="my__stats">
            <div className="my__stat">
              <p className="my__stat-label">
                오늘
                <br />
                나의 컨디션
              </p>
            </div>
            <div className="my__stat">
              <p className="my__stat-label">첫 발자국</p>
              <p className="my__stat-value">
                <strong>1</strong> 개 진행 중
              </p>
            </div>
          </div>
        </div>

        <nav className="my__menus">
          {MENUS.map((m) => (
            <Link key={m.to} to={m.to} className="my__menu">
              <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
                {m.icon}
              </svg>
              <span className="my__menu-label">{m.label}</span>
              <span className="my__menu-chevron" aria-hidden>
                ›
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
