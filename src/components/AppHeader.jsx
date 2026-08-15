import Slot from './ui/Slot'
import './AppHeader.css'

/**
 * 메인 화면 공통 상단바 — 캐릭터 + 닉네임 + 알림.
 * 히어로(모카) 위에 얹히는 경우와 흰 배경 위인 경우 모두 같은 컴포넌트를 쓴다.
 *
 *   onBrand : 모카 히어로 위에 올릴 때 true (배경 투명 처리)
 *   profile : 마이페이지 계열에서 종 왼쪽에 사람 아이콘을 함께 노출
 */
export default function AppHeader({ nickname = '닉네임', onBrand = false, profile = false }) {
  return (
    <header className={`appheader${onBrand ? ' appheader--on-brand' : ''}`}>
      <div className="appheader__user">
        <Slot label="캐릭터" shape="circle" width={26} sm />
        <span className="appheader__nickname">{nickname}</span>
      </div>

      <div className="appheader__actions">
        {profile && (
          <button type="button" className="appheader__bell" aria-label="내 정보">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M5.5 20c0-3.4 2.9-5.3 6.5-5.3s6.5 1.9 6.5 5.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}

        <button type="button" className="appheader__bell" aria-label="알림">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3a6 6 0 0 0-6 6v3.5L4.5 15.5h15L18 12.5V9a6 6 0 0 0-6-6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M10 18a2 2 0 0 0 4 0"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          </svg>
        </button>
      </div>
    </header>
  )
}
