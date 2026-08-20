import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import { login, nextScreen, signup } from '../../api/auth'
import { ERROR } from '../../api/errors'
import { useAction } from '../../api/useApi'
import './PasswordSetupScreen.css'

/**
 * B02_Auth/PasswordSetup — 비밀번호(+닉네임) 설정.
 *
 * **가입과 로그인이 여기서 갈린다.**
 *   가입을 먼저 시도한다 → 201 이면 끝
 *   409 EMAIL_ALREADY_EXISTS 면 이미 있는 계정이므로 같은 비밀번호로 로그인한다
 *
 * 순서가 반대면 안 된다. 로그인을 먼저 시도하면 비밀번호를 잘못 친 사람에게
 * 401 이 오는데, 서버가 「없는 계정」과 「틀린 비밀번호」를 **일부러 구분해 주지 않으므로**
 * 그 401 을 「새 계정이구나」로 읽고 엉뚱한 계정을 만들게 된다.
 *
 * ⚠️ **닉네임 입력이 시안에 없다.** 그런데 가입에 필수라(없으면 400) 여기서 같이 받는다.
 *    별도 화면을 새로 만들지 않고 이 화면에 한 줄 더 두는 쪽을 골랐다. 시안 확인 필요.
 */
const MIN_PASSWORD = 8
const MAX_PASSWORD = 64

export default function PasswordSetupScreen() {
  const navigate = useNavigate()
  /* 이메일은 B01 에서 들고 온다. 주소창에 실으면 남의 눈에 남는다. */
  const email = useLocation().state?.email ?? null

  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [visible, setVisible] = useState(false)

  const submitting = useAction(async () => {
    try {
      return await signup({ email, password, nickname: nickname.trim() })
    } catch (err) {
      /* 이미 있는 계정이면 가입이 아니라 로그인이다. 그 밖의 오류는 그대로 올린다. */
      if (err?.code !== ERROR.EMAIL_ALREADY_EXISTS) throw err
      return await login({ email, password })
    }
  })

  /* 주소를 직접 치고 들어오면 이메일이 없다. 처음부터 받게 되돌린다. */
  if (!email) return <Navigate to="/auth/email" replace />

  const tooShort = password.length > 0 && password.length < MIN_PASSWORD
  const canSubmit =
    password.length >= MIN_PASSWORD &&
    password.length <= MAX_PASSWORD &&
    nickname.trim().length > 0

  const onSubmit = async () => {
    try {
      await submitting.run()
    } catch {
      // 사유는 버튼 위에 뜬다. 입력은 그대로 두어 고쳐서 다시 누를 수 있게 한다.
      return
    }
    /* 게스트로 고른 것이 계정으로 넘어왔는지에 따라 갈 곳이 다르다. 서버에 물어본다. */
    navigate(await nextScreen(), { replace: true })
  }

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
      subtitle={`${email} 로 시작할게요`}
      footer={
        <>
          {submitting.error && (
            <p className="screen__hint" role="alert">
              {submitting.errorText}
            </p>
          )}
          <Button disabled={!canSubmit || submitting.pending} onClick={onSubmit}>
            {submitting.pending ? '확인하는 중…' : '다음'}
          </Button>
        </>
      }
    >
      <div className="pw">
        <input
          type={visible ? 'text' : 'password'}
          className="screen__line-input"
          placeholder={`비밀번호 (${MIN_PASSWORD}자 이상)`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          maxLength={MAX_PASSWORD}
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

      {tooShort && (
        <p className="screen__hint" role="status">
          {MIN_PASSWORD}자 이상으로 적어주세요
        </p>
      )}

      {/* 시안에 없는 줄이다. 가입에 필수라 여기서 같이 받는다(위 주석 참고). */}
      <label className="screen__field-label" htmlFor="signup-nickname">
        앱에서 부를 이름
      </label>
      <input
        id="signup-nickname"
        type="text"
        className="screen__line-input"
        placeholder="닉네임을 입력하세요"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        autoComplete="nickname"
        maxLength={20}
      />
    </Screen>
  )
}
