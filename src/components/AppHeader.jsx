import { useLocation, useNavigate } from 'react-router-dom'
import Character from './ui/Character'
import { BellIcon, MyIcon } from './ui/Icon'
import { useNickname } from '../api/useMe'
import { useComingSoon } from './useComingSoon'
import './AppHeader.css'

const PROFILE_PATH = '/my/profile'

/**
 * 메인 화면 공통 상단바 — 캐릭터 + 닉네임 + 알림.
 * 히어로(모카) 위에 얹히는 경우와 흰 배경 위인 경우 모두 같은 컴포넌트를 쓴다.
 *
 *   onBrand : 모카 히어로 위에 올릴 때 true (배경 투명 처리)
 *   사람 아이콘은 **로그인 이후 모든 화면**에 뜬다. 누르면 프로필 설정으로 간다.
 *   단 프로필 설정 화면에서는 감춘다 — 지금 보고 있는 화면으로 가는 버튼이라 쓸모가 없다.
 *
 * 닉네임은 **여기서 직접 받아온다**(GET /me). 화면마다 넘기게 두었더니
 * 13곳에 같은 이름이 박혀서 모든 사용자가 남의 이름을 보고 있었다(2026-08-21).
 * nickname 을 넘기면 그 값이 이긴다 — 지금은 넘기는 곳이 없다.
 */
export default function AppHeader({ nickname, onBrand = false }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const fromServer = useNickname()
  const name = nickname ?? fromServer

  /* 프로필 설정 화면에서는 감춘다. 자기 자신으로 가는 버튼이다. */
  const showProfile = pathname !== PROFILE_PATH
  /* 알림은 이번 범위 밖이다 — 푸시를 보낼 준비가 서버에 없고 명세 36건에도 없다.
     눌러도 아무 일이 안 일어나면 고장 난 것처럼 보이므로 준비 중임을 알린다. */
  const [comingSoon, notify] = useComingSoon()

  return (
    <header className={`appheader${onBrand ? ' appheader--on-brand' : ''}`}>
      <div className="appheader__user">
        <Character variant="face" width={24} />
        <span className="appheader__nickname">{name}</span>
      </div>

      <div className="appheader__actions">
        {showProfile && (
          <button
            type="button"
            className="appheader__icon"
            aria-label="프로필 설정"
            onClick={() => navigate(PROFILE_PATH)}
          >
            <MyIcon size={18} />
          </button>
        )}

        <button
          type="button"
          className="appheader__icon"
          aria-label="알림"
          onClick={() => notify('알림')}
        >
          <BellIcon size={20} />
        </button>
      </div>

      {comingSoon}
    </header>
  )
}
