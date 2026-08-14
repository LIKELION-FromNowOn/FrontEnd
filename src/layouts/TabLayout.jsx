import { NavLink, Outlet } from 'react-router-dom'
import './TabLayout.css'

/**
 * 메인 4탭 레이아웃 — 홈 · 덜어내기 · 기록 · 마이.
 * 콘텐츠(Outlet)만 바뀌고 하단 탭바는 유지된다.
 */
const TABS = [
  {
    to: '/home',
    label: '홈',
    icon: (
      <path
        d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  {
    to: '/reduce',
    label: '덜어내기',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.2" stroke="currentColor" strokeWidth="1.7" fill="none" />
        <path d="M8.2 12h7.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    to: '/records',
    label: '기록',
    icon: (
      <>
        <rect
          x="4"
          y="5.5"
          width="16"
          height="14.5"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
          fill="none"
        />
        <path d="M4 10h16" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8 3.5v4M16 3.5v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </>
    ),
  },
  {
    to: '/my',
    label: '마이',
    icon: (
      <>
        <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.7" fill="none" />
        <path
          d="M5 20c0-3.6 3.1-5.6 7-5.6s7 2 7 5.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
        />
      </>
    ),
  },
]

export default function TabLayout() {
  return (
    <div className="tabl">
      <div className="tabl__content">
        <Outlet />
      </div>

      <nav className="tabl__bar">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) => `tabl__tab${isActive ? ' is-active' : ''}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
              {t.icon}
            </svg>
            <span className="tabl__label">{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
