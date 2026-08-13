import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import './EmailVerificationScreen.css'

const LENGTH = 6

/** B03_Auth/EmailVerification — 인증코드 6자리 */
export default function EmailVerificationScreen() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')

  return (
    <Screen
      back
      title={
        <>
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
