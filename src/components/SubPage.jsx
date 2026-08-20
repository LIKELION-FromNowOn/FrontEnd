import { useNavigate } from 'react-router-dom'
import AppHeader from './AppHeader'
import './SubPage.css'

/**
 * 마이 계열 하위 화면 공통 껍데기.
 * 상단바(캐릭터+닉네임+아이콘) + 뒤로가기 + 제목 + 본문 + 하단 CTA.
 *
 *   title  : 뒤로가기 옆 제목 (없으면 화살표만)
 *   lead   : 제목 아래 안내 문구 (밑줄 구분선 포함)
 *   footer : 하단 고정 CTA
 */
export default function SubPage({ title, lead, footer, children }) {
  const navigate = useNavigate()

  return (
    <div className="subpage">
      <AppHeader profile />

      <div className="subpage__body">
        <div className="subpage__head">
          <button
            type="button"
            className="subpage__back"
            onClick={() => navigate(-1)}
            aria-label="뒤로"
          >
            ←
          </button>
          {title && <h1 className="subpage__title">{title}</h1>}
        </div>

        {lead && <p className="subpage__lead">{lead}</p>}

        {children}
      </div>

      {footer && <div className="subpage__footer">{footer}</div>}
    </div>
  )
}
