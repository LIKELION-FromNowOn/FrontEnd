import { useNavigate } from 'react-router-dom'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import { nextScreen, startGuest } from '../../api/auth'
import { useAction } from '../../api/useApi'
import { useComingSoon } from '../../components/useComingSoon'
import './LoginScreen.css'

/** A01_Auth/Login — 로고 + 캐릭터, 하단 모카 시트에 게스트 진입 */
export default function LoginScreen() {
  const navigate = useNavigate()
  const guest = useAction(startGuest)
  /* 구글 로그인은 이번 범위 밖이다 — 노션 NOW-AUTH-003 「이번 범위에 넣지 않는 것」.
     콘솔 등록이 필요해서 붙이려면 우리 쪽만으로 안 된다. 줄은 남기고 준비 중을 띄운다. */
  const [comingSoon, notify] = useComingSoon()

  /**
   * 게스트로 시작 (NOW-AUTH-001).
   * 2026-08-19 기준 서버에서 실제로 동작하는 유일한 API다.
   * 토큰을 받아 두면 이후 요청에 Authorization 헤더가 자동으로 붙는다.
   */
  const onGuest = async () => {
    try {
      await guest.run()
      /* 이어서 쓰던 게스트면 항목·상태가 이미 있을 수 있다. 갈 곳을 서버에 물어본다. */
      navigate(await nextScreen(), { replace: true })
    } catch {
      // 실패해도 화면은 막지 않는다. 아래에 사유를 띄우고 사용자가 다시 누를 수 있다.
    }
  }

  return (
    <div className="login">
      <div className="login__hero">
        <h1 className="login__logo">지금부터</h1>
        <p className="login__tagline">
          오늘 상태를 판정해서 피부 관리를
          <br />
          조정해 주는 서비스
        </p>
        <div className="login__character">
          <Character variant="fullCircle" width={190} />
        </div>
      </div>

      <section className="login__sheet">
        <p className="login__sheet-label">게스트</p>

        <Button variant="cream" disabled={guest.pending} onClick={onGuest}>
          <span className="login__icon" aria-hidden>
            🐌
          </span>
          {guest.pending ? '시작하는 중…' : '게스트로 시작하기'}
        </Button>

        {guest.error && (
          <p className="login__error" role="alert">
            {guest.errorText}
          </p>
        )}

        <Button variant="cream" onClick={() => notify('구글 로그인')}>
          <span className="login__icon" aria-hidden>
            G
          </span>
          구글로 계속하기
        </Button>
        <Button variant="cream" onClick={() => navigate('/auth/email')}>
          <span className="login__icon" aria-hidden>
            ✉
          </span>
          이메일로 계속하기
        </Button>

        {comingSoon}

        <p className="login__terms">
          계속 진행하면 지금부터의 서비스 약관 및 개인 정보 정책에 동의하는 것으로
          간주됩니다.
        </p>
      </section>
    </div>
  )
}
