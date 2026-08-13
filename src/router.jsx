import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import TabLayout from './layouts/TabLayout'
import StubScreen from './screens/StubScreen'
import TodayScreen from './screens/TodayScreen'
import { SCREENS, TABS } from './screens/registry'

const REAL = {
  today: <TodayScreen />,
}

const tabPaths = new Set(TABS.map((t) => t.path))
const el = (meta, showBack) =>
  REAL[meta.key] ?? <StubScreen meta={meta} showBack={showBack} />

// 탭 화면: TabLayout(하단 탭바) 아래. push 화면: 탭바 없이 단독 + 뒤로가기.
const tabScreens = SCREENS.filter((s) => tabPaths.has(s.path))
const pushScreens = SCREENS.filter((s) => !tabPaths.has(s.path))

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <TabLayout />,
        children: tabScreens.map((s) => ({
          index: s.path === '/',
          path: s.path === '/' ? undefined : s.path.slice(1),
          element: el(s, false),
        })),
      },
      ...pushScreens.map((s) => ({
        path: s.path.slice(1),
        element: el(s, true),
      })),
    ],
  },
])
