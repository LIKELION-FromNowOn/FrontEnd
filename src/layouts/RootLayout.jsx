import { Outlet } from 'react-router-dom'
import DeviceShell from '../components/DeviceShell'
import '../App.css'

/**
 * 최상위 레이아웃. 폰 화면(Outlet)을 DeviceShell로 감싼다.
 * 웹에서는 좌/우 여백에 설명 영역이 붙고, 앱(좁은 화면)에서는 사라진다.
 *
 * 좌/우 내용은 자리만 잡아둔 플레이스홀더 — 실제 소개 문구가 정해지면 교체.
 */
export default function RootLayout() {
  return (
    <DeviceShell
      left={
        <div className="promo">
          <div className="promo__slot promo__slot--title">서비스 제목</div>
          <div className="promo__slot">소개 문구</div>
        </div>
      }
      right={
        <div className="promo">
          <div className="promo__slot">기능 설명 1</div>
          <div className="promo__slot">기능 설명 2</div>
          <div className="promo__slot">기능 설명 3</div>
        </div>
      }
    >
      <Outlet />
    </DeviceShell>
  )
}
