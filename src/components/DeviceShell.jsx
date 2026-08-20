import './DeviceShell.css'

/**
 * 웹/앱 공용 껍데기.
 *
 *  - 폰 비율(390×844) 화면 한 벌(children)을 가운데에 놓는다.
 *  - 넓은 화면(웹): 폰을 기기 프레임으로 감싸고, 바깥은 시안의 배경(모래색 + 물결)으로 채운다.
 *  - 좁은 화면(앱/폰): 프레임·배경 다 사라지고 화면이 뷰포트를 꽉 채운다.
 *
 * 화면 내용(children)은 웹이든 앱이든 그대로 재사용된다. 바깥 레이아웃만 CSS로 분기.
 */
export default function DeviceShell({ children }) {
  return (
    <div className="shell">
      {/*
        바깥 배경의 물결.
        preserveAspectRatio="none" 이라 어떤 폭에서도 가로로 늘어난다 —
        화면 폭마다 곡선을 새로 그리지 않아도 된다.
        장식이라 스크린리더에서 숨긴다.
      */}
      <svg
        className="shell__wave"
        viewBox="0 0 1440 240"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M0,95 C80,60 160,48 250,55 C400,68 560,110 780,120 C950,128 1120,110 1250,70 C1310,52 1380,55 1440,80 L1440,240 L0,240 Z" />
      </svg>

      <div className="shell__device">
        <div className="shell__screen">{children}</div>
      </div>
    </div>
  )
}
