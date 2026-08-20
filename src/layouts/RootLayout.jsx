import { Outlet } from 'react-router-dom'
import DeviceShell from '../components/DeviceShell'
import '../App.css'

/**
 * 최상위 레이아웃. 폰 화면(Outlet)을 DeviceShell로 감싼다.
 *
 * 좌/우에 있던 설명 플레이스홀더는 2026-08-21 배경 시안이 오면서 걷어냈다 —
 * 시안의 바깥 배경에는 글자 자리가 없다. 폰만 가운데에 둔다.
 */
export default function RootLayout() {
  return (
    <DeviceShell>
      <Outlet />
    </DeviceShell>
  )
}
