import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'

/**
 * B01_Auth/EmailInput — 이메일 입력.
 *
 * 가입과 로그인이 한 흐름이다. 여기서는 이메일만 받고, 다음 화면(B02)에서
 * 비밀번호를 받아 **가입을 먼저 시도하고 이미 있는 계정이면 로그인으로 넘어간다.**
 * 여기서 「가입인지 로그인인지」를 먼저 묻지 않는 이유는, 물어보려면 서버에
 * 「이 이메일 가입돼 있나요」를 확인해야 하는데 그게 가입자 목록을 만들어 주기 때문이다.
 */
const looksLikeEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

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
        <Button
          disabled={!looksLikeEmail(email)}
          onClick={() =>
            /* 다음 화면이 가입에 이메일을 써야 한다. 주소창에 실으면 남의 눈에 남는다. */
            navigate('/auth/password', { state: { email: email.trim() } })
          }
        >
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
