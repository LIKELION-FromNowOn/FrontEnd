import { useNavigate } from 'react-router-dom'
import Slot from '../../components/ui/Slot'
import Button from '../../components/ui/Button'
import './LoginScreen.css'

/** A01_Auth/Login — 로고 + 캐릭터, 하단 시트에 게스트 진입 버튼 */
export default function LoginScreen() {
  const navigate = useNavigate()

  return (
    <div className="login">
      <div className="login__hero">
        <Slot label="로고" width={180} height={44} />
        <p className="login__tagline">
          하루하루의 정신 건강을
          <br />
          위한 즐거움 앱!
        </p>
        <Slot label="캐릭터" shape="circle" width={160} />
      </div>

      <section className="login__sheet">
        <p className="login__sheet-label">게스트</p>

        <Button variant="outline" onClick={() => navigate('/auth/email')}>
          구글로 계속하기
        </Button>
        <Button variant="outline" onClick={() => navigate('/auth/email')}>
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
