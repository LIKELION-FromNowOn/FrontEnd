import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
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
import FirstStepIntroScreen from './screens/firststep/FirstStepIntroScreen'
import FirstStepListScreen from './screens/firststep/FirstStepListScreen'

/** 시안이 나와서 실제로 구현된 화면. 나머지는 자동으로 StubScreen이 뜬다. */
const REAL = {
  login: <LoginScreen />,
  authEmail: <EmailInputScreen />,
  authPassword: <PasswordSetupScreen />,
  authVerify: <EmailVerificationScreen />,
  careItems: <CareItemsScreen />,
  condition: <ConditionScreen />,
  analyzing: <AnalyzingScreen />,
  home: <HomeScreen />,
  firstStepIntro: <FirstStepIntroScreen />,
  firstStepList: <FirstStepListScreen />,
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: SCREENS.map((s) => ({
      index: s.path === '/',
      path: s.path === '/' ? undefined : s.path.slice(1),
      element: REAL[s.key] ?? <StubScreen meta={s} showBack />,
    })),
  },
])
