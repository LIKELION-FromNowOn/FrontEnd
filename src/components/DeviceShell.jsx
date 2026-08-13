import './DeviceShell.css'

/**
 * 웹/앱 공용 껍데기.
 *
 *  - 폰 비율(390×844) 화면 한 벌(children)을 가운데에 놓는다.
 *  - 넓은 화면(웹): 폰을 기기 프레임으로 감싸고, 좌/우 빈 공간에 기능 설명(aside)을 채운다.
 *  - 좁은 화면(앱/폰): 프레임·설명 다 사라지고 화면이 뷰포트를 꽉 채운다.
 *
 * 화면 내용(children)은 웹이든 앱이든 그대로 재사용된다. 바깥 레이아웃만 CSS로 분기.
 */
export default function DeviceShell({ children, left, right }) {
  return (
    <div className="shell">
      <aside className="shell__aside shell__aside--left">{left}</aside>

      <div className="shell__device">
        <div className="shell__screen">{children}</div>
      </div>

      <aside className="shell__aside shell__aside--right">{right}</aside>
    </div>
  )
}
