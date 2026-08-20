import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import { login, nextScreen } from '../../api/auth'
import { useAction } from '../../api/useApi'
import './PasswordSetupScreen.css'

/**
 * B02-1_Auth/LoginPassword — 이미 가입한 계정의 비밀번호 입력.
 *
 * 가입을 시도했는데 409 EMAIL_ALREADY_EXISTS 가 오면 여기로 온다.
 * 「이미 있는 계정이니 비밀번호를 넣어라」를 사용자에게 보여 주는 자리다.
 *
 * ⚠️ 가입 화면에서 친 비밀번호를 그대로 가져와 자동으로 로그인하지 않는다.
 *    가입하려던 사람이 방금 지은 비밀번호와, 예전에 쓰던 비밀번호는 다를 수 있다.
 *    말없이 실패시키면 「가입도 안 되고 로그인도 안 되는」 상태로 보인다.
 *
 * ⚠️ 틀린 이유를 갈라서 보여주지 않는다 — 서버가 없는 계정과 틀린 비밀번호를
 *    똑같은 401 로 준다(계정 열거 방지). 화면도 서버 문장 하나만 쓴다.
 */
export default function LoginPasswordScreen() {
  const navigate = useNavigate()
  const email = useLocation().state?.email ?? null

  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const signingIn = useAction(login)

  /* 주소를 직접 치고 들어오면 이메일이 없다. 처음부터 받게 되돌린다. */
  if (!email) return <Navigate to="/auth/email" replace />

  const onSubmit = async () => {
    try {
      await signingIn.run({ email, password })
    } catch {
      // 사유는 버튼 위에 뜬다. 입력은 그대로 두어 고쳐서 다시 누를 수 있게 한다.
      return
    }
    navigate(await nextScreen(), { replace: true })
  }

  return (
    <Screen
      back
      title={
        <>
          이미 가입한 계정이에요
          <br />
          비밀번호를 입력하세요
        </>
      }
      subtitle={`${email} 로 로그인할게요`}
      footer={
        <>
          {signingIn.error && (
            <p className="screen__hint" role="alert">
              {signingIn.errorText}
            </p>
          )}
          <Button disabled={!password || signingIn.pending} onClick={onSubmit}>
            {signingIn.pending ? '확인하는 중…' : '로그인'}
          </Button>
        </>
      }
    >
      <div className="pw">
        <input
          type={visible ? 'text' : 'password'}
          className="screen__line-input"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
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
