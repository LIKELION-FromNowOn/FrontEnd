import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'

/** B01_Auth/EmailInput */
export default function EmailInputScreen() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  return (
    <Screen
      back
      title={
        <>
          로그인 및 회원가입을 위해
          <br />
          이메일을 입력하세요
        </>
      }
      footer={
        <Button disabled={!email} onClick={() => navigate('/auth/password')}>
          로그인 및 회원가입
        </Button>
      }
    >
      <input
        type="email"
        className="screen__line-input"
        placeholder="이메일을 입력하세요"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
    </Screen>
  )
}
