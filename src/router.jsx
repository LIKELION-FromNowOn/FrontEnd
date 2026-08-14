import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import TabLayout from './layouts/TabLayout'
import StubScreen from './screens/StubScreen'
import { SCREENS } from './screens/registry'

import LoginScreen from './screens/auth/LoginScreen'
import EmailInputScreen from './screens/auth/EmailInputScreen'
import PasswordSetupScreen from './screens/auth/PasswordSetupScreen'
import EmailVerificationScreen from './screens/auth/EmailVerificationScreen'
import CareItemsScreen from './screens/onboarding/CareItemsScreen'
import ConditionScreen from './screens/dailycheck/ConditionScreen'
import AnalyzingScreen from './screens/dailycheck/AnalyzingScreen'
import HomeScreen from './screens/firststep/HomeScreen'
import FirstStepListScreen from './screens/firststep/FirstStepListScreen'
import FirstStepDetailScreen from './screens/firststep/FirstStepDetailScreen'
import ReduceIntroScreen from './screens/reduce/ReduceIntroScreen'
import ReduceResultScreen from './screens/reduce/ReduceResultScreen'
import ReduceRecordScreen from './screens/reduce/ReduceRecordScreen'

/** 시안이 나와서 구현된 화면. 나머지는 자동으로 StubScreen이 뜬다. */
const REAL = {
  login: <LoginScreen />,
  authEmail: <EmailInputScreen />,
  authPassword: <PasswordSetupScreen />,
  authVerify: <EmailVerificationScreen />,
  careItems: <CareItemsScreen />,
  condition: <ConditionScreen />,
  analyzing: <AnalyzingScreen />,
  home: <HomeScreen />,
  firstStepList: <FirstStepListScreen />,
  firstStepDetail: <FirstStepDetailScreen />,
  reduceIntro: <ReduceIntroScreen />,
  reduceResult: <ReduceResultScreen />,
  reduceRecord: <ReduceRecordScreen />,
}

const el = (s) => REAL[s.key] ?? <StubScreen meta={s} showBack />
const route = (s) => ({
  index: s.path === '/',
  path: s.path === '/' ? undefined : s.path.slice(1),
  element: el(s),
})

// 탭 화면은 TabLayout(하단 4탭) 아래, 나머지는 단독
const tabScreens = SCREENS.filter((s) => s.tab)
const plainScreens = SCREENS.filter((s) => !s.tab)

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { element: <TabLayout />, children: tabScreens.map(route) },
      ...plainScreens.map(route),
    ],
  },
])
