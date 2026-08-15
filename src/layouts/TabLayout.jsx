import { NavLink, Outlet } from 'react-router-dom'
import { HomeIcon, ReduceIcon, RecordIcon, MyIcon } from '../components/ui/Icon'
import './TabLayout.css'

/**
 * 메인 4탭 레이아웃 — 홈 · 덜어내기 · 기록 · 마이.
 * 콘텐츠(Outlet)만 바뀌고 하단 탭바는 유지된다.
 */
const TABS = [
  { to: '/home', label: '홈', Icon: HomeIcon },
  { to: '/reduce', label: '덜어내기', Icon: ReduceIcon },
  { to: '/records', label: '기록', Icon: RecordIcon },
  { to: '/my', label: '마이', Icon: MyIcon },
]

export default function TabLayout() {
  return (
    <div className="tabl">
      <div className="tabl__content">
        <Outlet />
      </div>

      <nav className="tabl__bar">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `tabl__tab${isActive ? ' is-active' : ''}`}
          >
            <Icon size={22} />
            <span className="tabl__label">{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
