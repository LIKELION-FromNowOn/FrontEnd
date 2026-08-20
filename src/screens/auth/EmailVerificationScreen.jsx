import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import { ComingSoonBanner } from '../../components/ComingSoon'
import './EmailVerificationScreen.css'

const LENGTH = 6

/**
 * B03_Auth/EmailVerification — 인증코드 6자리.
 *
 * ⚠️ **이번 범위 밖이다** — 노션 NOW-AUTH-003 「이번 범위에 넣지 않는 것」에
 *    이메일 인증코드가 들어 있다(SMTP 가 없다). 가입 흐름에서 이 화면을 빼서
 *    B02 다음에 바로 가입이 끝난다. 주소로 직접 들어올 수는 있어 안내만 남긴다.
 */
export default function EmailVerificationScreen() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  return (
    <Screen
      back
      title={
        <>
          <ComingSoonBanner>이메일 인증은 다음 단계에서 준비 중이에요</ComingSoonBanner>
          이메일로 전송된
          <br />
          인증코드를 입력하세요
        </>
      }
      footer={
        <Button
          disabled={code.length < LENGTH}
          onClick={() => navigate('/onboarding/care-items')}
        >
          회원가입
        </Button>
      }
    >
      <p className="verify__email">가입하신 이메일 주소</p>

      {/* 칸은 보여주기용이고 입력은 하나의 input이 받는다 */}
      <label className="verify__boxes">
        <span className="verify__sr">인증코드 {LENGTH}자리</span>
        <input
          className="verify__input"
          inputMode="numeric"
          maxLength={LENGTH}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          autoComplete="one-time-code"
        />
        {Array.from({ length: LENGTH }, (_, i) => (
          <span key={i} className="verify__box" aria-hidden>
            {code[i] ?? ''}
          </span>
        ))}
      </label>

      <button type="button" className="verify__resend">
        인증코드 재발송
      </button>
    </Screen>
  )
}
