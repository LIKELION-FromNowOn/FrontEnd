import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import { login, nextScreen, signup } from '../../api/auth'
import { ERROR } from '../../api/errors'
import { useAction } from '../../api/useApi'
import './PasswordSetupScreen.css'

/**
 * B02_Auth/PasswordSetup — 가입과 로그인이 한 화면에서 갈린다.
 *
 * **가입을 먼저 시도한다.** 서버가 「없는 계정」과 「틀린 비밀번호」를 똑같은 401 로 주기
 * 때문에(계정 열거 방지), 로그인을 먼저 걸면 401 을 받은 순간 어느 쪽인지 알 수 없다.
 * 그 상태에서 「처음 오셨네요」를 띄우면 **비밀번호를 잘못 친 사람에게 거짓말을 하게 된다.**
 *
 * 가입은 409 EMAIL_ALREADY_EXISTS 로 「이미 있는 계정」을 **정확히** 알려준다.
 * 그래서 가입을 먼저 던지고 409 가 오면 그때부터 로그인으로 확정한다.
 *
 *   signup 201            새 계정 → 끝
 *   signup 409 → login 200  이미 있는 계정이고 비밀번호도 맞음 → 끝 (화면을 안 옮긴다)
 *   signup 409 → login 401  이미 있는 계정인데 비밀번호가 틀림
 *                           → 화면을 로그인으로 바꾸고 「비밀번호가 올바르지 않습니다」
 *
 * 마지막 갈래에서 닉네임 칸을 감추고 문구를 바꾸는 것이 핵심이다. 이미 있는 계정에
 * 이름을 계속 물으면 안 된다.
 *
 * ⚠️ 닉네임 입력이 시안에 없다. 가입에 필수라(없으면 400) 여기서 같이 받는다.
 * ⚠️ 닉네임 칸에 autoComplete="off" 를 준다. 브라우저가 비밀번호 옆 글자 칸을
 *    아이디 칸으로 보고 방금 친 비밀번호를 넣어 버린다.
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
  /* 'signup' 으로 시작해서, 409 를 받으면 'login' 으로 확정된다. 되돌아가지 않는다. */
  const [mode, setMode] = useState('signup')

  const submitting = useAction(async () => {
    if (mode === 'login') return login({ email, password })

    try {
      return await signup({ email, password, nickname: nickname.trim() })
    } catch (err) {
      if (err?.code !== ERROR.EMAIL_ALREADY_EXISTS) throw err
      /* 이미 있는 계정이다. 여기서부터는 로그인이고, 이름은 더 묻지 않는다.
         방금 친 비밀번호가 맞을 수도 있으니 한 번은 그대로 시도해 본다 —
         맞으면 화면을 옮기지 않고 바로 들어간다. */
      setMode('login')
      setNickname('')
      return await login({ email, password })
    }
  })

  /* 주소를 직접 치고 들어오면 이메일이 없다. 처음부터 받게 되돌린다. */
  if (!email) return <Navigate to="/auth/email" replace />

  const isLogin = mode === 'login'
  const tooShort = password.length > 0 && password.length < MIN_PASSWORD
  const canSubmit =
    password.length >= MIN_PASSWORD &&
    password.length <= MAX_PASSWORD &&
    (isLogin || nickname.trim().length > 0)

  /**
   * 로그인 단계의 401 은 「이미 있는 계정인데 비밀번호가 틀렸다」가 확실하다.
   * 409 를 먼저 받고 온 자리라 계정 존재 여부가 새어나가지 않는다.
   * 그 밖의 오류는 서버 문장을 그대로 쓴다.
   */
  const errorText =
    submitting.error?.code === ERROR.INVALID_CREDENTIALS
      ? '비밀번호가 올바르지 않습니다'
      : submitting.errorText

  const onSubmit = async () => {
    try {
      await submitting.run()
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
        isLogin ? (
          <>
            이미 가입된 이메일이에요
            <br />
            비밀번호를 입력하세요
          </>
        ) : (
          <>
            비밀번호를
            <br />
            입력하세요
          </>
        )
      }
      subtitle={`${email} 로 시작할게요`}
      footer={
        <>
          {submitting.error && (
            <p className="screen__hint" role="alert">
              {errorText}
            </p>
          )}
          <Button disabled={!canSubmit || submitting.pending} onClick={onSubmit}>
            {submitting.pending ? '확인하는 중…' : isLogin ? '로그인' : '다음'}
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
          autoComplete={isLogin ? 'current-password' : 'new-password'}
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

      {/* 이미 있는 계정이면 이름을 묻지 않는다. 가입할 때만 필요한 값이다. */}
      {!isLogin && (
        <div className="pw__nickname">
          <label className="screen__field-label" htmlFor="signup-nickname">
            앱에서 부를 이름
          </label>
          <input
            id="signup-nickname"
            name="signup-nickname"
            type="text"
            className="screen__line-input"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            /* 브라우저가 비밀번호 옆 글자 칸을 아이디 칸으로 보고
               방금 친 비밀번호를 채워 넣는 일이 있었다. 자동완성을 끈다. */
            autoComplete="off"
            maxLength={20}
          />
        </div>
      )}
    </Screen>
  )
}
