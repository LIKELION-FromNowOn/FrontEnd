import { Outlet } from 'react-router-dom'
import DeviceShell from '../components/DeviceShell'
import '../App.css'

/**
 * 최상위 레이아웃. 폰 화면(Outlet)을 DeviceShell로 감싼다.
 * 웹에서는 좌/우 설명 패널이 붙고, 앱(좁은 화면)에서는 사라진다.
 */
export default function RootLayout() {
  return (
    <DeviceShell
      left={
        <div className="promo">
          <h1 className="promo__title">
            지금 상태에 맞는
            <br />단 하나의 관리
          </h1>
          <p className="promo__lead">
            할 일을 늘리지 않아요. 오늘의 컨디션을 보고, 가장 도움이 되는 관리 하나만
            남깁니다.
          </p>
        </div>
      }
      right={
        <ul className="promo__features">
          <li>
            <b>첫 발자국</b>
            <span>온보딩 카드가 그대로 홈으로 내려와, 매일 여기서 시작</span>
          </li>
          <li>
            <b>덜어내기</b>
            <span>지금 안 해도 되는 건 근거와 함께 잠시 치워둡니다</span>
          </li>
          <li>
            <b>케어 코치</b>
            <span>왜 지금 이걸 해야 하는지 이유까지 짚어줍니다</span>
          </li>
        </ul>
      }
    >
      <Outlet />
    </DeviceShell>
  )
}
