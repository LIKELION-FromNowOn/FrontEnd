import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import TabLayout from './layouts/TabLayout'
import StubScreen from './screens/StubScreen'
import LandingScreen from './screens/landing/LandingScreen'
import { SCREENS } from './screens/registry'

import LoginScreen from './screens/auth/LoginScreen'
import EmailInputScreen from './screens/auth/EmailInputScreen'
import PasswordSetupScreen from './screens/auth/PasswordSetupScreen'
import EmailVerificationScreen from './screens/auth/EmailVerificationScreen'
import CareItemsScreen from './screens/onboarding/CareItemsScreen'
import ConditionScreen from './screens/dailycheck/ConditionScreen'
import ConditionHubScreen from './screens/dailycheck/ConditionHubScreen'
import AnalyzingScreen from './screens/dailycheck/AnalyzingScreen'
import HomeScreen from './screens/firststep/HomeScreen'
import FirstStepListScreen from './screens/firststep/FirstStepListScreen'
import FirstStepIntroScreen from './screens/firststep/FirstStepIntroScreen'
import FirstStepDetailScreen from './screens/firststep/FirstStepDetailScreen'
import FirstStepManageScreen from './screens/firststep/FirstStepManageScreen'
import CharacterIntroScreen from './screens/firststep/CharacterIntroScreen'
import ReduceIntroScreen from './screens/reduce/ReduceIntroScreen'
import ReduceResultScreen from './screens/reduce/ReduceResultScreen'
import ReduceRecordScreen from './screens/reduce/ReduceRecordScreen'
import MyScreen from './screens/my/MyScreen'
import EditNicknameScreen from './screens/my/EditNicknameScreen'
import ProfileSettingsScreen from './screens/my/ProfileSettingsScreen'
import NotificationSettingsScreen from './screens/my/NotificationSettingsScreen'
import ServiceGuideScreen from './screens/my/ServiceGuideScreen'
import ContactScreen from './screens/my/ContactScreen'
import RecordsScreen from './screens/records/RecordsScreen'
import RecordConditionScreen from './screens/records/RecordConditionScreen'
import ReductionHistoryScreen from './screens/records/ReductionHistoryScreen'
import CareStartScreen from './screens/today/CareStartScreen'
import CoachScreen from './screens/coach/CoachScreen'

/** 시안이 나와서 구현된 화면. 나머지는 자동으로 StubScreen이 뜬다. */
const REAL = {
  login: <LoginScreen />,
  authEmail: <EmailInputScreen />,
  authPassword: <PasswordSetupScreen />,
  authVerify: <EmailVerificationScreen />,
  careItems: <CareItemsScreen />,
  condition: <ConditionScreen />,
  conditionHub: <ConditionHubScreen />,
  analyzing: <AnalyzingScreen />,
  home: <HomeScreen />,
  firstStepIntro: <FirstStepIntroScreen />,
  firstStepList: <FirstStepListScreen />,
  firstStepDetail: <FirstStepDetailScreen />,
  firstStepManage: <FirstStepManageScreen />,
  characterIntro: <CharacterIntroScreen />,
  reduceIntro: <ReduceIntroScreen />,
  reduceResult: <ReduceResultScreen />,
  reduceRecord: <ReduceRecordScreen />,
  my: <MyScreen />,
  editNickname: <EditNicknameScreen />,
  profileSettings: <ProfileSettingsScreen />,
  notificationSettings: <NotificationSettingsScreen />,
  serviceGuide: <ServiceGuideScreen />,
  contact: <ContactScreen />,
  records: <RecordsScreen />,
  recordCondition: <RecordConditionScreen />,
  reductionHistory: <ReductionHistoryScreen />,
  careStart: <CareStartScreen />,
  coach: <CoachScreen />,
}

const el = (s) => REAL[s.key] ?? <StubScreen meta={s} showBack />
const route = (s) => ({ path: s.path.slice(1), element: el(s) })

// 탭 화면은 TabLayout(하단 4탭) 아래, 나머지는 단독
const tabScreens = SCREENS.filter((s) => s.tab)
const plainScreens = SCREENS.filter((s) => !s.tab)

export const router = createBrowserRouter([
  // 랜딩은 전체 폭을 쓰는 웹 페이지라 폰 프레임(RootLayout) 밖에 둔다
  { path: '/', element: <LandingScreen /> },
  {
    element: <RootLayout />,
    children: [
      { element: <TabLayout />, children: tabScreens.map(route) },
      ...plainScreens.map(route),
    ],
  },
])
