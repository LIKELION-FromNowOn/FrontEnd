import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import './PasswordSetupScreen.css'

/** B02_Auth/PasswordSetup */
export default function PasswordSetupScreen() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)

  return (
    <Screen
      back
      title={
        <>
          회원가입을 위해
          <br />
          비밀번호를 설정하세요
        </>
      }
      footer={
        <Button disabled={!password} onClick={() => navigate('/auth/verify')}>
          다음
        </Button>
      }
    >
      <div className="pw">
        <input
          type={visible ? 'text' : 'password'}
          className="screen__line-input"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button
          type="button"
          className="pw__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? '비밀번호 숨기기' : '비밀번호 표시'}
        >
          {visible ? '◉' : '◎'}
        </button>
      </div>
    </Screen>
  )
}
