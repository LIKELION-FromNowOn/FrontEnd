import { NavLink, Outlet } from 'react-router-dom'
import { TABS } from '../screens/registry'
import './TabLayout.css'

/**
 * 탭 화면(오늘·기록·예정·마이) 공용 레이아웃.
 * 상단 콘텐츠(Outlet)는 화면마다 바뀌고, 하단 탭바는 유지된다.
 */
export default function TabLayout() {
  return (
    <div className="tabl">
      <div className="tabl__content">
        <Outlet />
      </div>

      <nav className="tabl__bar">
        {TABS.map((t) => (
          <NavLink
            key={t.path}
            to={t.path}
            end={t.path === '/'}
            className={({ isActive }) =>
              `tabl__tab${isActive ? ' is-active' : ''}`
            }
          >
            {t.tab}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
