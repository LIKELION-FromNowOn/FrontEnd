import { useNavigate } from 'react-router-dom'
import './Screen.css'

/**
 * 화면 공통 껍데기.
 * 뒤로가기(←) + 제목 + 설명 + 본문 + 하단 고정 액션 영역.
 *
 *   title    : 큰 제목 (줄바꿈은 \n 대신 <br/> 포함 JSX 가능)
 *   subtitle : 제목 아래 설명 한 줄
 *   back     : 뒤로가기 화살표 표시 여부
 *   footer   : 화면 하단에 붙는 액션 영역 (CTA 버튼 등)
 */
export default function Screen({ title, subtitle, back = false, footer, children }) {
  const navigate = useNavigate()

  return (
    <div className="screen">
      <div className="screen__body">
        {back && (
          <button
            type="button"
            className="screen__back"
            onClick={() => navigate(-1)}
            aria-label="뒤로"
          >
            ←
          </button>
        )}

        {title && <h1 className="screen__title">{title}</h1>}
        {subtitle && <p className="screen__subtitle">{subtitle}</p>}

        {children}
      </div>

      {footer && <div className="screen__footer">{footer}</div>}
    </div>
  )
}
