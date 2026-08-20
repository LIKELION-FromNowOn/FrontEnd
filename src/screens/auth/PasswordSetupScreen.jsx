import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Screen from '../../components/ui/Screen'
import Button from '../../components/ui/Button'
import { login, nextScreen, signup } from '../../api/auth'
import { ERROR } from '../../api/errors'
import { useAction } from '../../api/useApi'
import './PasswordSetupScreen.css'

/**
 * B02_Auth/PasswordSetup — 비밀번호 입력. 가입과 로그인이 여기서 갈린다.
 *
 * **로그인을 먼저 시도한다.** 이미 가입한 사람에게 「비밀번호를 설정하세요」와
 * 닉네임 칸부터 들이밀면 안 되기 때문이다 — 그 사람은 설정할 게 없다.
 *
 *   1. 비밀번호만 받아 로그인 → 200 이면 끝. 여기서 대부분의 재방문이 끝난다.
 *   2. 401 이면 **아직 모른다.** 서버가 「없는 계정」과 「틀린 비밀번호」를 일부러
 *      같은 401 로 준다(계정 열거 방지). 그래서 이때 처음 닉네임을 묻는다.
 *   3. 닉네임을 받아 가입 → 201 이면 새 계정이었던 것.
 *      409 면 계정이 있다는 뜻이므로 아까 401 은 **비밀번호가 틀린 것**이었다.
 *      로그인 화면(B02-1)으로 보내 다시 치게 한다.
 *
 * ⚠️ 401 을 「새 계정이구나」로 읽고 곧장 가입시키면 안 된다. 비밀번호를 잘못 친
 *    사람에게 엉뚱한 계정을 만들어 준다. 그래서 3에서 409 를 반드시 확인한다.
 *
 * ⚠️ 닉네임 입력이 시안에 없다. 가입에 필수라(없으면 400) 새 계정일 때만 펼친다.
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
  /* 로그인이 401 로 튕긴 뒤에야 닉네임을 묻는다. 그전에는 새 계정인지 알 수 없다. */
  const [asksNickname, setAsksNickname] = useState(false)

  const submitting = useAction(async () => {
    if (!asksNickname) {
      try {
        return await login({ email, password })
      } catch (err) {
        if (err?.code !== ERROR.INVALID_CREDENTIALS) throw err
        /* 없는 계정일 수도, 비밀번호가 틀렸을 수도 있다. 이름을 받아 가입을 시도해 본다. */
        setAsksNickname(true)
        return null
      }
    }
    return signup({ email, password, nickname: nickname.trim() })
  })

  /* 주소를 직접 치고 들어오면 이메일이 없다. 처음부터 받게 되돌린다. */
  if (!email) return <Navigate to="/auth/email" replace />

  const tooShort = password.length > 0 && password.length < MIN_PASSWORD
  const canSubmit =
    password.length >= MIN_PASSWORD &&
    password.length <= MAX_PASSWORD &&
    (!asksNickname || nickname.trim().length > 0)

  const onSubmit = async () => {
    let session
    try {
      session = await submitting.run()
    } catch (err) {
      /* 가입이 409 면 계정이 있다는 뜻이다 — 아까 401 은 비밀번호가 틀린 것이었다.
         이름을 계속 묻고 있으면 안 되므로 로그인 화면으로 넘긴다. */
      if (err?.code === ERROR.EMAIL_ALREADY_EXISTS) {
        navigate('/auth/login', { state: { email } })
      }
      // 그 밖의 사유는 버튼 위에 뜬다. 입력은 그대로 두어 고쳐서 다시 누를 수 있게 한다.
      return
    }
    /* 로그인이 튕겨서 이름을 물어보기 시작한 차례다. 아직 들여보내지 않는다. */
    if (!session) return
    /* 게스트로 고른 것이 계정으로 넘어왔는지에 따라 갈 곳이 다르다. 서버에 물어본다. */
    navigate(await nextScreen(), { replace: true })
  }

  return (
    <Screen
      back
      title={
        asksNickname ? (
          <>
            처음 오셨네요
            <br />
            앱에서 부를 이름을 알려주세요
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
              {submitting.errorText}
            </p>
          )}
          <Button disabled={!canSubmit || submitting.pending} onClick={onSubmit}>
            {submitting.pending
              ? '확인하는 중…'
              : asksNickname
                ? '가입하고 시작하기'
                : '다음'}
          </Button>
        </>
      }
    >
      <div className="pw">
        <input
          type={visible ? 'text' : 'password'}
          className="screen__line-input"
          placeholder={`비밀번호 (${MIN_PASSWORD}자 이상)`}
          readOnly={asksNickname}
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

      {/* 새 계정일 때만 펼친다. 이미 가입한 사람에게는 물을 것이 아니다(위 주석 참고).
          비밀번호 칸과 붙어 있으면 한 덩어리로 보여서 사이를 띄운다. */}
      {asksNickname && (
        <div className="pw__nickname">
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
            autoFocus
          />
        </div>
      )}
    </Screen>
  )
}
