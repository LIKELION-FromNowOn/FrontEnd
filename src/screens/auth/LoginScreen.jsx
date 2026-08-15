import { useNavigate } from 'react-router-dom'
import Character from '../../components/ui/Character'
import Button from '../../components/ui/Button'
import './LoginScreen.css'

/** A01_Auth/Login — 로고 + 캐릭터, 하단 모카 시트에 게스트 진입 */
export default function LoginScreen() {
  const navigate = useNavigate()

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

        <Button variant="cream" onClick={() => navigate('/auth/email')}>
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

        <p className="login__terms">
          계속 진행하면 지금부터의 서비스 약관 및 개인 정보 정책에 동의하는 것으로
          간주됩니다.
        </p>
      </section>
    </div>
  )
}
