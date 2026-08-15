import Character from './ui/Character'
import { BellIcon, MyIcon } from './ui/Icon'
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
        <Character variant="face" width={24} />
        <span className="appheader__nickname">{nickname}</span>
      </div>

      <div className="appheader__actions">
        {profile && (
          <button type="button" className="appheader__icon" aria-label="내 정보">
            <MyIcon size={18} />
          </button>
        )}

        <button type="button" className="appheader__icon" aria-label="알림">
          <BellIcon size={20} />
        </button>
      </div>
    </header>
  )
}
